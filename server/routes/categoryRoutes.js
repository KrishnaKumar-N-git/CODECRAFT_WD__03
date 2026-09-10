const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  uploadCategoryImage,
  deleteCategory
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getCategories);
router.post('/', protect, requireRole('STORE_OWNER', 'ADMIN'), createCategory);
router.put('/:id', protect, requireRole('STORE_OWNER', 'ADMIN'), updateCategory);
router.post('/:id/image', protect, requireRole('STORE_OWNER', 'ADMIN'), upload.single('image'), uploadCategoryImage);
router.delete('/:id', protect, requireRole('ADMIN'), deleteCategory);

module.exports = router;
