import { NextRequest, NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/schemas';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid email address', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // TODO: Integrate with Mailchimp / Klaviyo / Brevo when ready
    // For now, log and return success
    console.log(`[Newsletter] New subscriber: ${email}`);

    return NextResponse.json(
      { success: true, message: `${email} subscribed successfully.` },
      { status: 200 }
    );
  } catch (err) {
    console.error('[Newsletter API Error]', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
