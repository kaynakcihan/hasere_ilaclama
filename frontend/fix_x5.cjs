const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

const r = '\ufffd';
// Replace "giriY" and "Y NET C "
content = content.replace(new RegExp('giri' + r + 'Y', 'g'), 'giriş');
content = content.replace(new RegExp('Y' + r + ' NET' + r + 'C' + r, 'g'), 'YÖNETİCİ');

fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Fixed giriY texts');
