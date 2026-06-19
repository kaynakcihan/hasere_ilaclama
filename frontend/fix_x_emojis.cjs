const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

const replacements = {
  // SVG and Coordinate x to ş bugs
  'rect ş="': 'rect x="',
  'rş="': 'rx="',
  'ş: 50, y: 50': 'x: 50, y: 50',
  'const ş = ': 'const x = ',
  '({ ş, y })': '({ x, y })',
  'ickCoords.ş': 'ickCoords.x',
  'ş={ş - 15}': 'x={x - 15}',
  'ş={ş}': 'x={x}',
  'ş="185"': 'x="185"',
  'xmlns:ş=': 'xmlns:x=',
  'ş:CharSet=': 'x:CharSet=',
  'ş:Family=': 'x:Family=',
  'pos.ş': 'pos.x',
  'ş: e.touches': 'x: e.touches',
  'e.clientŞ': 'e.clientX',
  'profile-boş': 'profile-box',
  'signature-boş': 'signature-box',
  'ş: e.clientŞ': 'x: e.clientX',

  // Leftover Emojis
  'ş Bu müşteri': 'ℹ️ Bu müşteri',
  'ş️ Cihazı Si': '🗑️ Cihazı Si',
  'ş& {appDateS': '📅 {appDateS',
  'ş Ertele': '⏰ Ertele',
  'ş Fatura Kes': '🧾 Fatura Kes',
  ' Yönetimi ş</h1>': ' Yönetimi 💰</h1>',
  'ş` Kategoril': '📑 Kategoril',
  'ş9 Harcama K': '🏷️ Harcama K',
  'yu Ertele ş</h2>': 'yu Ertele ⏰</h2>',
  "'ş9 Hazır Lis": "'📋 Hazır Lis",
  'ş Raporu Oto': '⚙️ Raporu Oto',
  'vu Planla ş&</h2>': 'vu Planla 📅</h2>',
  "ş Aylık Fatu": "🧾 Aylık Fatu",
};

for (const [bad, good] of Object.entries(replacements)) {
  content = content.replace(new RegExp(bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), good);
}

fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Fixed x/ş bugs and final emojis');
