/**
 * Calculate discount amount and discount percentage based on MRP and Selling Price
 * @param {number} mrp - Maximum Retail Price
 * @param {number} sellingPrice - Actual selling price
 * @returns {object} { discountAmount, discountPercentage }
 */
const calculateDiscount = (mrp, sellingPrice) => {
  const safeMrp = Number(mrp) || 0;
  const safeSellingPrice = Number(sellingPrice) || 0;

  if (safeMrp <= 0 || safeSellingPrice >= safeMrp) {
    return {
      discountAmount: 0,
      discountPercentage: 0
    };
  }

  const discountAmount = Math.round((safeMrp - safeSellingPrice) * 100) / 100;
  const discountPercentage = Math.round(((safeMrp - safeSellingPrice) / safeMrp) * 100);

  return {
    discountAmount,
    discountPercentage
  };
};

module.exports = calculateDiscount;
