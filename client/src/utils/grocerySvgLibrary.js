/**
 * Self-contained SVG image library for GrocMart Grocery Stores (Client).
 * Generates instant, 100% reliable SVG Data URIs that never fail or get blocked by adblockers/CDNs.
 */

const encodeSvg = (svgString) => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim().replace(/\s+/g, ' '))}`;
};

const createProductCardSvg = (title, categoryName, bg1, bg2, accent, mainShape) => {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg1}" />
      <stop offset="100%" stop-color="${bg2}" />
    </linearGradient>
    <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity="0.12" />
    </filter>
  </defs>
  <rect width="500" height="500" rx="36" fill="url(#g)" />
  
  <circle cx="420" cy="80" r="90" fill="#ffffff" opacity="0.15" />
  <circle cx="80" cy="420" r="110" fill="#ffffff" opacity="0.15" />

  <circle cx="250" cy="220" r="140" fill="#ffffff" opacity="0.95" filter="url(#s)" />

  <g transform="translate(150, 120)">
    ${mainShape}
  </g>

  <rect x="40" y="380" width="420" height="85" rx="24" fill="#ffffff" opacity="0.96" filter="url(#s)" />
  <text x="250" y="425" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="22" fill="#0f172a" text-anchor="middle">${title}</text>
  <text x="250" y="450" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="13" fill="${accent}" letter-spacing="1" text-anchor="middle">${categoryName.toUpperCase()}</text>
</svg>`;
  return encodeSvg(svg);
};

