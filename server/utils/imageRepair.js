const Product = require('../models/Product');
const Category = require('../models/Category');

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop';

const categoryImages = {
  'Fruits & Vegetables': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop',
  'Rice & Grains': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop',
  'Pulses & Dal': 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop',
  'Cooking Oil & Ghee': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop',
  'Dairy & Eggs': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop',
  'Bakery & Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop',
  'Snacks & Munchies': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop',
  'Beverages': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop',
  'Spices & Masalas': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop',
  'Personal Care': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop',
  'Household & Cleaning': 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop',
  'Baby Care': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop',
  'Frozen Foods': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop',
  'Tea & Coffee': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop',
  'Instant & Ready Foods': 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop'
};

const productImageMap = [
  { match: 'Atta', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop' },
  { match: 'Basmati Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop' },
  { match: 'Raw Rice', url: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&auto=format&fit=crop' },
  { match: 'Toor Dal', url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop' },
  { match: 'Moong Dal', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop' },
  { match: 'Chana Dal', url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop' },
  { match: 'Chana Whole', url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop' },
  { match: 'Sunflower Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop' },
  { match: 'Ghee', url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop' },
  { match: 'Mustard Oil', url: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=600&auto=format&fit=crop' },
  { match: 'Healthy Heart Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop' },
  { match: 'Milk', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop' },
  { match: 'Butter', url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop' },
  { match: 'Paneer', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop' },
  { match: 'Eggs', url: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&auto=format&fit=crop' },
  { match: 'Apples', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop' },
  { match: 'Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop' },
  { match: 'Onions', url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop' },
  { match: 'Potato', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop' },
  { match: 'Bananas', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop' },
  { match: 'Salt', url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop' },
  { match: 'Chilli Powder', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop' },
  { match: 'Garam Masala', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop' },
  { match: 'Turmeric', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop' },
  { match: 'Biscuits', url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop' },
  { match: 'Bhujia', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop' },
  { match: 'Chips', url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop' },
  { match: 'Makhana', url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop' },
  { match: 'Orange Juice', url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop' },
  { match: 'Coca-Cola', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop' },
  { match: 'Mango Drink', url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop' },
  { match: 'Tea', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop' },
  { match: 'Coffee', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop' },
  { match: 'Noodles', url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop' },
  { match: 'Ready to Eat', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop' },
  { match: 'Soup', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop' },
  { match: 'Detergent', url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop' },
  { match: 'Floor Cleaner', url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop' },
  { match: 'Dishwash', url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop' },
  { match: 'Toilet Cleaner', url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop' },
  { match: 'Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop' },
  { match: 'Cake', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop' },
  { match: 'Soap', url: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop' },
  { match: 'Toothpaste', url: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=600&auto=format&fit=crop' },
  { match: 'Shampoo', url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop' },
  { match: 'Diapers', url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop' },
  { match: 'Wipes', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop' },
  { match: 'Green Peas', url: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600&auto=format&fit=crop' },
  { match: 'French Fries', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop' }
];

const BROKEN_URLS = [
  'photo-1585994191611-72b357ee515d',
  'photo-1618512496248-a07fe83aa8cf',
  'photo-1518110168401-f284358636cd',
  'photo-1509358271058-acd05cc93898',
  'photo-1621996346565-e3d5d6281270',
  'photo-1546171753-97d7676e4180'
];

const getRelevantImage = (productName, categoryName = '') => {
  const nameLower = productName.toLowerCase();
  const match = productImageMap.find((item) => nameLower.includes(item.match.toLowerCase()));
  if (match) return match.url;
  if (categoryName && categoryImages[categoryName]) return categoryImages[categoryName];
  return DEFAULT_IMAGE;
};

const repairProductImages = async () => {
  try {
    const products = await Product.find({}).populate('category', 'name');
    let updatedCount = 0;

    for (const product of products) {
      let needsFix = false;
      const categoryName = product.category?.name || '';
      const relevantUrl = getRelevantImage(product.name, categoryName);

      if (!product.images || product.images.length === 0) {
        needsFix = true;
      } else {
        for (let i = 0; i < product.images.length; i++) {
          const imgUrl = product.images[i].url || '';
          const isBroken = !imgUrl || BROKEN_URLS.some((id) => imgUrl.includes(id));
          if (isBroken) {
            product.images[i].url = relevantUrl;
            needsFix = true;
          }
        }
      }

      if (needsFix) {
        if (!product.images || product.images.length === 0) {
          product.images = [{ url: relevantUrl, publicId: `repaired_${product._id}`, isPrimary: true }];
        }
        await product.save();
        updatedCount++;
      }
    }

    if (updatedCount > 0) {
      console.log(`✓ Repaired product images for ${updatedCount} products in MongoDB`);
    }
    return { success: true, count: updatedCount };
  } catch (error) {
    console.error('Error repairing product images:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  DEFAULT_IMAGE,
  categoryImages,
  productImageMap,
  getRelevantImage,
  repairProductImages
};
