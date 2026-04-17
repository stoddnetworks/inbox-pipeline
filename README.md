# Inbox Pipeline

Turn inbound email enquiries into a simple pipeline automatically.

An inbox-first AI workflow for solo service businesses. Connect Gmail, and the system monitors incoming emails, identifies genuine business enquiries, extracts structured lead details, drafts a reply, and places each enquiry into a clean kanban board.

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase/schema.sql`
3. Go to Settings > API and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`
4. Go to Authentication > Settings and ensure email auth is enabled

### 2. Gmail OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable the **Gmail API**
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Set application type to **Web application**
6. Add authorized redirect URI: `http://localhost:3000/api/auth/gmail/callback`
7. Copy Client ID → `GMAIL_CLIENT_ID`
8. Copy Client Secret → `GMAIL_CLIENT_SECRET`
9. Go to OAuth consent screen:
   - Add your email as a test user
   - Add scopes: `gmail.readonly`, `gmail.send`, `gmail.modify`

### 3. Claude API

1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. Copy it → `ANTHROPIC_API_KEY`

### 4. Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in all values in `.env.local`.

### 5. Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

1. **Sign up / Sign in** — email + password via Supabase Auth
2. **Connect Gmail** — OAuth flow grants read + send access
3. **Sync Inbox** — fetches recent inbox emails (excludes promos, social, updates)
4. **AI Classification** — Claude classifies each email as:
   - Business enquiry
   - Existing client conversation
   - Newsletter / promo
   - Spam / irrelevant
   - Needs Review (low confidence)
5. **Lead Extraction** — for business enquiries, Claude extracts:
   - Name, company, service requested, summary
   - Urgency, budget hints, location
   - Meeting/call intent, confidence score
6. **Draft Reply** — Claude generates a reply in your tone
7. **Pipeline Board** — leads appear in a kanban: New → Replied → Booked → Lost
8. **Review & Send** — edit the draft, send with one click via Gmail

## Tech Stack

- **Next.js 16** — App Router, TypeScript
- **Supabase** — Auth, Postgres database, Row Level Security
- **Gmail API** — OAuth2, read inbox, send replies
- **Claude API** — Classification, extraction, summarization, reply drafting
- **Tailwind CSS** — Styling
- **Lucide** — Icons

## Data Model

| Table | Purpose |
|-------|---------|
| `users` | User profiles, tone preferences |
| `connected_accounts` | Gmail OAuth tokens |
| `email_threads` | Fetched emails with classification |
| `leads` | Pipeline cards with extracted details |
| `lead_events` | Activity timeline per lead |
| `drafted_replies` | AI-generated reply drafts |

## What's Working

- User auth (sign up, sign in, sign out)
- Gmail OAuth connection flow
- Email fetching from Gmail inbox
- AI email classification (Claude)
- AI lead detail extraction
- AI reply drafting
- Kanban pipeline board (New, Replied, Booked, Lost)
- Lead detail drawer with all extracted fields
- Edit and send replies via Gmail
- Regenerate draft button
- Status management (mark booked, lost, reopen)
- Activity timeline per lead
- "Needs Review" filter for low-confidence leads
- Confidence badge on leads
- Dashboard stats

## What's Stubbed / To Complete

- **Token refresh**: Gmail access tokens expire after 1 hour. The OAuth2 client has the refresh token but automatic refresh on 401 is not yet wired up as middleware.
- **Webhook/push sync**: Currently manual "Sync Inbox" button. Could use Gmail push notifications for real-time.
- **Pagination**: Leads list loads all at once. Fine for solo use, would need pagination at scale.
- **Email threading**: Currently processes individual messages, not full thread context.
- **Tone learning**: The tone preference is a text field. Could learn from the user's sent emails.
- **Mobile optimization**: Responsive but not fully mobile-optimized.
- **Error toasts**: Errors are logged to console. Could add toast notifications.
