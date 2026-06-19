const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

// The exact uÜnvanı bug
content = content.replace(/u\u00Dcnvan\u0131/g, 'unvan');

// UI fixes from screenshot
content = content.replace(/Y\ufffdNET\ufffdC\ufffd/g, 'YÖNETİCİ');
content = content.replace(/Y\? NET\ufffdC\ufffd/g, 'YÖNETİCİ');
content = content.replace(/Y\? NETİCİ/g, 'YÖNETİCİ');
content = content.replace(/Y\ufffdNETİCİ/g, 'YÖNETİCİ');
content = content.replace(/Y\ufffdNET\u0130C\u0130/g, 'YÖNETİCİ');

content = content.replace(/\? zet Rapor/g, 'Özet Rapor');
content = content.replace(/\ufffd zet Rapor/g, 'Özet Rapor');

content = content.replace(/Günlük \ufffd!alı\ufffdşma/g, 'Günlük Çalışma');
content = content.replace(/Günlük \?!alı\?şma/g, 'Günlük Çalışma');
content = content.replace(/\ufffd!alı\ufffdşma/g, 'Çalışma');
content = content.replace(/\?!alı\?şma/g, 'Çalışma');

content = content.replace(/ilaşlama/g, 'ilaçlama');
content = content.replace(/ila\ufffdlama/g, 'ilaçlama');

content = content.replace(/\ufffdAR/g, 'ÇAR');
content = content.replace(/\?AR/g, 'ÇAR');

content = content.replace(/ş&/g, '📅');
content = content.replace(/\ufffdş&/g, '📅');

content = content.replace(/S Görev/g, '✓ Görev');
content = content.replace(/\ufffdS Görev/g, '✓ Görev');
content = content.replace(/\?S Görev/g, '✓ Görev');

content = content.replace(/Evraşı/g, 'Evrağı');
content = content.replace(/Evra\ufffdşı/g, 'Evrağı');
content = content.replace(/Evra\?şı/g, 'Evrağı');

content = content.replace(/i\ufffd listesi/g, 'iş listesi');
content = content.replace(/i\? listesi/g, 'iş listesi');

fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Fixed precise UI strings and unvan');
