const Product = require('../models/Product');
const Category = require('../models/Category');
const { getCategorySvg } = require('./grocerySvgLibrary');

// Reliable Unsplash fallback images per category name keyword
const CATEGORY_FALLBACK_IMAGES = {
  'fruits': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&auto=format&fit=crop',
  'vegetables': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&auto=format&fit=crop',
  'dairy': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop',
  'eggs': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop',
  'bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop',
  'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop',
  'beverages': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop',
  'oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop',
  'ghee': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop',
  'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop',
  'staples': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop',
  'baby': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&auto=format&fit=crop',
  'frozen': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&auto=format&fit=crop',
  'household': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&auto=format&fit=crop',
  'cleaning': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&auto=format&fit=crop',
  'instant': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&auto=format&fit=crop',
  'personal': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&auto=format&fit=crop',
};

const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop';
const DEFAULT_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop';

const getCategoryFallbackImage = (catName = '') => {
  const lower = catName.toLowerCase();
  for (const [keyword, url] of Object.entries(CATEGORY_FALLBACK_IMAGES)) {
    if (lower.includes(keyword)) return url;
  }
  return DEFAULT_CATEGORY_IMAGE;
};

const getRelevantImage = (productName, categoryName = '') => {
  return getCategoryFallbackImage(categoryName || productName);
};

const repairProductImages = async () => {
  try {
    const products = await Product.find({}).populate('category', 'name');
    const categories = await Category.find({});
    let updatedCount = 0;

    // Repair Categories â€” only fix truly empty/missing image URLs
    for (const cat of categories) {
      const currentUrl = typeof cat.image === 'string' ? cat.image : cat.image?.url;
      // Only repair if the URL is missing or is a broken SVG data URI
      if (!currentUrl || currentUrl.startsWith('data:image/svg+xml')) {
        const fallbackUrl = getCategoryFallbackImage(cat.name);
        cat.image = { url: fallbackUrl, publicId: `fallback_cat_${cat._id}` };
        await cat.save();
      }
    }

    // Repair Products â€” only fix truly empty/missing/SVG data URI images
    for (const product of products) {
      const categoryName = product.category?.name || '';
      let needsUpdate = false;

      if (!product.images || product.images.length === 0) {
        product.images = [{
          url: getRelevantImage(product.name, categoryName),
          publicId: `fallback_prod_${product._id}`,
          isPrimary: true
        }];
        needsUpdate = true;
      } else {
        for (let i = 0; i < product.images.length; i++) {
          const imgUrl = product.images[i].url || '';
          // Only replace if empty or is an SVG data URI (too long for <img src>)
          if (!imgUrl || imgUrl.startsWith('data:image/svg+xml')) {
            product.images[i].url = getRelevantImage(product.name, categoryName);
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        await product.save();
        updatedCount++;
      }
    }

    console.log(`âœ“ Repaired ${updatedCount} products/categories with broken/missing images`);
    return { success: true, count: updatedCount };
  } catch (error) {
    console.error('Error repairing product images:', error.message);
    return { success: false, error: error.message };
  }
};

const DEFAULT_IMAGE = DEFAULT_CATEGORY_IMAGE;

module.exports = {
  DEFAULT_IMAGE,
  getRelevantImage,
  repairProductImages
};

