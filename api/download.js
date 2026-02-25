// Download endpoint - serves ZIP files for purchased products
const fs = require('fs');
const path = require('path');

const PRODUCTS = {
  'playbook': {
    filename: 'openclaw-mastery.zip',
    name: 'OpenClaw Mastery Playbook',
    path: './openclaw-mastery.zip'
  },
  'x-automation': {
    filename: 'x-automation.zip',
    name: 'X Automation Skill',
    path: './x-automation.zip'
  },
  'video-transcription': {
    filename: 'video-transcription.zip',
    name: 'Video Transcription Skill',
    path: './video-transcription.zip'
  }
};

module.exports = async (req, res) => {
  const { product, token } = req.query;
  
  if (!product || !PRODUCTS[product]) {
    return res.status(400).json({ error: 'Invalid product' });
  }
  
  const productInfo = PRODUCTS[product];
  const downloadPath = path.join(__dirname, '..', 'downloads', productInfo.path);
  
  // Check if file exists
  if (!fs.existsSync(downloadPath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  // Set headers for download
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${productInfo.filename}"`);
  res.setHeader('Content-Length', fs.statSync(downloadPath).size);
  
  // Stream file
  const fileStream = fs.createReadStream(downloadPath);
  fileStream.pipe(res);
};