export const svgs = {
  bananas: createProductCardSvg('Fresh Organic Bananas', 'Fruits & Vegetables', '#fef9c3', '#fef08a', '#ca8a04', `
    <path fill="#facc15" stroke="#eab308" stroke-width="4" d="M30 140 C50 60 130 30 170 40 C140 80 110 160 30 140 Z"/>
    <path fill="#eab308" d="M160 35 L175 42 L165 50 Z"/>
    <path fill="#fef08a" opacity="0.6" d="M45 130 C65 70 125 45 155 50"/>
  `),

  apples: createProductCardSvg('Shimla Crisp Apples', 'Fruits & Vegetables', '#fee2e2', '#fca5a5', '#dc2626', `
    <path fill="#ef4444" d="M100 40 C60 10 20 60 30 120 C40 170 100 180 100 180 C100 180 160 170 170 120 C180 60 140 10 100 40 Z"/>
    <path fill="#15803d" d="M100 40 C100 20 120 15 130 25 C120 35 105 35 100 40 Z"/>
    <path fill="#ffffff" opacity="0.3" d="M50 70 A30 40 0 0 1 70 50"/>
  `),

  tomatoes: createProductCardSvg('Farm Fresh Red Tomatoes', 'Fruits & Vegetables', '#ffe4e6', '#fecdd3', '#e11d48', `
    <circle cx="100" cy="110" r="70" fill="#f43f5e"/>
    <path fill="#16a34a" d="M100 40 L90 55 L70 45 L85 65 L65 75 L90 75 L100 40 L110 75 L135 75 L115 65 L130 45 L110 55 Z"/>
    <ellipse cx="75" cy="85" rx="12" ry="20" fill="#ffffff" opacity="0.3" transform="rotate(-30 75 85)"/>
  `),

  onions: createProductCardSvg('Nashik Red Onions', 'Fruits & Vegetables', '#f3e8ff', '#e9d5ff', '#7e22ce', `
    <path fill="#a855f7" d="M100 30 C50 50 30 110 50 150 C70 180 130 180 150 150 C170 110 150 50 100 30 Z"/>
    <path fill="#c084fc" opacity="0.5" d="M80 50 C60 80 60 130 80 160"/>
    <path fill="#c084fc" opacity="0.5" d="M120 50 C140 80 140 130 120 160"/>
    <path fill="#7e22ce" d="M95 20 L105 20 L100 35 Z"/>
  `),

  potato: createProductCardSvg('Fresh Baby Potato (Aloo)', 'Fruits & Vegetables', '#fef3c7', '#fde68a', '#b45309', `
    <ellipse cx="100" cy="100" rx="75" ry="55" fill="#d97706" transform="rotate(-15 100 100)"/>
    <circle cx="60" cy="80" r="5" fill="#b45309"/>
    <circle cx="120" cy="110" r="6" fill="#b45309"/>
    <circle cx="140" cy="80" r="4" fill="#b45309"/>
  `),

  atta: createProductCardSvg('Whole Wheat Sharbati Atta', 'Rice & Grains', '#fff7ed', '#ffedd5', '#c2410c', `
    <path fill="#ea580c" d="M40 50 L160 50 L140 170 L60 170 Z"/>
    <rect x="55" y="70" width="90" height="80" rx="12" fill="#ffffff" opacity="0.9"/>
    <text x="100" y="115" font-family="sans-serif" font-weight="900" font-size="22" fill="#c2410c" text-anchor="middle">ATTA</text>
  `),

  rice: createProductCardSvg('Aged Basmati Rice', 'Rice & Grains', '#f0fdf4', '#dcfce7', '#15803d', `
    <path fill="#16a34a" d="M40 40 L160 40 L145 170 L55 170 Z"/>
    <rect x="55" y="65" width="90" height="80" rx="12" fill="#ffffff" opacity="0.9"/>
    <text x="100" y="110" font-family="sans-serif" font-weight="900" font-size="18" fill="#15803d" text-anchor="middle">RICE</text>
  `),

  dal: createProductCardSvg('Unpolished Toor & Moong Dal', 'Pulses & Dal', '#fefce8', '#fef08a', '#ca8a04', `
    <circle cx="65" cy="80" r="30" fill="#eab308"/>
    <circle cx="135" cy="80" r="30" fill="#ca8a04"/>
    <circle cx="100" cy="130" r="30" fill="#a16207"/>
  `),

  oil: createProductCardSvg('Sunflower & Mustard Oil', 'Cooking Oil & Ghee', '#fff7ed', '#fed7aa', '#ea580c', `
    <rect x="65" y="30" width="70" height="130" rx="16" fill="#f97316"/>
    <rect x="80" y="15" width="40" height="18" rx="4" fill="#c2410c"/>
    <circle cx="100" cy="95" r="22" fill="#fef08a"/>
  `),

  ghee: createProductCardSvg('Pure Cow Ghee Jar', 'Cooking Oil & Ghee', '#fefce8', '#fef08a', '#854d0e', `
    <rect x="55" y="45" width="90" height="110" rx="18" fill="#eab308"/>
    <rect x="70" y="25" width="60" height="20" rx="6" fill="#ca8a04"/>
    <text x="100" y="110" font-family="sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="middle">GHEE</text>
  `),

  milk: createProductCardSvg('Fresh Toned Milk Pouch', 'Dairy & Eggs', '#f0f9ff', '#e0f2fe', '#0369a1', `
    <path fill="#0284c7" d="M45 40 L155 40 L140 160 L60 160 Z"/>
    <circle cx="100" cy="100" r="30" fill="#ffffff"/>
    <text x="100" y="106" font-family="sans-serif" font-weight="900" font-size="16" fill="#0284c7" text-anchor="middle">MILK</text>
  `),

  butter: createProductCardSvg('Pasteurised Butter Pack', 'Dairy & Eggs', '#fefce8', '#fef08a', '#a16207', `
    <rect x="40" y="60" width="120" height="70" rx="12" fill="#facc15"/>
    <path fill="#eab308" d="M40 60 L70 40 L190 40 L160 60 Z"/>
    <path fill="#ca8a04" d="M160 60 L190 40 L190 110 L160 130 Z"/>
  `),

  paneer: createProductCardSvg('Fresh Malai Paneer', 'Dairy & Eggs', '#f8fafc', '#f1f5f9', '#475569', `
    <rect x="45" y="55" width="110" height="90" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
    <line x1="45" y1="85" x2="155" y2="85" stroke="#e2e8f0" stroke-width="3"/>
    <line x1="45" y1="115" x2="155" y2="115" stroke="#e2e8f0" stroke-width="3"/>
    <line x1="85" y1="55" x2="85" y2="145" stroke="#e2e8f0" stroke-width="3"/>
    <line x1="120" y1="55" x2="120" y2="145" stroke="#e2e8f0" stroke-width="3"/>
  `),

  eggs: createProductCardSvg('Farm Country Eggs Tray', 'Dairy & Eggs', '#fff7ed', '#ffedd5', '#c2410c', `
    <ellipse cx="70" cy="95" rx="24" ry="34" fill="#ffedd5" stroke="#fed7aa" stroke-width="3"/>
    <ellipse cx="130" cy="95" rx="24" ry="34" fill="#ffedd5" stroke="#fed7aa" stroke-width="3"/>
    <ellipse cx="100" cy="115" rx="24" ry="34" fill="#ffedd5" stroke="#fed7aa" stroke-width="3"/>
  `),

  salt: createProductCardSvg('Iodised Vacuum Salt', 'Spices & Masalas', '#f8fafc', '#e2e8f0', '#334155', `
    <rect x="55" y="40" width="90" height="120" rx="16" fill="#0284c7"/>
    <circle cx="100" cy="95" r="28" fill="#ffffff"/>
    <text x="100" y="101" font-family="sans-serif" font-weight="900" font-size="16" fill="#0284c7" text-anchor="middle">SALT</text>
  `),

  spices: createProductCardSvg('Red Chilli & Garam Masala', 'Spices & Masalas', '#fff1f2', '#fecdd3', '#be123c', `
    <path fill="#e11d48" d="M50 50 L150 50 L135 160 L65 160 Z"/>
    <circle cx="100" cy="100" r="25" fill="#fef08a"/>
  `),

  biscuits: createProductCardSvg('Glucose & Cream Biscuits', 'Snacks & Munchies', '#fef3c7', '#fde68a', '#b45309', `
    <rect x="45" y="55" width="110" height="80" rx="16" fill="#d97706"/>
    <circle cx="70" cy="75" r="4" fill="#fef08a"/>
    <circle cx="100" cy="75" r="4" fill="#fef08a"/>
    <circle cx="130" cy="75" r="4" fill="#fef08a"/>
    <circle cx="70" cy="115" r="4" fill="#fef08a"/>
    <circle cx="100" cy="115" r="4" fill="#fef08a"/>
    <circle cx="130" cy="115" r="4" fill="#fef08a"/>
  `),

  chips: createProductCardSvg('Crispy Potato Chips', 'Snacks & Munchies', '#fef9c3', '#fef08a', '#ca8a04', `
    <path fill="#ef4444" d="M45 40 L155 40 L140 160 L60 160 Z"/>
    <text x="100" y="110" font-family="sans-serif" font-weight="900" font-size="20" fill="#fef08a" text-anchor="middle">CHIPS</text>
  `),

  beverages: createProductCardSvg('Juices & Soft Drinks', 'Beverages', '#eff6ff', '#dbeafe', '#1d4ed8', `
    <path fill="#2563eb" d="M70 40 L130 40 L120 160 L80 160 Z"/>
    <rect x="90" y="20" width="20" height="20" fill="#1e40af"/>
    <circle cx="100" cy="100" r="20" fill="#fde047"/>
  `),

  tea: createProductCardSvg('Premium Leaf Tea & Coffee', 'Tea & Coffee', '#fef3c7', '#fde68a', '#92400e', `
    <rect x="55" y="45" width="90" height="110" rx="16" fill="#78350f"/>
    <text x="100" y="110" font-family="sans-serif" font-weight="900" font-size="20" fill="#fef08a" text-anchor="middle">TEA</text>
  `),

  noodles: createProductCardSvg('Instant Masala Noodles', 'Instant & Ready Foods', '#fef9c3', '#fef08a', '#ca8a04', `
    <rect x="45" y="45" width="110" height="100" rx="16" fill="#eab308"/>
    <text x="100" y="105" font-family="sans-serif" font-weight="900" font-size="16" fill="#78350f" text-anchor="middle">NOODLES</text>
  `),

  cleaning: createProductCardSvg('Detergent & Cleaners', 'Household & Cleaning', '#f0fdf4', '#dcfce7', '#15803d', `
    <rect x="65" y="40" width="70" height="120" rx="14" fill="#16a34a"/>
    <rect x="80" y="20" width="40" height="20" rx="4" fill="#15803d"/>
  `),

  bread: createProductCardSvg('Whole Wheat Bread Loaf', 'Bakery & Bread', '#fffbe6', '#fef08a', '#a16207', `
    <path fill="#d97706" d="M40 70 Q100 30 160 70 L150 140 Q100 150 50 140 Z"/>
    <line x1="70" y1="65" x2="80" y2="120" stroke="#fef08a" stroke-width="5"/>
    <line x1="100" y1="55" x2="110" y2="125" stroke="#fef08a" stroke-width="5"/>
    <line x1="130" y1="65" x2="140" y2="120" stroke="#fef08a" stroke-width="5"/>
  `),

  defaultGrocery: createProductCardSvg('Fresh Daily Grocery', 'Staples & Essentials', '#ecfdf5', '#a7f3d0', '#047857', `
    <path fill="#059669" d="M40 70 L160 70 L145 160 L55 160 Z"/>
    <circle cx="100" cy="50" r="25" fill="#34d399"/>
    <text x="100" y="125" font-family="sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="middle">GROCERY</text>
  `)
};

