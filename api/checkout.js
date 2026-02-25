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
    console.log('Starting checkout...');
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
    console.log('STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 0);
    
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const { product } = req.body;
    console.log('Product:', product);
    
    const PRODUCTS = {
      'video-transcription': { name: 'Video Transcription Skill', price: 900 },
      'x-automation': { name: 'X Automation Skill', price: 1900 },
      'playbook': { name: 'OpenClaw Mastery Playbook', price: 2900 }
    };
    
    const productData = PRODUCTS[product];
    if (!productData) {
      return res.status(400).json({ error: 'Invalid product' });
    }

    console.log('Creating Stripe session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: productData.name },
          unit_amount: productData.price,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://shopcliffmart.com/checkout/success.html',
      cancel_url: 'https://shopcliffmart.com/checkout/cancel.html',
    });

    console.log('Session created:', session.id);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message, type: err.type, code: err.code });
  }
};