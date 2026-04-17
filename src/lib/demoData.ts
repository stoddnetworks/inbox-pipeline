import { LeadWithDraft } from './types';

// Demo user/lead IDs are deterministic so React keys stay stable across renders.
const DEMO_USER_ID = 'demo-user';

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

function daysAgo(d: number): string {
  return hoursAgo(d * 24);
}

export const DEMO_LEADS: LeadWithDraft[] = [
  // ────────────────────────────────────────────────────────────────
  // NEW — urgent consultancy enquiry (high-signal, high-urgency)
  // ────────────────────────────────────────────────────────────────
  {
    id: 'lead-2',
    user_id: DEMO_USER_ID,
    email_thread_id: 'thread-2',
    sender_name: 'Marcus Wright',
    sender_email: 'marcus@westbayventures.com',
    company_name: 'West Bay Ventures',
    service_requested: 'Brand strategy + full rebrand',
    summary:
      'Marcus is CEO of West Bay Ventures, a Series B fintech. They need a complete rebrand ahead of a product launch in 8 weeks and want to jump on a call this week to scope the engagement.',
    urgency: 'urgent',
    budget_hint: 'premium engagement, budget flexible',
    location: 'London',
    meeting_intent: true,
    confidence_score: 0.98,
    status: 'new',
    needs_review: false,
    original_email_subject: 'Rebrand engagement — need to move quickly',
    original_email_body: `Hi there,

We were introduced by Alex from Meridian — she spoke very highly of your work on the Finch rebrand.

I'm the CEO at West Bay Ventures (Series B fintech, 60 people). We've outgrown our current identity and are launching a new product in 8 weeks. We need a full rebrand — strategy, identity, website, the lot — and we need to move quickly.

Are you available for a call this week? Tuesday or Wednesday afternoon ideally. Happy to share more context on a call but wanted to reach out before you're fully booked.

Best,
Marcus Wright
CEO, West Bay Ventures`,
    received_at: hoursAgo(2),
    created_at: hoursAgo(2),
    updated_at: hoursAgo(2),
    drafted_replies: [
      {
        id: 'draft-2',
        lead_id: 'lead-2',
        user_id: DEMO_USER_ID,
        subject: 'Re: Rebrand engagement — need to move quickly',
        body: `Hi Marcus,

Thanks for reaching out — and please pass my thanks to Alex. An 8-week runway is tight but doable for a focused engagement, and the Series B context sounds like exactly the kind of work I enjoy.

I have Tuesday at 3pm or Wednesday at 11am open — either work? I'll send a short questionnaire ahead of the call so we can use the time well and I can come prepared with a realistic scope.

Looking forward to it,`,
        is_sent: false,
        sent_at: null,
        gmail_message_id: null,
        created_at: hoursAgo(2),
        updated_at: hoursAgo(2),
      },
    ],
    lead_events: [
      {
        id: 'event-2a',
        lead_id: 'lead-2',
        user_id: DEMO_USER_ID,
        event_type: 'created',
        description: 'Lead created from email',
        metadata: {},
        created_at: hoursAgo(2),
      },
      {
        id: 'event-2b',
        lead_id: 'lead-2',
        user_id: DEMO_USER_ID,
        event_type: 'reply_drafted',
        description: 'AI draft reply generated',
        metadata: {},
        created_at: hoursAgo(2),
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // NEW — photographer wedding enquiry (warm, clear)
  // ────────────────────────────────────────────────────────────────
  {
    id: 'lead-1',
    user_id: DEMO_USER_ID,
    email_thread_id: 'thread-1',
    sender_name: 'Sarah Chen',
    sender_email: 'sarah.chen@gmail.com',
    company_name: null,
    service_requested: 'Wedding photography — full day coverage',
    summary:
      'Sarah is getting married on 15 June 2026 at a coastal venue in Cornwall. She has a £3,500 budget for a full-day package and would love to see your availability and portfolio.',
    urgency: 'medium',
    budget_hint: '£3,500',
    location: 'Cornwall',
    meeting_intent: true,
    confidence_score: 0.95,
    status: 'new',
    needs_review: false,
    original_email_subject: 'Wedding photography enquiry — June 2026',
    original_email_body: `Hi,

I found your work through Rock My Wedding and I'm in love with your style — especially the Trevose wedding you shot last summer.

We're getting married on 15 June 2026 at Carnglaze Caverns in Cornwall. It's a small-ish wedding (around 70 guests) and we'd love full-day coverage from prep through to first dance.

Our budget is around £3,500. Are you free that date? Would love to hop on a quick call if you are.

Thanks!
Sarah & Tom`,
    received_at: hoursAgo(5),
    created_at: hoursAgo(5),
    updated_at: hoursAgo(5),
    drafted_replies: [
      {
        id: 'draft-1',
        lead_id: 'lead-1',
        user_id: DEMO_USER_ID,
        subject: 'Re: Wedding photography enquiry — June 2026',
        body: `Hi Sarah,

Congratulations! Carnglaze is a beautiful venue — you're going to have an incredible day. I've just checked my diary and 15 June 2026 is still open.

£3,500 fits a full-day package comfortably, so that works. I'd love to hop on a quick 20-minute call so I can hear more about what you're planning and you can get a sense of how I work. Would this Thursday afternoon or Friday morning suit?

Looking forward to chatting,`,
        is_sent: false,
        sent_at: null,
        gmail_message_id: null,
        created_at: hoursAgo(5),
        updated_at: hoursAgo(5),
      },
    ],
    lead_events: [
      {
        id: 'event-1a',
        lead_id: 'lead-1',
        user_id: DEMO_USER_ID,
        event_type: 'created',
        description: 'Lead created from email',
        metadata: {},
        created_at: hoursAgo(5),
      },
      {
        id: 'event-1b',
        lead_id: 'lead-1',
        user_id: DEMO_USER_ID,
        event_type: 'reply_drafted',
        description: 'AI draft reply generated',
        metadata: {},
        created_at: hoursAgo(5),
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // NEW — executive coaching (clear B2B lead)
  // ────────────────────────────────────────────────────────────────
  {
    id: 'lead-3',
    user_id: DEMO_USER_ID,
    email_thread_id: 'thread-3',
    sender_name: 'Omar Khalil',
    sender_email: 'omar@northstarandco.com',
    company_name: 'Northstar & Co',
    service_requested: 'Executive coaching — group programme',
    summary:
      'Omar is Head of People at Northstar & Co and is exploring coaching for 4 VPs over a 6-month programme. Open to a discovery call to discuss approach and pricing.',
    urgency: 'medium',
    budget_hint: 'budget flexible for the right fit',
    location: null,
    meeting_intent: true,
    confidence_score: 0.92,
    status: 'new',
    needs_review: false,
    original_email_subject: 'Executive coaching for our leadership team',
    original_email_body: `Hello,

Your name came up twice in the last month — once from Dina at Crestbrook, once on a Substack post about leadership transitions. That felt like a sign to reach out.

I lead People at Northstar & Co (B2B SaaS, 180 people) and we're scoping executive coaching for 4 of our VPs. Ideally a 6-month programme starting in the new quarter.

Would you be open to a 30-minute discovery call to talk through your approach and see if there's a fit? Happy to share more context beforehand if useful.

Best,
Omar Khalil
Head of People`,
    received_at: hoursAgo(18),
    created_at: hoursAgo(18),
    updated_at: hoursAgo(18),
    drafted_replies: [
      {
        id: 'draft-3',
        lead_id: 'lead-3',
        user_id: DEMO_USER_ID,
        subject: 'Re: Executive coaching for our leadership team',
        body: `Hi Omar,

Thanks for reaching out — and I'll take two independent referrals as a good omen too.

A 6-month group programme for four VPs is right in my wheelhouse. I'd welcome a 30-minute discovery call to understand where each VP is in their arc and what "good" looks like for Northstar over the next two quarters.

I have Tuesday at 2pm or Thursday at 10am next week. Would either work?

Best,`,
        is_sent: false,
        sent_at: null,
        gmail_message_id: null,
        created_at: hoursAgo(18),
        updated_at: hoursAgo(18),
      },
    ],
    lead_events: [
      {
        id: 'event-3a',
        lead_id: 'lead-3',
        user_id: DEMO_USER_ID,
        event_type: 'created',
        description: 'Lead created from email',
        metadata: {},
        created_at: hoursAgo(18),
      },
      {
        id: 'event-3b',
        lead_id: 'lead-3',
        user_id: DEMO_USER_ID,
        event_type: 'reply_drafted',
        description: 'AI draft reply generated',
        metadata: {},
        created_at: hoursAgo(18),
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // NEW — ambiguous "quick question" (Needs Review example)
  // ────────────────────────────────────────────────────────────────
  {
    id: 'lead-4',
    user_id: DEMO_USER_ID,
    email_thread_id: 'thread-4',
    sender_name: 'Jennifer Adebayo',
    sender_email: 'jen@studiofern.co',
    company_name: 'Studio Fern',
    service_requested: 'Possible collaboration — scope unclear',
    summary:
      'Jennifer references a previous chat and asks about a "collab" but gives little detail. Could be a new enquiry, a referral, or continuation of existing work. Worth a human eye before auto-drafting.',
    urgency: 'low',
    budget_hint: null,
    location: null,
    meeting_intent: false,
    confidence_score: 0.52,
    status: 'new',
    needs_review: true,
    original_email_subject: 'Quick question about that thing we chatted about',
    original_email_body: `Hey!

Long time — hope you're well. Thinking about what we talked about last time and wondering if you'd be up for something similar? Nothing urgent, just kicking around ideas.

Let me know x
Jen`,
    received_at: daysAgo(1),
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
    drafted_replies: [
      {
        id: 'draft-4',
        lead_id: 'lead-4',
        user_id: DEMO_USER_ID,
        subject: 'Re: Quick question about that thing we chatted about',
        body: `Hi Jen,

Great to hear from you! Just to make sure I'm on the same page — could you remind me which conversation you're referring to? I want to give you a proper answer rather than guess.

Happy to jump on a quick call too if that's easier.

Speak soon,`,
        is_sent: false,
        sent_at: null,
        gmail_message_id: null,
        created_at: daysAgo(1),
        updated_at: daysAgo(1),
      },
    ],
    lead_events: [
      {
        id: 'event-4a',
        lead_id: 'lead-4',
        user_id: DEMO_USER_ID,
        event_type: 'created',
        description: 'Lead created — flagged for review (low AI confidence)',
        metadata: {},
        created_at: daysAgo(1),
      },
      {
        id: 'event-4b',
        lead_id: 'lead-4',
        user_id: DEMO_USER_ID,
        event_type: 'reply_drafted',
        description: 'AI draft reply generated',
        metadata: {},
        created_at: daysAgo(1),
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // REPLIED — website redesign, already responded
  // ────────────────────────────────────────────────────────────────
  {
    id: 'lead-5',
    user_id: DEMO_USER_ID,
    email_thread_id: 'thread-5',
    sender_name: 'Priya Sharma',
    sender_email: 'priya@lumeco.io',
    company_name: 'Lumeco',
    service_requested: 'Website redesign',
    summary:
      'Priya is the founder of Lumeco (climate tech startup). They need their marketing site redesigned before a fundraising push. Reached out via LinkedIn after seeing your recent case study.',
    urgency: 'medium',
    budget_hint: '£8–12k range',
    location: 'Bristol / remote',
    meeting_intent: true,
    confidence_score: 0.94,
    status: 'replied',
    needs_review: false,
    original_email_subject: 'Website redesign for Lumeco',
    original_email_body: `Hi,

I'm Priya, founder of Lumeco — we're building carbon accounting software for mid-market manufacturers. We've got a fundraise coming up in early Q3 and our marketing site really isn't pulling its weight.

Your case study on Hedge.io was exactly the kind of clarity and positioning work we need. Budget is somewhere in the £8–12k range depending on scope.

Any chance of a call next week?

Cheers,
Priya`,
    received_at: daysAgo(2),
    created_at: daysAgo(2),
    updated_at: daysAgo(1),
    drafted_replies: [
      {
        id: 'draft-5',
        lead_id: 'lead-5',
        user_id: DEMO_USER_ID,
        subject: 'Re: Website redesign for Lumeco',
        body: `Hi Priya,

Great to hear from you — and thanks for mentioning the Hedge piece. The climate tech + fundraise-runway combination is a good fit for how I scope site work.

Let's get a call in. I have Wed 2pm and Thu 11am next week — either suit?

I'll send over a short context doc beforehand to keep the call efficient.

Best,`,
        is_sent: true,
        sent_at: daysAgo(1),
        gmail_message_id: 'gmail-msg-5',
        created_at: daysAgo(2),
        updated_at: daysAgo(1),
      },
    ],
    lead_events: [
      {
        id: 'event-5a',
        lead_id: 'lead-5',
        user_id: DEMO_USER_ID,
        event_type: 'created',
        description: 'Lead created from email',
        metadata: {},
        created_at: daysAgo(2),
      },
      {
        id: 'event-5b',
        lead_id: 'lead-5',
        user_id: DEMO_USER_ID,
        event_type: 'reply_drafted',
        description: 'AI draft reply generated',
        metadata: {},
        created_at: daysAgo(2),
      },
      {
        id: 'event-5c',
        lead_id: 'lead-5',
        user_id: DEMO_USER_ID,
        event_type: 'reply_sent',
        description: 'Reply sent via Gmail',
        metadata: {},
        created_at: daysAgo(1),
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // BOOKED — law firm branding, won deal
  // ────────────────────────────────────────────────────────────────
  {
    id: 'lead-6',
    user_id: DEMO_USER_ID,
    email_thread_id: 'thread-6',
    sender_name: 'David Okonkwo',
    sender_email: 'david@okonkwolaw.com',
    company_name: 'Okonkwo Law',
    service_requested: 'Logo + brand identity package',
    summary:
      'David is launching a boutique commercial law practice in Manchester and needs a logo, stationery system, and brand guidelines. Wants something that reads "modern but trustworthy".',
    urgency: 'high',
    budget_hint: '£4,500 confirmed',
    location: 'Manchester',
    meeting_intent: true,
    confidence_score: 0.96,
    status: 'booked',
    needs_review: false,
    original_email_subject: 'New firm — need a logo and identity',
    original_email_body: `Hi,

I'm opening my own commercial law practice in Manchester — Okonkwo Law — and I need a proper brand from day one, not something I'll regret in 18 months.

Scope: logo, stationery system, basic brand guidelines. I want something that feels modern but still reads "trustworthy" — I'm mostly pitching to growth-stage founders, so think serious but not stuffy.

Budget is £4,500 all in. Opening date is the first week of next month so I'm on a clock.

Can we chat this week?

David`,
    received_at: daysAgo(6),
    created_at: daysAgo(6),
    updated_at: daysAgo(3),
    drafted_replies: [
      {
        id: 'draft-6',
        lead_id: 'lead-6',
        user_id: DEMO_USER_ID,
        subject: 'Re: New firm — need a logo and identity',
        body: `Hi David,

Congratulations on the launch — "modern but trustworthy, serious but not stuffy" is a brief I genuinely enjoy. £4,500 works for that scope on your timeline.

I can get you something to react to within two weeks of kickoff. Do you have 20 minutes this Thursday or Friday to talk through it properly?

Best,`,
        is_sent: true,
        sent_at: daysAgo(5),
        gmail_message_id: 'gmail-msg-6',
        created_at: daysAgo(6),
        updated_at: daysAgo(5),
      },
    ],
    lead_events: [
      {
        id: 'event-6a',
        lead_id: 'lead-6',
        user_id: DEMO_USER_ID,
        event_type: 'created',
        description: 'Lead created from email',
        metadata: {},
        created_at: daysAgo(6),
      },
      {
        id: 'event-6b',
        lead_id: 'lead-6',
        user_id: DEMO_USER_ID,
        event_type: 'reply_drafted',
        description: 'AI draft reply generated',
        metadata: {},
        created_at: daysAgo(6),
      },
      {
        id: 'event-6c',
        lead_id: 'lead-6',
        user_id: DEMO_USER_ID,
        event_type: 'reply_sent',
        description: 'Reply sent via Gmail',
        metadata: {},
        created_at: daysAgo(5),
      },
      {
        id: 'event-6d',
        lead_id: 'lead-6',
        user_id: DEMO_USER_ID,
        event_type: 'status_changed',
        description: 'Status changed to booked',
        metadata: { new_status: 'booked' },
        created_at: daysAgo(3),
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // LOST — out of scope partnership pitch
  // ────────────────────────────────────────────────────────────────
  {
    id: 'lead-7',
    user_id: DEMO_USER_ID,
    email_thread_id: 'thread-7',
    sender_name: 'Emma Laurent',
    sender_email: 'emma@laurentpr.com',
    company_name: 'Laurent PR',
    service_requested: 'Revenue-share partnership',
    summary:
      'Emma pitches a revenue-share partnership where she provides PR services in exchange for a cut of your client revenue. Not a client engagement — closed as out of scope.',
    urgency: 'low',
    budget_hint: 'rev share, not a paying engagement',
    location: null,
    meeting_intent: true,
    confidence_score: 0.88,
    status: 'lost',
    needs_review: false,
    original_email_subject: 'Partnership opportunity — PR for your clients',
    original_email_body: `Hi there,

I run Laurent PR, a boutique comms agency for creative studios. I've been following your work and noticed your clients could really benefit from press coverage.

I'd love to explore a partnership where Laurent handles PR for your clients and we split revenue 70/30 in your favour. No cost to you — pure upside.

Grab a call this week?

Emma Laurent
Laurent PR`,
    received_at: daysAgo(4),
    created_at: daysAgo(4),
    updated_at: daysAgo(4),
    drafted_replies: [],
    lead_events: [
      {
        id: 'event-7a',
        lead_id: 'lead-7',
        user_id: DEMO_USER_ID,
        event_type: 'created',
        description: 'Lead created from email',
        metadata: {},
        created_at: daysAgo(4),
      },
      {
        id: 'event-7b',
        lead_id: 'lead-7',
        user_id: DEMO_USER_ID,
        event_type: 'status_changed',
        description: 'Status changed to lost',
        metadata: { new_status: 'lost' },
        created_at: daysAgo(4),
      },
    ],
  },
];

// Alternate drafts used by the demo "Regenerate" button to cycle through.
export const DEMO_ALTERNATE_DRAFTS: Record<string, string[]> = {
  'lead-1': [
    `Hi Sarah,

Congratulations to you and Tom! Carnglaze is a really special venue, and I'm happy to confirm 15 June 2026 is still free in my diary.

£3,500 covers a full-day package comfortably, so I'd love to set up a short call to hear what you're both picturing and walk you through how I tend to work. Thursday afternoon or Friday morning — either good?

Can't wait to hear more,`,
    `Hi Sarah and Tom,

Thank you for reaching out — and the Trevose mention made my morning. Good news: 15 June 2026 is open and £3,500 is right in the full-day range.

A 20-minute call is usually the fastest way to tell whether we're a fit. I have a few slots open this Thursday and Friday — send over a couple that suit you and I'll lock one in.

Looking forward to it,`,
  ],
  'lead-2': [
    `Hi Marcus,

Thanks for the note — and for Alex's kind words. An 8-week window for a full rebrand is aggressive but very doable if we're ruthless about scope, which sounds like your style anyway.

I've got Tuesday 3pm and Wednesday 11am open. Send whichever suits and I'll share a short pre-call doc so we don't waste the time.

Looking forward to meeting,`,
    `Hi Marcus,

Appreciate the intro from Alex — and I like the clarity of your timeline. A rebrand in 8 weeks ahead of a launch is exactly the kind of pressure that produces good work (if we scope it properly).

Let's get a call in. Tuesday after 2pm or Wednesday morning both work for me. I'll send over a short brief template ahead of it.

Speak soon,`,
  ],
  'lead-3': [
    `Hi Omar,

Two independent referrals in a month — I'll take that as a very good sign. A 6-month programme for four VPs is a sweet spot for the work I do best.

Happy to take a 30-minute discovery call. Tuesday 2pm or Thursday 10am next week both open — either work for you?

Best,`,
    `Hi Omar,

Thanks for reaching out — Dina's work at Crestbrook came up in a conversation just last week, so this is well timed.

I'd love a 30-minute intro call to understand what each of your VPs is navigating and where "good" lands for Northstar over the next two quarters. Does Tuesday 2pm or Thursday 10am work?

Looking forward,`,
  ],
  'lead-4': [
    `Hi Jen,

Lovely to see your name in the inbox. Quick one though — I want to give you a proper answer, so could you jog my memory on which conversation this is about? I'd rather be specific than guess.

Happy to jump on a call too if that's quicker.

Speak soon,`,
    `Hey Jen,

Always good to hear from you! I want to make sure I'm answering the right question — could you drop a line about what we chatted about before? Memory's fuzzy on the specifics.

Once I've got that, happy to give you a proper answer or set up a quick call.

Talk soon,`,
  ],
};
