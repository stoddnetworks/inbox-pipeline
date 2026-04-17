import { NextRequest, NextResponse } from 'next/server';
import { getOAuth2Client } from '@/lib/gmail';
import { createServiceClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const userId = request.nextUrl.searchParams.get('state');

  if (!code || !userId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/connect?error=missing_params`
    );
  }

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Missing tokens');
    }

    // Get the user's Gmail address
    oauth2Client.setCredentials(tokens);
    const { google } = await import('googleapis');
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });
    const gmailAddress = profile.data.emailAddress || '';

    const supabase = createServiceClient();

    // Upsert connected account
    const { error } = await supabase
      .from('connected_accounts')
      .upsert(
        {
          user_id: userId,
          provider: 'gmail',
          email: gmailAddress,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expiry: new Date(tokens.expiry_date || Date.now() + 3600000).toISOString(),
        },
        { onConflict: 'user_id,provider' }
      );

    if (error) {
      // If upsert fails due to no unique constraint on user_id,provider, try delete+insert
      await supabase.from('connected_accounts').delete().match({ user_id: userId, provider: 'gmail' });
      await supabase.from('connected_accounts').insert({
        user_id: userId,
        provider: 'gmail',
        email: gmailAddress,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: new Date(tokens.expiry_date || Date.now() + 3600000).toISOString(),
      });
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?connected=true`);
  } catch (err) {
    console.error('Gmail OAuth callback error:', err);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/connect?error=oauth_failed`
    );
  }
}
