import { google } from 'googleapis';

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/gmail/callback`
  );
}

export function getAuthUrl() {
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.modify',
    ],
  });
}

export function getGmailClient(accessToken: string, refreshToken: string) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

function decodeBase64Url(data: string): string {
  return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
}

function extractBody(payload: {
  mimeType?: string;
  body?: { data?: string };
  parts?: Array<{ mimeType?: string; body?: { data?: string }; parts?: unknown[] }>;
}): { text: string; html: string } {
  let text = '';
  let html = '';

  if (payload.mimeType === 'text/plain' && payload.body?.data) {
    text = decodeBase64Url(payload.body.data);
  } else if (payload.mimeType === 'text/html' && payload.body?.data) {
    html = decodeBase64Url(payload.body.data);
  } else if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        text = decodeBase64Url(part.body.data);
      } else if (part.mimeType === 'text/html' && part.body?.data) {
        html = decodeBase64Url(part.body.data);
      }
    }
  }

  return { text, html };
}

export interface ParsedEmail {
  messageId: string;
  threadId: string;
  fromName: string | null;
  fromEmail: string;
  subject: string;
  snippet: string;
  bodyText: string;
  bodyHtml: string;
  receivedAt: Date;
}

export async function fetchRecentEmails(
  accessToken: string,
  refreshToken: string,
  maxResults = 20
): Promise<ParsedEmail[]> {
  const gmail = getGmailClient(accessToken, refreshToken);

  const list = await gmail.users.messages.list({
    userId: 'me',
    maxResults,
    q: 'in:inbox -category:promotions -category:social -category:updates',
  });

  if (!list.data.messages) return [];

  const emails: ParsedEmail[] = [];

  for (const msg of list.data.messages) {
    try {
      const full = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id!,
        format: 'full',
      });

      const headers = full.data.payload?.headers || [];
      const fromHeader = headers.find(h => h.name?.toLowerCase() === 'from')?.value || '';
      const subject = headers.find(h => h.name?.toLowerCase() === 'subject')?.value || '';
      const dateHeader = headers.find(h => h.name?.toLowerCase() === 'date')?.value || '';

      // Parse "Name <email>" format
      const fromMatch = fromHeader.match(/^(?:"?([^"<]*)"?\s*)?<?([^>]+@[^>]+)>?$/);
      const fromName = fromMatch?.[1]?.trim() || null;
      const fromEmail = fromMatch?.[2]?.trim() || fromHeader;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { text, html } = extractBody(full.data.payload as any || {});

      emails.push({
        messageId: full.data.id!,
        threadId: full.data.threadId!,
        fromName,
        fromEmail,
        subject,
        snippet: full.data.snippet || '',
        bodyText: text,
        bodyHtml: html,
        receivedAt: new Date(dateHeader || full.data.internalDate || Date.now()),
      });
    } catch (err) {
      console.error(`Failed to fetch message ${msg.id}:`, err);
    }
  }

  return emails;
}

export async function sendReply(
  accessToken: string,
  refreshToken: string,
  to: string,
  subject: string,
  body: string,
  threadId: string,
  messageId: string
): Promise<string | null> {
  const gmail = getGmailClient(accessToken, refreshToken);

  const rawMessage = [
    `To: ${to}`,
    `Subject: ${subject.startsWith('Re:') ? subject : `Re: ${subject}`}`,
    `In-Reply-To: ${messageId}`,
    `References: ${messageId}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    body,
  ].join('\n');

  const encodedMessage = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const result = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
      threadId,
    },
  });

  return result.data.id || null;
}
