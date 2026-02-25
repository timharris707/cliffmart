module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { product } = req.body;
    
    const PRICES = {
      'video-transcription': 'price_1T4aYwCyvj2kuPveunx56EgG',
      'x-automation': 'price_1T4aYxCyvj2kuPve3xYNhRx4',
      'playbook': 'price_1T4aYxCyvj2kuPveMEGsOEbI'
    };
    
    const priceId = PRICES[product];
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid product' });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://shopcliffmart.com/checkout/success.html',
      cancel_url: 'https://shopcliffmart.com/checkout/cancel.html',
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message });
  }
};