// Stripe success page handler - verifies payment and shows download
const crypto = require('crypto');

module.exports = async (req, res) => {
  const { session_id } = req.query;
  
  if (!session_id) {
    return res.status(400).json({ error: 'Missing session' });
  }

  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Get product from session
    const lineItem = session.line_items?.data?.[0];
    const productName = lineItem?.description || 'Product';
    const priceId = lineItem?.price?.id;
    
    // Map to our products
    const productMap = {
      'price_1T4aYxCyvj2kuPveMEGsOEbI': { id: 'playbook', name: 'OpenClaw Mastery Playbook', size: '2.1 MB' },
      'price_1T4aYxCyvj2kuPve3xYNhRx4': { id: 'x-automation', name: 'X Automation Skill', size: '1.8 MB' },
      'price_1T4aYwCyvj2kuPveunx56EgG': { id: 'video-transcription', name: 'Video Transcription Skill', size: '1.2 MB' }
    };
    
    const product = productMap[priceId] || { id: 'unknown', name: productName, size: 'Unknown' };
    
    res.status(200).json(product);
    
  } catch (err) {
    console.error('Session verification failed:', err);
    res.status(500).json({ error: 'Error verifying purchase' });
  }
};