const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

const replacements = {
  "ş` Aylık": "📊 Aylık",
  "şÖExcel": "📄 Excel",
  "ş🏢 ": "🏢 ",
  "ş🏢": "🏢",
  "şÖSaha": "👷 Saha",
  "şÖCihaz": "🔍 Cihaz",
  "şÖ{selectedStationForCheck": "📍 {selectedStationForCheck",
  "şÖYem": "🏢 Yem",
  "şÖYeni": "➕ Yeni",
  "ş  Bu müşt": "ℹ️ Bu müşt",
  "ş️ {p.title": "📍 {p.title",
  "ş` HACCP": "📈 HACCP",
  "ş9 Cihaz Kart": "📋 Cihaz Kart",
  "ş\" Son Kont": "✅ Son Kont",
  "ş& {new Date": "📅 {new Date",
  "ş ️ Cihazı Sil": "🗑️ Cihazı Sil",
  "ş️ İnteraktif": "🗺️ İnteraktif",
  "️ İstasyon deta": "🪤 İstasyon deta",
};

for (const [bad, good] of Object.entries(replacements)) {
  content = content.replace(new RegExp(bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), good);
}

fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Fixed precise leftovers');
