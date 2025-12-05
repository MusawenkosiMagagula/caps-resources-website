const express = require('express');
const router = express.Router();
const pdfService = require('../services/pdfService');

// Download PDF with token
router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const result = await pdfService.servePDF(token);
    
    res.download(result.filePath, result.fileName, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
    });
  } catch (error) {
    console.error('PDF download error:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
