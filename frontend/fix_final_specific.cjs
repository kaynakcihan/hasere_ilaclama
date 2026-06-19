const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

const replacements = {
  "ş ` Aylık": "📊 Aylık",
  "ş ÖExcel": "📄 Excel",
  "UÜnvanıı": "Unvanı",
  "Ü ️ İmzalı": "✍️ İmzalı",
  "ÜR İmzasız": "❌ İmzasız",
  "öözel": "özel",
  "overflowŞ": "overflow",
  "ş  {app.notes}": "📝 {app.notes}",
  "ş  Excel": "📄 Excel",
  "ş  Saha Teknisyen": "👷 Saha Teknisyen",
  "ş  Cihaz Barkod": "🔍 Cihaz Barkod",
  "ş  İnteraktif": "🗺️ İnteraktif",
  "ş  İstasyon": "🪤 İstasyon",
  "ş  Müşteri E-post": "📧 Müşteri E-post",
  "ş  Müşteri Talebi": "👤 Müşteri Talebi",
  "ş  Teknik / Cihaz": "⚙️ Teknik / Cihaz",
  "ş  Kütüphaneye": "📚 Kütüphaneye",
  "şR️": "🌧️",
  "ş:️": "📄",
  "ş\"️": "🪤",
  "ş  {p.title}": "📍 {p.title}",
  "ş  Yeni Gider": "➕ Yeni Gider",
  "a️": "⚖️",
  "a": "⚖️",
  "": "",
};

for (const [bad, good] of Object.entries(replacements)) {
  content = content.replace(new RegExp(bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), good);
}

fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Fixed final specific errors');
