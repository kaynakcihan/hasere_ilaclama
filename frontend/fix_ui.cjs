const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

// Replace known corrupted strings with their correct Turkish forms for the UI
content = content.replace(/K\ufffdrfez\s*<\s*span\s*>\s*\ufffdla\ufffdlama\s*<\/\s*span\s*>/g, 'Körfez <span>İlaçlama</span>');
content = content.replace(/Biyosidal\s*\ufffd\ufffdr\ufffdn\s*Uygulama/g, 'Biyosidal Ürün Uygulama');
content = content.replace(/Y\ufffdnetim\s*Sistemi/g, 'Yönetim Sistemi');
content = content.replace(/Giri\ufffd\s*Yap\s*\(Test\)/g, 'Giriş Yap (Test)');
content = content.replace(/YA\s*DA\s*GOOGLE\s*\ufffdLE\s*G\ufffdR\ufffd/g, 'YA DA GOOGLE İLE GİRİŞ YAP');
content = content.replace(/Google\s*ile\s*Giri\ufffd\s*Yap/g, 'Google ile Giriş Yap');
content = content.replace(/Y\ufffdNET\ufffdC\ufffd/g, 'YÖNETİCİ');
content = content.replace(/L\ufffdtfen\s*yukar\ufffddaki/g, 'Lütfen yukarıdaki');
content = content.replace(/e-posta\s*giri\ufffdini/g, 'e-posta girişini');

// Replace any remaining K\ufffdrfez with Körfez just in case
content = content.replace(/K\ufffdrfez/g, 'Körfez');
content = content.replace(/\ufffdla\ufffdlama/g, 'İlaçlama');

fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Fixed UI texts');