export const getCategorySvg = (catName = '') => {
  const name = String(catName).toLowerCase();
  if (name.includes('fruit') || name.includes('veg')) return svgs.apples;
  if (name.includes('rice') || name.includes('grain')) return svgs.rice;
  if (name.includes('pulse') || name.includes('dal')) return svgs.dal;
  if (name.includes('oil') || name.includes('ghee')) return svgs.oil;
  if (name.includes('dairy') || name.includes('egg')) return svgs.milk;
  if (name.includes('bakery') || name.includes('bread')) return svgs.bread;
  if (name.includes('snack') || name.includes('munch')) return svgs.chips;
  if (name.includes('bever') || name.includes('drink')) return svgs.beverages;
  if (name.includes('spice') || name.includes('masala')) return svgs.spices;
  if (name.includes('tea') || name.includes('coffee')) return svgs.tea;
  if (name.includes('instant') || name.includes('noodle')) return svgs.noodles;
  if (name.includes('house') || name.includes('clean')) return svgs.cleaning;
  return svgs.defaultGrocery;
};

export const getProductSvg = (productName = '', categoryName = '') => {
  const name = String(productName).toLowerCase();
  if (name.includes('banana')) return svgs.bananas;
  if (name.includes('apple')) return svgs.apples;
  if (name.includes('tomato')) return svgs.tomatoes;
  if (name.includes('onion')) return svgs.onions;
  if (name.includes('potato') || name.includes('aloo')) return svgs.potato;
  if (name.includes('atta') || name.includes('wheat')) return svgs.atta;
  if (name.includes('rice') || name.includes('basmati')) return svgs.rice;
  if (name.includes('dal') || name.includes('pulse')) return svgs.dal;
  if (name.includes('ghee')) return svgs.ghee;
  if (name.includes('oil')) return svgs.oil;
  if (name.includes('milk')) return svgs.milk;
  if (name.includes('butter')) return svgs.butter;
  if (name.includes('paneer')) return svgs.paneer;
  if (name.includes('egg')) return svgs.eggs;
  if (name.includes('salt')) return svgs.salt;
  if (name.includes('chilli') || name.includes('masala') || name.includes('turmeric')) return svgs.spices;
  if (name.includes('biscuit') || name.includes('bhujia')) return svgs.biscuits;
  if (name.includes('chip')) return svgs.chips;
  if (name.includes('juice') || name.includes('cola') || name.includes('drink')) return svgs.beverages;
  if (name.includes('tea') || name.includes('coffee')) return svgs.tea;
  if (name.includes('noodle') || name.includes('ready')) return svgs.noodles;
  if (name.includes('detergent') || name.includes('cleaner') || name.includes('wash')) return svgs.cleaning;
  if (name.includes('bread') || name.includes('cake')) return svgs.bread;
  return getCategorySvg(categoryName);
};

export default getProductSvg;
