const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

// First, remove ALL bad control characters
content = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');

const replacements = {
  // Now we replace the remnants of the broken emojis
  "ş ` Aylık": "📊 Aylık",
  "ş ÖExcel": "📄 Excel",
  "ş 🏢 Müşteri Bazlı": "🏢 Müşteri Bazlı",
  "ş 🏢 refik": "🏢 refik",
  "ş 🏢 Cihan": "🏢 Cihan",
  "ş 🏢 Nermin": "🏢 Nermin",
  "ş 🏢 ": "🏢 ",
  "ş ÖSaha": "👷 Saha",
  "ş ÖCihaz": "🔍 Cihaz",
  "ş Ö{selectedStationForCheck": "📍 {selectedStationForCheck",
  "ş ÖYem": "🏢 Yem",
  "ş ÖYeni": "➕ Yeni",
  "ş   Bu müşt": "ℹ️ Bu müşt",
  "ş ️ {p.title": "📍 {p.title",
  "ş ` HACCP": "📈 HACCP",
  "ş 9 Cihaz Kart": "📋 Cihaz Kart",
  "ş\"  Son Kont": "✅ Son Kont",
  "ş & {new Date": "📅 {new Date",
  "ş  ️ Cihazı Sil": "🗑️ Cihazı Sil",
  "Ü ️ Sonucu": "✅ Sonucu",
  "ş ️ İnteraktif": "🗺️ İnteraktif",
  " ️ İstasyon deta": "🪤 İstasyon deta",
};

for (const [bad, good] of Object.entries(replacements)) {
  content = content.replace(new RegExp(bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), good);
}

// Any other `ş Ö`, `ş ` `, `ş 🏢` leftovers:
content = content.replace(/ş Ö/g, '');
content = content.replace(/ş `/g, '');
content = content.replace(/ş 🏢 /g, '🏢 ');
content = content.replace(/ş 🏢/g, '🏢');
content = content.replace(/ş \"/g, '');
content = content.replace(/ş \&/g, '');
content = content.replace(/ş 9/g, '');

fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Cleaned up control characters and leftover emojis');
