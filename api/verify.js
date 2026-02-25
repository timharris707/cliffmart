// Stripe success page handler - verifies payment and shows download
const crypto = require('crypto');

function verifySession(sessionId) {
  // In production, verify with Stripe API
  // For now, return mock verification
  return {
    valid: true,
    product: 'playbook', // Would come from Stripe session
    email: 'customer@example.com'
  };
}

module.exports = async (req, res) => {
  const { session_id } = req.query;
  
  if (!session_id) {
    return res.status(400).send('Invalid session');
  }

  // Verify session with Stripe
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status !== 'paid') {
      return res.status(400).send('Payment not completed');
    }

    // Get product from session
    const productName = session.line_items?.data[0]?.description || 'Product';
    const productMap = {
      'OpenClaw Mastery Playbook': 'playbook',
      'X Automation Skill': 'x-automation', 
      'Video Transcription Skill': 'video-transcription'
    };
    const productId = productMap[productName] || 'unknown';
    
    // Generate download token (7 days expiry)
    const secret = process.env.DOWNLOAD_SECRET || 'fallback-secret';
    const expires = Date.now() + (7 * 24 * 60 * 60 * 1000);
    const data = `${productId}:${expires}`;
    const hash = crypto.createHmac('sha256', secret).update(data).digest('hex');
    const token = Buffer.from(`${productId}:${expires}:${hash}`).toString('base64');
    
    // Redirect to download page with token
    res.status(302).setHeader('Location', `/download.html?token=${token}`).end();
    
  } catch (err) {
    console.error('Session verification failed:', err);
    res.status(500).send('Error verifying purchase');
  }
};