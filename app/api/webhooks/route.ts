import { stripe } from '@/libs/stripe'
import {
    manageSubscriptionStatusChange,
    upsertPriceRecord,
    upsertProductRecord,
} from '@/libs/supabaseAdmin'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const relevantEvents = new Set([
    'product.created',
    'product.updated',
    'price.created',
    'price.updated',
    'checkout.session.completed',
    'customer.subscription.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted',
])

export async function POST(request: Request) {
    const body = await request.text()
    const sig = (await headers()).get('Stripe-Signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    let event: Stripe.Event

    try {
        if (!sig || !webhookSecret) return
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (error) {
        if (error instanceof Error) {
            console.log('Error message: ' + error.message)
        } else {
            console.log('Unexpected error', error)
        }
        return new NextResponse(
            `Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            {
                status: 400,
            },
        )
    }

    if (relevantEvents.has(event.type)) {
        try {
            switch (event.type) {
                case 'product.created':
                case 'product.updated':
                    await upsertProductRecord(
                        event.data.object as Stripe.Product,
                    )
                    break

                case 'price.created':
                case 'price.updated':
                    await upsertPriceRecord(event.data.object as Stripe.Price)
                    break

                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    const subscription = event.data
                        .object as Stripe.Subscription
                    await manageSubscriptionStatusChange(
                        subscription.id,
                        subscription.customer as string,
                        event.type === 'customer.subscription.created',
                    )
                    break

                case 'checkout.session.completed':
                    const checkoutSession = event.data
                        .object as Stripe.Checkout.Session
                    if (checkoutSession.mode === 'subscription') {
                        const subscriptionId = checkoutSession.subscription
                        await manageSubscriptionStatusChange(
                            subscriptionId as string,
                            checkoutSession.customer as string,
                            true,
                        )
                    }
                    break

                default:
                    throw new Error('Unhandled relevant event!')
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log('Error in event handling:', error.message)
            } else {
                console.log('Unexpected error in event handling:', error)
            }
            return new NextResponse('Webhook error', { status: 400 })
        }
    }

    return NextResponse.json({ received: true }, { status: 200 })
}
