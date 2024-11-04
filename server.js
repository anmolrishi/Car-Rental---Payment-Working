const express = require('express');
import cors from 'cors';
import path from 'path';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Stripe
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'sk_test_tR3PYbcVNZZ796tH88S4VQ2u',
  {
    apiVersion: '2023-10-16',
  }
);

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://wdzcrmjkardnxllwinml.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist')); // Serve the built frontend

// Stripe webhook endpoint
app.post('/api/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'charge.updated') {
      const charge = event.data.object;

      if (charge.status === 'succeeded' && charge.paid === true) {
        const bookingId = charge.metadata.booking_id;

        if (bookingId) {
          const { error } = await supabase
            .from('bookings')
            .update({ status: 'confirmed' })
            .eq('id', bookingId);

          if (error) {
            console.error('Error updating booking:', error);
            return res
              .status(500)
              .json({ error: 'Failed to update booking status' });
          }

          return res.json({
            received: true,
            message: 'Booking confirmed successfully',
          });
        }
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
