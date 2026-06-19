const fs = require('fs');
let content = fs.readFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', 'utf8');

const replacements = {
  "aşda başlanırken": "ağa bağlanırken",
  "bağda başlanırken": "ağa bağlanırken",
  "başlanırken": "bağlanırken",
  "Başımlılık": "Bağımlılık",
  "istedişinize": "istediğinize",
  "grafişini": "grafiğini",
  "Hamamböceşi": "Hamamböceği",
  "Hamam Böceşi": "Hamam Böceği",
  "Yoşunluşu": "Yoğunluğu",
  "Başlışı": "Başlığı",
  "yüklenmişş": "yüklenmiş",
  "güvenlişi": "güvenliği",
  "yoşunluk": "yoğunluk",
  "istatistişi": "istatistiği",
  "girilmedişinden": "girilmediğinden",
  "grafişi": "grafiği",
  "Deşer": "Değer",
  "Yaşmur": "Yağmur",
  "Böceşi": "Böceği",
  "yüklendişinde": "yüklendiğinde",
  "deşiştişinde": "değiştiğinde",
  "yapıldışında": "yapıldığında",
  "gelindişinde": "gelindiğinde",
  "edilmişş": "edilmiş",
  "gerçekleştirilmişştir": "gerçekleştirilmiştir",
  "Doşrudan": "Doğrudan",
  "Soşuk": "Soğuk",
  "böceşi": "böceği",
  "Mantışı": "Mantığı",
  "Eşer": "Eğer",
  "eşer": "eğer",
  "Seçeneşi": "Seçeneği",
  "Saş ": "Sağ ",
  "kaydedilmemişş": "kaydedilmemiş",
  "daşılımını": "dağılımını",
  "dişer": "diğer",
  "Dişer": "Diğer",
  "olduşu": "olduğu",
  "Daşılımı": "Dağılımı",
  "seçtişiniz": "seçtiğiniz",
  "Yetersizlişi": "Yetersizliği",
  "Tamamlandışında": "Tamamlandığında",
  "Bitişş": "Bitiş",
  "Deşiştir": "Değiştir",
  "kaydettişinizde": "kaydettiğinizde",
  "parmaxşıyla": "parmağıyla",
  "saşlayın": "sağlayın",
  "gönderilmişştir": "gönderilmiştir",
  "Kaşıt": "Kağıt",
  "ÖMüşteri": "Müşteri", // Removing the stray Ö
  "şaÖKırmızı": "🔴 Kırmızı", // This was probably a red dot emoji followed by Kırmızı
  "ş  Finans ve Gider": "💰 Finans ve Gider",
  "  ş </h1>": " 💰</h1>",
};

for (const [bad, good] of Object.entries(replacements)) {
  content = content.replace(new RegExp(bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), good);
}

fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App.jsx', content, 'utf8');
console.log('Fixed words with ş instead of ğ');
