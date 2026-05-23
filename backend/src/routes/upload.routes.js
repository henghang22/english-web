const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { protect } = require('../middlewares/auth.middleware');

router.post('/image', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'Vui lòng chọn ảnh' });
    }

    // Trả về URL của ảnh
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.json({
      status: 'success',
      data: {
        url: imageUrl,
        filename: req.file.filename
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
