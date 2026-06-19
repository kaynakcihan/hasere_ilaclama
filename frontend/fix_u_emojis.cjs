const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

const replacements = {
  "Ü️ İmzalı": "✍️ İmzalı",
  "Ü️ Sonucu": "✅ Sonucu",
  "Ü\"</button>": "❌</button>",
  "'Ü ' : ''}{na": "'✅ ' : ''}{na",
  "'Ü ' : ''}{pr": "'✅ ' : ''}{pr",
  "Ü️ Kayıtlı": "✅ Kayıtlı",
};

for (const [bad, good] of Object.entries(replacements)) {
  content = content.replace(new RegExp(bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), good);
}

fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Fixed stray Ü emojis');
