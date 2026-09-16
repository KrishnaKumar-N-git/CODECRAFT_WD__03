const Product = require('../models/Product');
const Category = require('../models/Category');
const { getCategorySvg } = require('./grocerySvgLibrary');

// Reliable public Wikimedia Commons fallback images per category keyword (100% CORS & adblocker friendly)
const CATEGORY_FALLBACK_IMAGES = {
  'fruits': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/600px-Red_Apple.jpg',
  'vegetables': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/600px-Tomato_je.jpg',
  'dairy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Milk_glass.jpg/600px-Milk_glass.jpg',
  'eggs': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Egg_white.jpg/600px-Egg_white.jpg',
  'bakery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Kaisersemmel-.jpg/600px-Kaisersemmel-.jpg',
  'bread': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Kaisersemmel-.jpg/600px-Kaisersemmel-.jpg',
  'beverages': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/600px-A_small_cup_of_coffee.JPG',
  'oil': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Olive_oil_from_One_Two_Free.jpg/600px-Olive_oil_from_One_Two_Free.jpg',
  'ghee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Supreme_cut_butter.jpg/600px-Supreme_cut_butter.jpg',
  'rice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Uncooked_rice.jpg/600px-Uncooked_rice.jpg',
  'staples': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Uncooked_rice.jpg/600px-Uncooked_rice.jpg',
  'baby': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Milk_glass.jpg/600px-Milk_glass.jpg',
  'frozen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Milk_glass.jpg/600px-Milk_glass.jpg',
  'household': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Paneer_cubes.jpg/600px-Paneer_cubes.jpg',
  'cleaning': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Paneer_cubes.jpg/600px-Paneer_cubes.jpg',
  'instant': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Kaisersemmel-.jpg/600px-Kaisersemmel-.jpg',
  'personal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Milk_glass.jpg/600px-Milk_glass.jpg',
};

const DEFAULT_PRODUCT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/600px-Red_Apple.jpg';
const DEFAULT_CATEGORY_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/600px-Red_Apple.jpg';

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

    // Repair Categories
    for (const cat of categories) {
      const currentUrl = typeof cat.image === 'string' ? cat.image : cat.image?.url;
      // Repair if empty, SVG data URI or unsplash URL
      if (!currentUrl || currentUrl.startsWith('data:') || currentUrl.includes('unsplash.com')) {
        const fallbackUrl = getCategoryFallbackImage(cat.name);
        cat.image = { url: fallbackUrl, publicId: `fallback_cat_${cat._id}` };
        await cat.save();
      }
    }

    // Repair Products
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
          if (!imgUrl || imgUrl.startsWith('data:') || imgUrl.includes('unsplash.com')) {
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

    console.log(`✓ Repaired ${updatedCount} products/categories with Wikimedia images`);
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

