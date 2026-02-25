const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PRODUCTS = {
  'video-transcription': {
    name: 'Video Transcription Skill',
    description: 'Extract transcripts from YouTube, TikTok, Instagram, Facebook, and X',
    price: 900, // $9.00 in cents
  },
  'x-automation': {
    name: 'X Automation Skill',
    description: 'Complete X/Twitter automation setup with scheduled posting and analytics',
    price: 1900, // $19.00 in cents
  },
  'playbook': {
    name: 'OpenClaw Mastery Playbook',
    description: 'The complete guide to running OpenClaw in production',
    price: 2900, // $29.00 in cents
  }
};

async function createCheckoutSession(productKey) {
  const product = PRODUCTS[productKey];
  if (!product) throw new Error('Invalid product');

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          description: product.description,
        },
        unit_amount: product.price,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.DOMAIN}/checkout/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.DOMAIN}/checkout/cancel.html`,
  });

  return session;
}

module.exports = { createCheckoutSession, PRODUCTS };