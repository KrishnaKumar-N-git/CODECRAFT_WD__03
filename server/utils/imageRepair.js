const { getProductSvg, getCategorySvg } = require('./grocerySvgLibrary');

const DEFAULT_IMAGE = getCategorySvg('Staples & Groceries');

const getRelevantImage = (productName, categoryName = '') => {
  return getProductSvg(productName, categoryName);
};

const repairProductImages = async () => {
  try {
    const products = await Product.find({}).populate('category', 'name');
    const categories = await Category.find({});
    let updatedCount = 0;

    // Repair Categories
    for (const cat of categories) {
      const catSvg = getCategorySvg(cat.name);
      if (!cat.image || !cat.image.url || cat.image.url.includes('unsplash.com') || cat.image.url.includes('picsum')) {
        cat.image = { url: catSvg, publicId: `svg_cat_${cat._id}` };
        await cat.save();
      }
    }

    // Repair Products
    for (const product of products) {
      const categoryName = product.category?.name || '';
      const svgDataUri = getProductSvg(product.name, categoryName);

      let needsUpdate = false;
      if (!product.images || product.images.length === 0) {
        product.images = [{ url: svgDataUri, publicId: `svg_prod_${product._id}`, isPrimary: true }];
        needsUpdate = true;
      } else {
        for (let i = 0; i < product.images.length; i++) {
          const imgUrl = product.images[i].url || '';
          if (!imgUrl || imgUrl.includes('unsplash.com') || imgUrl.includes('picsum')) {
            product.images[i].url = svgDataUri;
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        await product.save();
        updatedCount++;
      }
    }

    console.log(`✓ Repaired & converted product/category images to SVG Data URIs for ${updatedCount} products in MongoDB`);
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
