const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

const r = '\ufffd';

const replacements = {
  [`${r} ZEL`]: "ÖZEL",
  [`Y${r} NETİMİ`]: "YÖNETİMİ",
  [`${r} rn:`]: "Örn:",
  [`B${r} LÜM`]: "BÖLÜM",
  [`İ${r}İş`]: "İş",
  [`${r} mür`]: "Ömür",
  [`K${r} RFEZ`]: "KÖRFEZ",
  [`Y${r} NETİCİ`]: "YÖNETİCİ",
  [`${r} zet Rapor`]: "Özet Rapor",
  [`G${r} RÜNÜMÜ`]: "GÖRÜNÜMÜ",
  [`${r}a"️`]: "⚙️",
  [`ş"${r}️`]: "🪤",
  [`${r} ${r}️`]: "📍",
  [`${r} `]: "Ö",
};

for (const [bad, good] of Object.entries(replacements)) {
  content = content.replace(new RegExp(bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), good);
}

fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Fixed final words');
