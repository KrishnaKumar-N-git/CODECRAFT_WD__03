const Product = require('../models/Product');
const Category = require('../models/Category');

// Item-specific reliable public Wikimedia Commons photos (100% CORS & adblocker friendly)
const SPECIFIC_PRODUCT_IMAGES = {
  'banana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Single.jpg/600px-Banana-Single.jpg',
  'apple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/600px-Red_Apple.jpg',
  'tomato': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/600px-Tomato_je.jpg',
  'onion': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Onion_on_White.JPG/600px-Onion_on_White.JPG',
  'potato': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Patates.jpg/600px-Patates.jpg',
  'milk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Milk_glass.jpg/600px-Milk_glass.jpg',
  'butter': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Supreme_cut_butter.jpg/600px-Supreme_cut_butter.jpg',
  'paneer': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Paneer_cubes.jpg/600px-Paneer_cubes.jpg',
  'bread': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Kaisersemmel-.jpg/600px-Kaisersemmel-.jpg',
  'porotta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Kaisersemmel-.jpg/600px-Kaisersemmel-.jpg',
  'parotta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Kaisersemmel-.jpg/600px-Kaisersemmel-.jpg',
  'fish': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Salmon_raw.jpg/600px-Salmon_raw.jpg',
  'rice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Uncooked_rice.jpg/600px-Uncooked_rice.jpg',
  'oil': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Olive_oil_from_One_Two_Free.jpg/600px-Olive_oil_from_One_Two_Free.jpg',
  'ghee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Supreme_cut_butter.jpg/600px-Supreme_cut_butter.jpg',
  'tea': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/600px-A_small_cup_of_coffee.JPG',
  'coffee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/600px-A_small_cup_of_coffee.JPG',
  'egg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Egg_white.jpg/600px-Egg_white.jpg',
};

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

const getRelevantImage = (productName = '', categoryName = '') => {
  const nameLower = (productName || '').toLowerCase();
  for (const [key, url] of Object.entries(SPECIFIC_PRODUCT_IMAGES)) {
    if (nameLower.includes(key)) return url;
  }
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
      if (!currentUrl) {
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
          const imgUrl = product.images[i]?.url || (typeof product.images[i] === 'string' ? product.images[i] : '');
          // Repair ONLY if empty or missing
          if (!imgUrl) {
            product.images[i] = {
              url: getRelevantImage(product.name, categoryName),
              publicId: `fallback_prod_${product._id}_${i}`,
              isPrimary: i === 0
            };
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        await product.save();
        updatedCount++;
      }
    }

    console.log(`✓ Repaired ${updatedCount} products/categories with valuable grocery images`);
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
