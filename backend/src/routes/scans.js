const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validate, validateParams } = require('../middleware/validate');
const { getMyScans, deleteScan, checkPhish, checkPhishStatus, scanEmailContent, scanEmailFile } = require('../controllers/scanController');
const { checkPhishSchema, checkPhishStatusSchema, scanIdSchema, emailContentSchema } = require('../validations/scans');
const { scanLimiter } = require('../middleware/rateLimit');
const multer = require('multer');

// Configuration multer pour l'upload de fichiers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/plain', 'message/rfc822', 'application/vnd.ms-outlook'];
    if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.eml') || file.originalname.endsWith('.msg')) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté. Utilisez .eml, .msg ou .txt'), false);
    }
  }
});

// Routes protégées
router.get('/my-scans', protect, getMyScans);
router.delete('/:id', protect, validateParams(scanIdSchema), deleteScan);
router.post('/check', protect, scanLimiter, validate(checkPhishSchema), checkPhish);
router.post('/status', protect, scanLimiter, validate(checkPhishStatusSchema), checkPhishStatus);

// Routes pour le scan d'email
router.post('/email/content', protect, scanLimiter, validate(emailContentSchema), scanEmailContent);
router.post('/email/file', protect, scanLimiter, upload.single('emailFile'), scanEmailFile);

module.exports = router; 