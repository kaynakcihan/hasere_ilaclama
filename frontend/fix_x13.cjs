const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

const r = '\ufffd';
const c = '\x13';

// Replace \ufffd\x13 with Ö
content = content.replace(new RegExp(r + c, 'g'), 'Ö');

// There is also some \x13 left over if we just had it without \ufffd?
content = content.replace(new RegExp(c, 'g'), ''); 

// Check if any other \ufffd combinations exist for Ö
content = content.replace(new RegExp(r + ' ZEL', 'g'), 'ÖZEL');
content = content.replace(new RegExp('Y' + r + ' NETİMİ', 'g'), 'YÖNETİMİ');
content = content.replace(new RegExp(r + ' rn:', 'g'), 'Örn:');
content = content.replace(new RegExp('B' + r + ' LÜM', 'g'), 'BÖLÜM');
content = content.replace(new RegExp(r + ' mür', 'g'), 'Ömür');
content = content.replace(new RegExp('K' + r + ' RFEZ', 'g'), 'KÖRFEZ');
content = content.replace(new RegExp('Y' + r + ' NETİCİ', 'g'), 'YÖNETİCİ');
content = content.replace(new RegExp(r + ' zet', 'g'), 'Özet');
content = content.replace(new RegExp('G' + r + ' RÜNÜMÜ', 'g'), 'GÖRÜNÜMÜ');
content = content.replace(new RegExp(r + ' nlem', 'g'), 'Önlem');
content = content.replace(new RegExp(r + ' NLEM', 'g'), 'ÖNLEM');
content = content.replace(new RegExp(r + ' NER', 'g'), 'ÖNER');
content = content.replace(new RegExp(r + ' özel', 'g'), 'Özel');
content = content.replace(new RegExp(r + ' Ödeme', 'g'), 'Ödeme');

// Wait, the output had `İİş`.
content = content.replace(new RegExp('İ' + r + 'İş', 'g'), 'İş');

fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Fixed control characters and Ö');
