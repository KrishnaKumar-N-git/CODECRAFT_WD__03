let counter = 10000;

const generateOrderNumber = () => {
  counter += 1;
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `APK-${year}-${counter}${randomSuffix}`;
};

module.exports = generateOrderNumber;
