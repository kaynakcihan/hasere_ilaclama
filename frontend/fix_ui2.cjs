const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

const r = '\ufffd';
content = content.replace(new RegExp('Biyosidal ' + r + 'Srün Uygulama ve EK-1 Belgelendirme Mobil Yönetim Sistemi', 'g'), 'Biyosidal Ürün Uygulama ve EK-1 Belgelendirme Mobil Yönetim Sistemi');
content = content.replace(new RegExp('Giri' + r + 'ş', 'g'), 'Giriş');
content = content.replace(new RegExp('Y' + r + 'NET' + r + 'C' + r, 'g'), 'YÖNETİCİ');
content = content.replace(new RegExp('mü' + r + 'şteri', 'g'), 'müşteri');
content = content.replace(new RegExp('Mü' + r + 'şteri', 'g'), 'Müşteri');
content = content.replace(new RegExp(r + 'şifre', 'g'), 'şifre');
content = content.replace(new RegExp(r + 'ÜST', 'g'), 'ÜST');
content = content.replace(new RegExp('do' + r + 'şrula', 'g'), 'doğrula');

fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Fixed UI texts 2');
