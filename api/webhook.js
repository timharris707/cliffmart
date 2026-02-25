// Stripe Webhook Handler - Post-purchase delivery
const crypto = require('crypto');

// Generate secure download token
function generateToken(product, email) {
  const secret = process.env.DOWNLOAD_SECRET || 'default-secret-change-me';
  const expires = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
  const data = `${product}:${email}:${expires}`;
  const hash = crypto.createHmac('sha256', secret).update(data).digest('hex');
  return `${Buffer.from(data).toString('base64')}.${hash}`;
}

module.exports = async (req, res) => {
  // Verify Stripe webhook signature
  const sig = req.headers['stripe-signature'];
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_details?.email;
    const productName = session.line_items?.data[0]?.description || 'Product';
    
    // Map product names to download IDs
    const productMap = {
      'OpenClaw Mastery Playbook': 'playbook',
      'X Automation Skill': 'x-automation',
      'Video Transcription Skill': 'video-transcription'
    };
    
    const productId = productMap[productName] || 'unknown';
    const token = generateToken(productId, email);
    const downloadUrl = `https://shopcliffmart.com/download.html?token=${token}`;
    
    // Send email via Resend
    try {
      const Resend = require('resend').Resend;
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      await resend.emails.send({
        from: 'CliffMart <orders@shopcliffmart.com>',
        to: email,
        subject: `Your ${productName} Download`,
        html: `
          <h1>Thanks for your purchase!</h1>
          <p>You bought: <strong>${productName}</strong></p>
          <p>Click below to download your files:</p>
          <a href="${downloadUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">Download Now</a>
          <p style="color:#666;font-size:14px;">This link expires in 7 days and can be used up to 5 times.</p>
          <hr>
          <p style="font-size:12px;color:#999;">Questions? Reply to this email or contact support.</p>
        `
      });
      
      console.log('Email sent to:', email);
    } catch (err) {
      console.error('Email send failed:', err);
    }
  }

  res.status(200).json({ received: true });
};