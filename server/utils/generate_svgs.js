const fs = require('fs');
const path = require('path');

const clientImagesDir = path.join(__dirname, '../../client/public/images');
const serverImagesDir = path.join(__dirname, '../public/images');

const ensureDirs = () => {
  [
    path.join(clientImagesDir, 'categories'),
    path.join(clientImagesDir, 'products'),
    path.join(serverImagesDir, 'categories'),
    path.join(serverImagesDir, 'products')
  ].forEach(dir => fs.mkdirSync(dir, { recursive: true }));
};

const createSvg = (title, subtitle, bg1, bg2, accentColor, iconSvg) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg1}" />
      <stop offset="100%" stop-color="${bg2}" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.15" />
    </filter>
  </defs>
  <rect width="400" height="400" rx="32" fill="url(#bg)" />
  <circle cx="200" cy="180" r="110" fill="#ffffff" opacity="0.9" filter="url(#shadow)" />
  <g transform="translate(130, 110)">
    ${iconSvg}
  </g>
  <rect x="30" y="300" width="340" height="70" rx="20" fill="#ffffff" opacity="0.95" filter="url(#shadow)" />
  <text x="200" y="335" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="20" fill="#0f172a" text-anchor="middle">${title}</text>
  <text x="200" y="356" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="13" fill="${accentColor}" text-anchor="middle">${subtitle}</text>
</svg>
`;

const svgs = {
  categories: {
    'fruits-vegetables': createSvg('Fruits & Vegetables', 'Farm Fresh & Organic', '#e6f4ea', '#ceead6', '#137333',
      `<path fill="#34a853" d="M70 20 C40 20 20 50 20 80 C20 110 50 130 70 130 C90 130 120 110 120 80 C120 50 100 20 70 20 Z"/>
       <path fill="#ea4335" d="M40 50 Q70 10 90 40 Q50 90 40 50 Z"/>
       <circle cx="60" cy="70" r="10" fill="#fbbc04"/>
       <circle cx="80" cy="85" r="8" fill="#4285f4"/>`
    ),
    'rice-grains': createSvg('Rice & Grains', 'Premium Staples & Atta', '#ffeef0', '#fedbf0', '#b91c1c',
      `<path fill="#d97706" d="M30 110 C30 50 70 20 70 20 C70 20 110 50 110 110 Z"/>
       <path fill="#f59e0b" d="M45 100 C45 60 70 35 70 35 C70 35 95 60 95 100 Z"/>
       <circle cx="70" cy="70" r="12" fill="#ffffff"/>`
    ),
    'pulses-dal': createSvg('Pulses & Dal', 'Protein-Rich Unpolished', '#fef3c7', '#fde68a', '#b45309',
      `<circle cx="50" cy="60" r="25" fill="#f59e0b"/>
       <circle cx="90" cy="60" r="25" fill="#d97706"/>
       <circle cx="70" cy="95" r="25" fill="#b45309"/>`
    ),
    'cooking-oil-ghee': createSvg('Cooking Oil & Ghee', 'Pure Refined & Cow Ghee', '#fff7ed', '#ffedd5', '#c2410c',
      `<path fill="#f97316" d="M50 40 L90 40 L100 120 L40 120 Z"/>
       <rect x="60" y="20" width="20" height="20" rx="4" fill="#ea580c"/>
       <circle cx="70" cy="80" r="15" fill="#fde047"/>`
    ),
    'dairy-eggs': createSvg('Dairy & Eggs', 'Fresh Milk, Paneer & Eggs', '#f0f9ff', '#e0f2fe', '#0369a1',
      `<rect x="40" y="40" width="40" height="80" rx="10" fill="#0284c7"/>
       <ellipse cx="95" cy="80" rx="20" ry="28" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4"/>`
    ),
    'bakery-bread': createSvg('Bakery & Bread', 'Fresh Bakes & Breads', '#fffbe6', '#fef08a', '#a16207',
      `<path fill="#ca8a04" d="M30 60 Q70 20 110 60 L110 100 Q70 110 30 100 Z"/>
       <line x1="50" y1="50" x2="60" y2="80" stroke="#fef08a" stroke-width="6" stroke-linecap="round"/>
       <line x1="70" y1="45" x2="80" y2="85" stroke="#fef08a" stroke-width="6" stroke-linecap="round"/>
