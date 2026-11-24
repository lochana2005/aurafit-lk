/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

function makeSvg(width, height, label, sub) {
  const cleanId = label.replace(/[^a-zA-Z0-9]/g, '');
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${cleanId}" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop stop-color="#191920"/>
      <stop offset="0.5" stop-color="#121216"/>
      <stop offset="1" stop-color="#0A0A0C"/>
    </linearGradient>
    <linearGradient id="champagne-${cleanId}" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#FBF4DE"/>
      <stop offset="0.5" stop-color="#E2C275"/>
      <stop offset="1" stop-color="#A8842E"/>
    </linearGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.025)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg-${cleanId})"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  <rect x="1" y="1" width="${width-2}" height="${height-2}" rx="12" stroke="rgba(255,255,255,0.08)"/>
  <circle cx="${width/2}" cy="${height/2 - 16}" r="${Math.min(width, height) * 0.16}" stroke="rgba(226,194,117,0.25)" stroke-dasharray="4 4" fill="none"/>
  <text x="${width/2}" y="${height/2 - 4}" text-anchor="middle" fill="url(#champagne-${cleanId})" font-family="sans-serif" font-weight="800" font-size="${Math.max(12, Math.min(22, width * 0.035))}" letter-spacing="2">
    ${label.toUpperCase()}
  </text>
  <text x="${width/2}" y="${height/2 + 20}" text-anchor="middle" fill="#A1A1AA" font-family="sans-serif" font-size="11" letter-spacing="1">
    ${sub || 'AUTHENTIC STUDIO PHOTOGRAPHY'}
  </text>
</svg>`;
}

const bannersDir = path.join(process.cwd(), 'public/images/banners');
const categoriesDir = path.join(process.cwd(), 'public/images/categories');
const productsDir = path.join(process.cwd(), 'public/images/products');

[bannersDir, categoriesDir, productsDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Banners
fs.writeFileSync(path.join(bannersDir, 'hero-vault.jpg'), makeSvg(1200, 600, 'AUTHENTIC SUPPLEMENT VAULT', 'AURAFIT.LK SRI LANKA'));
fs.writeFileSync(path.join(bannersDir, 'hero-isolate.jpg'), makeSvg(1200, 600, '100% HYDROLYZED ISOLATE', 'MAXIMUM ABSORPTION & PURITY'));
fs.writeFileSync(path.join(bannersDir, 'hero-preworkout.jpg'), makeSvg(1200, 600, 'HIGH STIM PRE-WORKOUT', 'EXPLOSIVE POWER & LASER FOCUS'));
fs.writeFileSync(path.join(bannersDir, 'promo-scanner.jpg'), makeSvg(600, 800, 'QR BATCH AUTHENTICATION', 'VERIFY MANUFACTURER COA'));
fs.writeFileSync(path.join(bannersDir, 'editorial-whey.jpg'), makeSvg(800, 450, 'WHEY ISOLATE', '25+ IMPORTED VARIETIES'));
fs.writeFileSync(path.join(bannersDir, 'editorial-preworkout.jpg'), makeSvg(800, 450, 'PRE WORKOUT', 'EXPLOSIVE PUMP FORMULAS'));
fs.writeFileSync(path.join(bannersDir, 'editorial-creatine.jpg'), makeSvg(800, 450, 'CREATINE', 'CREAPURE® & MICRONIZED'));

// Categories
const cats = ['whey-protein', 'mass-gainer', 'creatine', 'pre-workout', 'bcaa', 'fat-burner', 'multivitamins', 'accessories'];
cats.forEach(c => {
  fs.writeFileSync(path.join(categoriesDir, `${c}.png`), makeSvg(300, 300, c.replace('-', ' '), 'CATEGORY STUDIO PNG'));
});

// Products
const prods = [
  'gold-standard-isolate', 'king-mass-xl', 'platinum-creatine', 'c4-ultimate',
  'iso100-hydrolyzed', 'animal-pak', 'ghost-legend', 'anabolic-mass'
];
prods.forEach(p => {
  fs.writeFileSync(path.join(productsDir, `${p}.png`), makeSvg(500, 500, p.replace(/-/g, ' '), 'AUTHENTIC PRODUCT PHOTO'));
});

console.log('All champagne gold studio placeholders regenerated in public/images');
