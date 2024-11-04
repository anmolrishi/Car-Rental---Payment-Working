import { STRIPE_SECRET_KEY } from '../config';

export const createPaymentLink = async (bookingDetails: {
  bookingId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  rentType: 'hourly' | 'daily';
  hours?: number;
  days?: number;
}) => {
  try {
    // First, create a product
    const productResponse = await fetch('https://api.stripe.com/v1/products', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        name: `Car Rental - ${
          bookingDetails.rentType === 'hourly'
            ? `${bookingDetails.hours} hours`
            : `${bookingDetails.days} days`
        }`,
        description: `Rental period: ${new Date(
          bookingDetails.startDate
        ).toLocaleDateString()} to ${new Date(
          bookingDetails.endDate
        ).toLocaleDateString()}`,
        'metadata[booking_id]': bookingDetails.bookingId,
      }),
    });

    if (!productResponse.ok) {
      const error = await productResponse.json();
      throw new Error(error.message || 'Failed to create product');
    }

    const product = await productResponse.json();

    // Then, create a price for the product
    const priceResponse = await fetch('https://api.stripe.com/v1/prices', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        currency: 'usd',
        unit_amount: Math.round(bookingDetails.totalPrice * 100).toString(),
        product: product.id,
      }),
    });

    if (!priceResponse.ok) {
      const error = await priceResponse.json();
      throw new Error(error.message || 'Failed to create price');
    }

    const price = await priceResponse.json();

    // Finally, create payment link
    const linkResponse = await fetch(
      'https://api.stripe.com/v1/payment_links',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'line_items[0][price]': price.id,
          'line_items[0][quantity]': '1',
          'after_completion[type]': 'redirect',
          'after_completion[redirect][url]': `${window.location.origin}/booking/success`,
          'metadata[booking_id]': bookingDetails.bookingId,
        }),
      }
    );

    if (!linkResponse.ok) {
      const error = await linkResponse.json();
      throw new Error(error.message || 'Failed to create payment link');
    }

    const paymentLink = await linkResponse.json();
    return paymentLink.url;
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw error;
  }
};
