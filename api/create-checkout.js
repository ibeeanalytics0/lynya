// api/create-checkout.js
// Vercel Serverless Function — runs server-side, keeps secret key safe
//
// SETUP STEPS (your leader does this in Vercel dashboard):
// 1. Go to Vercel project → Settings → Environment Variables
// 2. Add:  STRIPE_SECRET_KEY = sk_live_xxxx   (from Stripe dashboard)
// 3. Add:  YOUR_DOMAIN       = https://lynya02.vercel.app
// 4. Redeploy
//
// For local testing: create .env.local with those two variables
// then run: npx vercel dev

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, customerEmail, paymentMethod, shipping } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }

    const domain = process.env.YOUR_DOMAIN || 'http://localhost:3000';

    // Build Stripe line items from cart
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: `${item.emoji} Lynya Organic Cosmetics`,
          images: [],  // Add real image URLs here when available
        },
        unit_amount: Math.round(item.price * 100), // Stripe needs cents
      },
      quantity: item.qty,
    }));

    // Determine payment method types
    // 'card'  = debit + credit cards
    // 'affirm' = pay-as-you-go / buy now pay later (min $50 order)
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const paymentMethodTypes = ['card'];
    if (paymentMethod === 'payg' && subtotal >= 50) {
      paymentMethodTypes.push('affirm'); // Pay As You Go
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,

      // Shipping options
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB'] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: subtotal >= 50 ? 0 : 599, currency: 'usd' },
            display_name: subtotal >= 50 ? 'Free Shipping' : 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 1499, currency: 'usd' },
            display_name: 'Express Shipping (2 days)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 2 },
            },
          },
        },
      ],

      // Where to redirect after payment
      success_url: `${domain}/pages/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${domain}/pages/cancel.html`,

      // Metadata for your records
      metadata: {
        source:    'lynya-website',
        itemCount: items.length.toString(),
      },
    });

    // Send back the Stripe Checkout URL
    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
