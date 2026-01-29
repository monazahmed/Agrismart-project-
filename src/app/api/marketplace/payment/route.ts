import { NextRequest, NextResponse } from 'next/server';

const PAYMENT_METHODS = ['credit-card', 'debit-card', 'mobile-wallet', 'bank-transfer'];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, amount, paymentMethod, cardDetails } = body;

        if (!orderId || !amount || !paymentMethod) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!PAYMENT_METHODS.includes(paymentMethod)) {
            return NextResponse.json(
                { error: 'Invalid payment method' },
                { status: 400 }
            );
        }

        // Simulate payment processing
        // In production, integrate with payment gateway (Stripe, Razorpay, etc.)
        const isSuccessful = Math.random() > 0.1; // 90% success rate for demo

        if (!isSuccessful) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Payment failed. Please try again.'
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            transactionId: `TXN-${Date.now()}`,
            orderId,
            amount,
            paymentMethod,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error('Payment processing error:', error);
        return NextResponse.json(
            { error: 'Payment processing failed' },
            { status: 500 }
        );
    }
}
