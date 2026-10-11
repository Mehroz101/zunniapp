import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const subscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = subscribeSchema.safeParse(body);

    if (!result.success) {
      const errorMessage =
        result.error.errors[0]?.message || 'Please provide a valid email address.';
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const normalizedEmail = email.toLowerCase();

    // 1. Check if email already exists in MongoDB newsletter_subscribers
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing?.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: 'You are already subscribed to our newsletter!',
        },
        { status: 409 }
      );
    }

    if (existing && !existing.isActive) {
      // 2. Reactivate subscription
      await prisma.newsletterSubscriber.update({
        where: { email: normalizedEmail },
        data: { isActive: true, unsubscribedAt: null },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
        },
        { status: 200 }
      );
    }

    // 3. Create new subscriber
    await prisma.newsletterSubscriber.create({
      data: {
        email: normalizedEmail,
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for subscribing! Check your inbox soon.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Newsletter Subscription API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to process subscription right now. Please try again later.',
      },
      { status: 500 }
    );
  }
}
