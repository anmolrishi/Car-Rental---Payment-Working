import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export const handler: Handler = async (event) => {
  const sig = event.headers['stripe-signature'];

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  // Handle charge.updated event
  if (stripeEvent.type === 'charge.updated') {
    const charge = stripeEvent.data.object;
    
    // Check if the charge was successful
    if (charge.status === 'succeeded' && charge.paid === true) {
      const bookingId = charge.metadata.booking_id;

      if (bookingId) {
        try {
          // Update booking status to confirmed
          const { error } = await supabase
            .from('bookings')
            .update({ status: 'confirmed' })
            .eq('id', bookingId);

          if (error) {
            console.error('Error updating booking:', error);
            return {
              statusCode: 500,
              body: JSON.stringify({ error: 'Failed to update booking status' }),
            };
          }

          return {
            statusCode: 200,
            body: JSON.stringify({ 
              received: true,
              message: 'Booking confirmed successfully'
            }),
          };
        } catch (error) {
          console.error('Error updating booking:', error);
          return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to update booking status' }),
          };
        }
      } else {
        console.warn('No booking_id found in charge metadata');
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'No booking_id in metadata' }),
        };
      }
    }
  }

  // Return 200 for other events
  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};