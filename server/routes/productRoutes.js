const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
  fixProductImages
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getProducts);
router.post('/fix-images', fixProductImages);
router.get('/:id', getProductById);

router.post('/', protect, requireRole('STORE_OWNER', 'ADMIN'), createProduct);
router.put('/:id', protect, requireRole('STORE_OWNER', 'ADMIN'), updateProduct);
router.delete('/:id', protect, requireRole('STORE_OWNER', 'ADMIN'), deleteProduct);

router.post('/:id/images', protect, requireRole('STORE_OWNER', 'ADMIN'), upload.array('images', 5), uploadProductImages);
router.delete('/:id/images/:imageId', protect, requireRole('STORE_OWNER', 'ADMIN'), deleteProductImage);

module.exports = router;
