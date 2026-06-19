const fs = require('fs');

let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

const replacements = {
  'Krfez': 'Körfez',
  'lalama': 'İlaçlama',
  'M\\?xteri': 'Müşteri',
  'm\\?xteri': 'müşteri',
  'Y\\? NETC': 'YÖNETİCİ',
  '\\? mr': 'Ömür',
  '\\?Sst': 'Üst',
  '\\?SST': 'ÜST',
  '\\?Srn': 'Ürün',
  '\\? rn:': 'Örn:',
  'giri\\?x': 'giriş',
  'Giri\\?x': 'Giriş',
  'GR': 'GİRİŞ',
  'ablon': 'Şablon',
  '\\?xablon': 'şablon',
  'zel': 'özel',
  '\\?xifre': 'şifre',
  'ba\\?xaryla': 'başarıyla',
  'Tic. A..': 'Tic. A.Ş.',
  'Ltd. ti.': 'Ltd. Şti.',
  'nvan': 'Ünvanı',
  'Gvenlik': 'Güvenlik',
  'neriler': 'öneriler',
  '\\?k\\?x': 'Çıkış',
  'Ltfen': 'Lütfen',
  'sein': 'seçin',
  'Seili': 'Seçili',
  'dnemde': 'dönemde',
  'kprs': 'köprüsü',
  'yaplamad': 'yapılamadı',
  'yapld': 'yapıldı',
  'hzl': 'hızlı',
  'do\\?xrulama': 'doğrulama',
  'Aklamal': 'Açıklamalı',
  'Dixer': 'Diğer',
  'Dier': 'Diğer',
  'ba\\?xlanrken': 'bağlanırken',
  'ya\\?xamam': 'yaşamam',
  'iin': 'için',
  'Gnlk': 'Günlük',
  '\\?x Listesi': 'İş Listesi',
  'zellikler': 'özellikler',
  'grafi\\?xi': 'grafiği',
  '\\?xu an': 'şu an',
  'olu\\?xturul': 'oluşturul',
  'girilmedi\\?xinden': 'girilmediğinden',
  '\\?kmak': 'Çıkmak',
  '\\?zere': 'üzere',
  '\\?cret': 'ücret',
  '\\?nemli': 'önemli',
  'demeler': 'Ödemeler',
  '?x': 'İş',
  '\\?x': 'ş',
  '\\?X': 'Ş',
  '': 'ı', // Generic replacement for  after specific ones are done? No,  maps to ı, ç, ö, ü, İ. Very dangerous to do a generic replacement.
};

// First pass: replace known whole words or specific sequences
for (const [key, value] of Object.entries(replacements)) {
  if(key === '' || key === '\\?x' || key === '\\?X') continue;
  content = content.replace(new RegExp(key, 'g'), value);
}

// Second pass for remaining generic ones
content = content.replace(/\?x/g, 'ş');
content = content.replace(/\?X/g, 'Ş');

fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Fixed words.');
