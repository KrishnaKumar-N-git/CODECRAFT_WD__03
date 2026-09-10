const express = require('express');
const router = express.Router();
const {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  uploadStoreLogo,
  uploadStoreBanner
} = require('../controllers/storeController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getStores);
router.get('/:id', getStoreById);

router.post('/', protect, requireRole('STORE_OWNER', 'ADMIN'), createStore);
router.put('/:id', protect, requireRole('STORE_OWNER', 'ADMIN'), updateStore);
router.post('/:id/logo', protect, requireRole('STORE_OWNER', 'ADMIN'), upload.single('logo'), uploadStoreLogo);
router.post('/:id/banner', protect, requireRole('STORE_OWNER', 'ADMIN'), upload.single('banner'), uploadStoreBanner);

module.exports = router;
