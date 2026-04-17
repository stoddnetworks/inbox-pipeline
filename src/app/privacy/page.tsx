import LegalLayout from '@/components/LegalLayout';

export const metadata = {
  title: 'Privacy Policy · Inbox Pipeline',
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="17 April 2026">
      <p>
        Inbox Pipeline is open-source software maintained by Stephen Todd (&quot;I&quot;, &quot;me&quot;). You can
        self-host it, or use the hosted demo version at inbox-pipeline.vercel.app. This policy
        explains what data the software handles, how, and what rights you have.
      </p>

      <h2>Short version</h2>
      <ul>
        <li>I don&apos;t sell your data. Ever.</li>
        <li>If you self-host, your data lives in your Supabase and your Google account. I don&apos;t see it.</li>
        <li>If you use the hosted version, email content is sent to Anthropic&apos;s Claude API to be classified and summarised, then the results are stored in my Supabase database.</li>
        <li>You can delete everything at any time by disconnecting Gmail and deleting your account.</li>
      </ul>

      <h2>What data Inbox Pipeline handles</h2>

      <h3>Account data</h3>
      <p>
        When you sign up, I store your email address and a bcrypt-hashed password (handled by Supabase Auth).
        I don&apos;t store plaintext passwords.
      </p>

      <h3>Gmail OAuth tokens</h3>
      <p>
        When you connect your Gmail, Google returns an access token and refresh token. These are stored
        encrypted in the database and are used only to (a) read your inbox to find new enquiries, and
        (b) send replies you explicitly approve. These tokens are never shared with third parties.
      </p>

      <h3>Email content</h3>
      <p>
        Inbox Pipeline reads the most recent messages in your Gmail inbox. For each message, it stores:
      </p>
      <ul>
        <li>Sender name and email address</li>
        <li>Subject line</li>
        <li>Message body text</li>
        <li>Received timestamp</li>
        <li>Gmail message and thread IDs</li>
      </ul>
      <p>
        Message content is sent to the Claude API (Anthropic) for classification, extraction, and reply drafting.
        Anthropic&apos;s data-handling policies apply to that transmission. I don&apos;t store anything on
        Anthropic&apos;s side beyond what their API already logs under their policy.
      </p>

      <h3>Lead and pipeline data</h3>
      <p>
        Extracted lead details (name, company, service requested, urgency, budget hint, location,
        confidence score), drafted replies, status changes, and activity timeline are stored in the
        database so you can view them in your pipeline.
      </p>

      <h2>Where data is stored</h2>
      <ul>
        <li><strong>Database:</strong> Supabase (PostgreSQL), hosted on AWS regions configured by Supabase.</li>
        <li><strong>Application hosting:</strong> Vercel.</li>
        <li><strong>AI processing:</strong> Anthropic (Claude API).</li>
        <li><strong>Gmail access:</strong> Google, authenticated via OAuth 2.0.</li>
      </ul>

      <h2>How data is used</h2>
      <p>
        Your email content and account data are used only to provide the core product functionality:
        classifying incoming emails, drafting replies, and displaying your pipeline. I do not use your
        data to train AI models. I don&apos;t share it with advertisers, data brokers, or anyone else.
      </p>

      <h2>Data retention</h2>
      <p>
        Data is retained as long as your account is active. If you delete your account, all associated
        data (emails, leads, drafts, events, OAuth tokens) is permanently removed within 30 days.
      </p>

      <h2>Your rights</h2>
      <p>
        You can, at any time:
      </p>
      <ul>
        <li>Export your data (contact me at the email below)</li>
        <li>Disconnect your Gmail account (revokes the OAuth token)</li>
        <li>Delete your account and all associated data</li>
        <li>Request a correction to any data I hold about you</li>
      </ul>
      <p>
        You can also revoke Inbox Pipeline&apos;s access to your Gmail directly at{' '}
        <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">
          myaccount.google.com/permissions
        </a>.
      </p>

      <h2>Cookies</h2>
      <p>
        Inbox Pipeline uses a single cookie for authentication (your Supabase session). No tracking cookies,
        no analytics cookies, no advertising cookies.
      </p>

      <h2>Security</h2>
      <p>
        All traffic is over HTTPS. OAuth tokens are encrypted at rest. Access to the production database is
        restricted to the service role key, which is never exposed to the browser. That said, this is a
        solo-maintained open-source project and not an enterprise-grade service. For business-critical use,
        self-hosting is recommended.
      </p>

      <h2>Contact</h2>
      <p>
        Questions, requests, or concerns? Email{' '}
        <a href="mailto:stoddnetworks@gmail.com">stoddnetworks@gmail.com</a>.
      </p>
    </LegalLayout>
  );
}
