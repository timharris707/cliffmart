// Verify download token and serve file
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const { token, product } = req.query;
  
  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
    // Decode token
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [productId, expires, hash] = decoded.split(':');
    
    // Verify expiry
    if (Date.now() > parseInt(expires)) {
      return res.status(410).json({ error: 'Download link expired' });
    }
    
    // Verify hash
    const secret = process.env.DOWNLOAD_SECRET || 'fallback-secret';
    const expectedHash = crypto.createHmac('sha256', secret).update(`${productId}:${expires}`).digest('hex');
    
    if (hash !== expectedHash) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    // Return product info
    const products = {
      'playbook': {
        name: 'OpenClaw Mastery Playbook',
        filename: 'openclaw-mastery.zip',
        size: '2.4 MB'
      },
      'x-automation': {
        name: 'X Automation Skill',
        filename: 'x-automation.zip',
        size: '1.8 MB'
      },
      'video-transcription': {
        name: 'Video Transcription Skill',
        filename: 'video-transcription.zip',
        size: '1.2 MB'
      }
    };
    
    const productInfo = products[productId] || products[product];
    
    if (!productInfo) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json(productInfo);
    
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(400).json({ error: 'Invalid token format' });
  }
};