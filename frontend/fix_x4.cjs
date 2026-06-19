const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

const r = '\ufffd';

content = content.replace(new RegExp('Sisteme ilk giri' + r + ' yapan', 'g'), 'Sisteme ilk giriş yapan');
content = content.replace(new RegExp('Y' + r + ' NET' + r + 'C' + r, 'g'), 'YÖNETİCİ');

fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Fixed final login text');
