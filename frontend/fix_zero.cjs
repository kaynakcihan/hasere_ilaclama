const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

const r = '\ufffd';

const replacements = {
  [`${r}  Dişer`]: "🐛 Diğer",
  [`ş ${r}️ İnteraktif`]: "🗺️ İnteraktif",
  [`${r} ${r}️ İstasyon`]: "🪤 İstasyon",
  [`ş ${r}️ {p.title}`]: "📍 {p.title}",
  [`ş ${r}</h1>`]: "💰</h1>",
  [`${r} ${r}️ Bu form,`]: "📄 Bu form,",
  [`${r} ${r}️ Seçtişiniz`]: "📄 Seçtiğiniz",
  [`ş${r}️ Yazdır`]: "🖨️ Yazdır",
  [`${r}a️ Muhasebe`]: "⚖️ Muhasebe",
};

for (const [bad, good] of Object.entries(replacements)) {
  content = content.replace(new RegExp(bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), good);
}

// And ANY remaining `\ufffd` anywhere just delete it!
content = content.replace(new RegExp(r, 'g'), '');
// And any remaining Dişer -> Diğer
content = content.replace(/Dişer/g, 'Diğer');
content = content.replace(/Seçtişiniz/g, 'Seçtiğiniz');


fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Zero \\ufffd remaining!');
