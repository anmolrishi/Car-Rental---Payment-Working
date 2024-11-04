import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const { vehicleId, startDate, endDate, totalPrice, rentType, hours, days } = JSON.parse(event.body || '');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Car Rental - ${rentType === 'hourly' ? `${hours} hours` : `${days} days`}`,
              description: `Rental period: ${startDate} to ${endDate}`,
            },
            unit_amount: Math.round(totalPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/booking/cancel`,
      metadata: {
        vehicleId,
        startDate,
        endDate,
        rentType,
        hours: hours || 0,
        days: days || 0,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create checkout session' }),
    };
  }
};