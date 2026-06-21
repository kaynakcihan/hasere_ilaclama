const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const path = require('path');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const db = require('./database');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'korfez_ilaclama_jwt_secret_2024';

// Gmail SMTP Transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000
});

// 6 haneli rastgele kod uret
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// E-posta gonder
async function sendVerificationEmail(toEmail, code) {
  const mailOptions = {
    from: '"Körfez İlaçlama" <' + process.env.SMTP_EMAIL + '>',
    to: toEmail,
    subject: 'Doğrulama Kodunuz - Körfez İlaçlama',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#0F172A;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#10B981,#059669);padding:28px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px">Körfez İlaçlama</h1>
          <p style="color:rgba(255,255,255,.8);margin:6px 0 0;font-size:13px">Biyosidal Ürün Uygulama Sistemi</p>
        </div>
        <div style="padding:32px 28px;text-align:center">
          <p style="color:#94A3B8;font-size:14px;margin:0 0 20px">Hesabınızı doğrulamak için aşağıdaki kodu uygulamaya girin:</p>
          <div style="background:#1E293B;border:2px solid #10B981;border-radius:12px;padding:20px;margin:0 auto;display:inline-block">
            <span style="font-size:36px;font-weight:bold;color:#10B981;letter-spacing:8px">${code}</span>
          </div>
          <p style="color:#64748B;font-size:12px;margin:20px 0 0">Bu kod <strong>10 dakika</strong> içinde geçerliliğini yitirecektir.</p>
          <p style="color:#475569;font-size:11px;margin:16px 0 0">Bu e-postayı siz talep etmediyseniz lütfen dikkate almayın.</p>
      </div>
    `
  };
  return transporter.sendMail(mailOptions);
}

const html_to_pdf = require('html-pdf-node');

// PDF uretme fonksiyonu (HTML sablonunu birebir A4 PDF'e cevirir)
function generateEk1PdfBuffer(htmlContent) {
  const options = { 
    format: 'A4', 
    margin: { top: '30px', bottom: '30px', left: '30px', right: '30px' },
    printBackground: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  };
  const file = { content: htmlContent };
  return html_to_pdf.generatePdf(file, options);
}

// EK-1 Belgesini HTML e-posta ve PDF eki olarak gonder
async function sendEk1Email(customer, doc, host = 'localhost:5000') {
  if (!customer.email) return;

  const targetPests = [];
  if (doc.hedef_hasere_yuruyen) targetPests.push('Yürüyen Haşere');
  if (doc.hedef_hasere_ucan) targetPests.push('Uçan Haşere');
  if (doc.hedef_hasere_fare) targetPests.push('Fare');
  if (doc.hedef_hasere_sican) targetPests.push('Sıçan');
  if (doc.hedef_hasere_diger) targetPests.push(`Diğer (${doc.hedef_hasere_diger_detay || ''})`);
  const pestsStr = targetPests.length > 0 ? targetPests.join(', ') : doc.hedef_hasere;

  let appsList = '';
  if (doc.uygulayicilar) {
    if (Array.isArray(doc.uygulayicilar)) {
      appsList = doc.uygulayicilar.join(', ');
    } else if (typeof doc.uygulayicilar === 'string') {
      try {
        const parsed = JSON.parse(doc.uygulayicilar);
        appsList = Array.isArray(parsed) ? parsed.join(', ') : parsed;
      } catch(e) {
        appsList = doc.uygulayicilar;
      }
    }
  }

  // Çoklu ilaç verisini parse edelim
  let docProducts = [];
  if (doc.secili_urunler) {
    if (Array.isArray(doc.secili_urunler)) {
      docProducts = doc.secili_urunler;
    } else {
      try {
        docProducts = JSON.parse(doc.secili_urunler);
      } catch (e) {
        docProducts = [];
      }
    }
  }
  if (docProducts.length === 0) {
    // Geriye dönük uyumluluk
    docProducts = [{
      commercialName: doc.biyosidal_urun || '-',
      licenseDate: doc.ruhsat_tarihi || '-',
      licenseNo: doc.ruhsat_sayisi || '-',
      method: doc.uygulama_sekli || doc.uygulama_yontemi || '-',
      activeIngredient: doc.aktif_madde || '-',
      antidote: doc.antidotu || '-',
      defaultQuantity: doc.urun_miktari || '-'
    }];
  }

  const productRowsHtml = docProducts.map(p => `
    <tr style="text-align: center;">
      <td style="border: 1px solid #cbd5e1; padding: 5px;"><strong>${p.commercialName}</strong></td>
      <td style="border: 1px solid #cbd5e1; padding: 5px;">${p.licenseDate || '-'}</td>
      <td style="border: 1px solid #cbd5e1; padding: 5px;">${p.licenseNo || '-'}</td>
      <td style="border: 1px solid #cbd5e1; padding: 5px;">${p.method || '-'}</td>
      <td style="border: 1px solid #cbd5e1; padding: 5px;">${p.activeIngredient || '-'}</td>
      <td style="border: 1px solid #cbd5e1; padding: 5px;">${p.antidote || 'Semptomatik'}</td>
      <td style="border: 1px solid #cbd5e1; padding: 5px;"><strong>${p.defaultQuantity || p.urun_miktari || '-'}</strong></td>
    </tr>
  `).join('');

  // E-posta attachments listesi (İmzaların mailde kesinlikle görünmesi için cid kullanıyoruz)
  const attachments = [];
  let ekipImzaMailHtml = `<div style="height:60px; line-height:60px; color:#94a3b8; font-style:italic">${doc.teknisyen_adi || 'Sorumlu'}</div>`;
  let musteriImzaMailHtml = `<div style="height:60px; line-height:60px; color:#94a3b8; font-style:italic">İmza Alınamadı</div>`;

  // PDF için imzalar (PDF'te base64 doğrudan görünür)
  let ekipImzaPdfHtml = ekipImzaMailHtml;
  let musteriImzaPdfHtml = musteriImzaMailHtml;

  if (doc.signature_ekip) {
    ekipImzaPdfHtml = `<img src="${doc.signature_ekip}" style="max-height: 60px; display: block; margin: 0 auto;" alt="Teknisyen İmza" />`;
    if (doc.signature_ekip.startsWith('data:image')) {
      const matches = doc.signature_ekip.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        attachments.push({
          filename: 'ekip_signature.png',
          content: Buffer.from(matches[2], 'base64'),
          cid: 'ekip_signature'
        });
        ekipImzaMailHtml = `<img src="cid:ekip_signature" style="max-height: 60px; display: block; margin: 0 auto;" alt="Teknisyen İmza" />`;
      }
    }
  }

  if (doc.signature_image) {
    musteriImzaPdfHtml = `<img src="${doc.signature_image}" style="max-height: 60px; display: block; margin: 0 auto;" alt="Müşteri İmza" />`;
    if (doc.signature_image.startsWith('data:image')) {
      const matches = doc.signature_image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        attachments.push({
          filename: 'customer_signature.png',
          content: Buffer.from(matches[2], 'base64'),
          cid: 'customer_signature'
        });
        musteriImzaMailHtml = `<img src="cid:customer_signature" style="max-height: 60px; display: block; margin: 0 auto;" alt="Müşteri İmza" />`;
      }
    }
  }

  // Resmi A4 Tasarımıyla Eşleşen Ana HTML İçeriği (Tablolar ve Çizgilerle)
  const getBaseHtmlTemplate = (ekipImza, musteriImza) => `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; border: 1px solid #cbd5e1; background: #ffffff; color: #1e293b; line-height: 1.5; border-radius: 8px;">
      <div style="text-align: center; border-bottom: 3px solid #10b981; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #059669; text-transform: uppercase; font-size: 20px; letter-spacing: 0.5px;">Körfez Danışmanlık İlaçlama Hizmetleri</h2>
        <h3 style="margin: 4px 0 0; color: #334155; font-weight: normal; font-size: 14px;">EK-1 BİYOSİDAL ÜRÜN UYGULAMA İŞLEM FORMU</h3>
        <span style="font-weight: bold; color: #ef4444; font-size: 13px; display: block; margin-top: 4px;">Belge No: #EK1-00${doc.id}</span>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
        <tr>
          <th colspan="2" style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 6px; text-align: left; color: #1e293b; font-size: 12px;">1. UYGULAMAYI YAPANA AİT BİLGİLER</th>
        </tr>
        <tr>
          <td style="width: 30%; border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Uygulamayı yapan firma adı</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px;">Körfez Danışmanlık İlaçlama Hizmetleri Ltd. Şti.</td>
        </tr>
        <tr>
          <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Açık adresi</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px;">Hamidiye Mahallesi 15034 Sokak No:4 F Edremit/Balıkesir</td>
        </tr>
        <tr>
          <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Müdürlük izin tarih ve sayısı</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px;">0061 / 21.09.2018</td>
        </tr>
        <tr>
          <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Telefon / Faks numarası</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px;">0266 373 4 333 / 0 505 825 00 11</td>
        </tr>
        <tr>
          <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Mesul Müdür</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px;"><strong>${doc.mesul_mudur || 'Sadun Güneş'}</strong></td>
        </tr>
        <tr>
          <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Ekip Sorumlusu</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px;"><strong>${doc.teknisyen_adi || '-'}</strong></td>
        </tr>
        <tr>
          <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Uygulayıcılar</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px;"><strong>${appsList || doc.teknisyen_adi || '-'}</strong></td>
        </tr>
      </table>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; text-align: left;">
        <thead>
          <tr style="background: #f1f5f9; color: #1e293b;">
            <th colspan="7" style="border: 1px solid #cbd5e1; padding: 6px; font-size: 12px;">2. KULLANILAN BİYOSİDAL ÜRÜNE AİT BİLGİLER</th>
          </tr>
          <tr style="background: #f8fafc; text-align: center;">
            <th style="border: 1px solid #cbd5e1; padding: 5px;">Ürünün Ticari Adı</th>
            <th style="border: 1px solid #cbd5e1; padding: 5px;">Ruhsat Tarihi</th>
            <th style="border: 1px solid #cbd5e1; padding: 5px;">Ruhsat Sayısı</th>
            <th style="border: 1px solid #cbd5e1; padding: 5px;">Uygulama Şekli</th>
            <th style="border: 1px solid #cbd5e1; padding: 5px;">Ürün Aktif Maddesi</th>
            <th style="border: 1px solid #cbd5e1; padding: 5px;">Antidotu</th>
            <th style="border: 1px solid #cbd5e1; padding: 5px;">Miktarı</th>
          </tr>
        </thead>
        <tbody>
          ${productRowsHtml}
        </tbody>
      </table>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
        <tr>
          <th colspan="2" style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 6px; text-align: left; color: #1e293b; font-size: 12px;">3. UYGULAMA YAPILAN YER HAKKINDA BİLGİLER</th>
        </tr>
        <tr>
          <td style="width: 30%; border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Uygulama yapılan yerin adresi</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px;">${customer.unvan} - ${customer.adres}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Hedef zararlı türü</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px;"><strong>${pestsStr}</strong></td>
        </tr>
        <tr>
          <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Uygulama tarih, Başlangıç/Bitiş saati</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px;">Tarih: <strong>${new Date(doc.created_at).toLocaleDateString('tr-TR')}</strong> | Saat: <strong>${doc.saat_baslangic || '12:00'} - ${doc.saat_bitis || '13:00'}</strong></td>
        </tr>
        <tr>
          <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Yerin Türü & Alanı</td>
          <td style="border: 1px solid #cbd5e1; padding: 5px;">Yerin Türü: <strong>${doc.yerin_turu || 'İşyeri'}</strong> ${doc.yerin_turu_daire ? `(${doc.yerin_turu_daire} Daire)` : ''} | Alan: <strong>${doc.uygulama_alani || '-'} M²</strong> ${doc.yem_istasyonu_sayisi ? ` / ${doc.yem_istasyonu_sayisi} Yem İstasyonu` : ''}</td>
        </tr>
      </table>

      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; margin-bottom: 12px; font-size: 11px; background: #f8fafc;">
        <h4 style="margin: 0 0 4px; color: #1e293b; font-size: 11px;">Yapılan Uygulamalar ve Görüşler:</h4>
        <p style="margin: 0; color: #475569; font-style: italic;">${doc.uygulamalar_ve_gorusler || '-'}</p>
      </div>

      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; margin-bottom: 15px; font-size: 11px; background: #f8fafc;">
        <h4 style="margin: 0 0 4px; color: #1e293b; font-size: 11px;">Alınan Güvenlik Önlemleri ve Yapılan Öneriler:</h4>
        <p style="margin: 0; color: #475569;">${doc.oneriler || '-'}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; text-align: center;">
        <tr>
          <td style="width: 48%; border: 1px solid #cbd5e1; padding: 8px; border-radius: 6px;">
            <div style="font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px; color: #1e293b;">Ekip Sorumlusu / İmza</div>
            ${ekipImza}
          </td>
          <td style="width: 4%;"></td>
          <td style="width: 48%; border: 1px solid #cbd5e1; padding: 8px; border-radius: 6px;">
            <div style="font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px; color: #1e293b;">Uygulama Yapılan Yer Yetkilisi / İmza</div>
            ${musteriImza}
          </td>
        </tr>
      </table>

      <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; padding: 8px; font-size: 9px; color: #be123c; text-align: center; line-height: 1.4;">
        <strong>NOT:</strong> ZEHİRLENME DURUMLARINDA GEREKTİĞİNDE ULUSAL ZEHİR DANIŞMA MERKEZİNİN (UZEM) <strong>114</strong> ve ACİL SAĞLIK HİZMETLERİNİN <strong>112</strong> NOLU TELEFONUNU ARAYINIZ.
      </div>
    </div>
  `;

  // Mail Gövdesi (imzalar cid ile referanslı)
  const mailHtmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center; margin-bottom: 20px; background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px dashed #cbd5e1; max-width: 700px; margin-left: auto; margin-right: auto;">
      <p style="margin: 0 0 10px 0; font-size: 13px; color: #475569; font-weight: bold;">Telefon veya bilgisayarınıza doğrudan indirmek / kaydetmek için aşağıdaki butonu kullanabilirsiniz:</p>
      <a href="http://${host}/api/ek1/${doc.id}/pdf" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
        📥 Resmi EK-1 Belgesini PDF Olarak İndir / Kaydet
      </a>
    </div>
    ${getBaseHtmlTemplate(ekipImzaMailHtml, musteriImzaMailHtml)}
  `;

  // PDF Gövdesi (imzalar base64 doğrudan gösterilir)
  const pdfHtmlContent = getBaseHtmlTemplate(ekipImzaPdfHtml, musteriImzaPdfHtml);

  // PDF Olusturma (Vercel gibi ortamlarda Puppeteer cokme yapabilecegi icin simdilik sadece HTML mail gonderilecek)
  // PDF indirebilmeleri icin zaten mail icerisinde 'PDF Indir' butonu var.
  let pdfBuffer = null;
  /*
  try {
    pdfBuffer = await generateEk1PdfBuffer(pdfHtmlContent);
  } catch (pdfErr) {
    console.error('E-posta icin PDF olusturma hatasi:', pdfErr.message);
  }
  */

  const mailOptions = {
    from: '"Körfez İlaçlama" <' + process.env.SMTP_EMAIL + '>',
    to: customer.email,
    subject: `Biyosidal Ürün Uygulama Belgesi - #EK1-${doc.id}`,
    html: mailHtmlContent,
    attachments: [
      ...attachments,
      ...(pdfBuffer ? [{
        filename: `EK1_${doc.id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }] : [])
    ]
  };
  return transporter.sendMail(mailOptions);
}

// JWT Dogrulama
const auth = (req, res, next) => {
  const h = req.headers['authorization'];
  const t = h && h.split(' ')[1];
  if (!t) return res.status(401).json({ error: 'Giris yapiniz.' });
  jwt.verify(t, JWT_SECRET, (e, u) => {
    if (e) return res.status(403).json({ error: 'Oturum suresi doldu.' });
    req.user = u; next();
  });
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ error: 'Yetkiniz yok.' });
};

// ========================================
// AUTH ENDPOINTS
// ========================================

// 1) E-posta kontrol et
app.post('/api/auth/check-email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'E-posta gerekli.' });
  const user = await db.getUserByEmail(email);
  res.json({ exists: !!user, name: user ? user.name : null });
});

// 2) Dogrulama kodu gonder (yeni kayit)
app.post('/api/auth/send-code', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'E-posta gerekli.' });

  const existing = await db.getUserByEmail(email);
  if (existing) return res.status(400).json({ error: 'Bu e-posta zaten kayitli. Giris yapin.' });

  const code = generateCode();
  await db.saveVerificationCode(email, code);

  try {
    await sendVerificationEmail(email, code);
    console.log('Dogrulama kodu gonderildi: ' + email);
    res.json({ success: true, message: 'Dogrulama kodu e-posta adresinize gonderildi.' });
  } catch (err) {
    console.error('E-posta gonderilemedi:', err.message);
    res.status(500).json({ error: 'E-posta gonderilemedi. SMTP ayarlarini kontrol edin. Hata: ' + err.message });
  }
});

// 3) Kodu dogrula
app.post('/api/auth/verify-code', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'E-posta ve kod gerekli.' });
  const valid = await db.verifyCode(email, code);
  if (!valid) return res.status(400).json({ error: 'Kod hatali veya suresi dolmus.' });
  res.json({ success: true, message: 'Kod dogrulandi. Simdi sifre olusturun.' });
});

// 4) Kayit tamamla (kod dogrulandiktan sonra)
app.post('/api/auth/register', async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) return res.status(400).json({ error: 'Tum alanlar zorunlu.' });
  if (password.length < 4) return res.status(400).json({ error: 'Sifre en az 4 karakter olmali.' });

  const existing = await db.getUserByEmail(email);
  if (existing) return res.status(400).json({ error: 'Bu e-posta zaten kayitli.' });

  const user = await db.addUser(email, name, password);
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// 5) Giris yap
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'E-posta ve sifre gerekli.' });
  const user = await db.getUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Kayitli kullanici bulunamadi.' });
  if (user.password !== db.hashPassword(password)) return res.status(401).json({ error: 'Sifre hatali.' });
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// Google Login / Test Girişi Köprüsü
app.post('/api/auth/google-login', async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: 'E-posta gerekli.' });
  
  let user = await db.getUserByEmail(email);
  if (!user) {
    const userCount = await db.getUserCount();
    const role = userCount === 0 || email === 'kaynak.cihan@gmail.com' || email === 'admin@example.com' ? 'admin' : 'technician';
    
    user = await db.addUser(email, name || email.split('@')[0], 'google-dummy-password');
    if (role !== user.role) {
      await db.updateUserRole(user.id, role);
      user.role = role;
    }
  }
  
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// 6) Sifremi unuttum - kod gonder
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'E-posta gerekli.' });
  const user = await db.getUserByEmail(email);
  if (!user) return res.status(404).json({ error: 'Bu e-posta ile kayitli kullanici yok.' });

  const code = generateCode();
  await db.saveVerificationCode(email, code);
  try {
    await sendVerificationEmail(email, code);
    res.json({ success: true, message: 'Sifre sifirlama kodu gonderildi.' });
  } catch (err) {
    res.status(500).json({ error: 'E-posta gonderilemedi.' });
  }
});

// 7) Sifreyi sifirla
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) return res.status(400).json({ error: 'Tum alanlar zorunlu.' });
  if (newPassword.length < 4) return res.status(400).json({ error: 'Sifre en az 4 karakter.' });

  const valid = await db.verifyCode(email, code);
  if (!valid) return res.status(400).json({ error: 'Kod hatali veya suresi dolmus.' });

  const user = await db.getUserByEmail(email);
  if (!user) return res.status(404).json({ error: 'Kullanici bulunamadi.' });

  await db.changePassword(user.id, newPassword);
  res.json({ success: true, message: 'Sifre basariyla degistirildi. Giris yapabilirsiniz.' });
});

// 8) Sifre degistir (giris yapmis kullanici)
app.post('/api/auth/change-password', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return res.status(400).json({ error: 'Eski ve yeni sifre zorunlu.' });
  const user = await db.getUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'Kullanici yok.' });
  if (user.password !== db.hashPassword(oldPassword)) return res.status(401).json({ error: 'Eski sifre hatali.' });
  await db.changePassword(req.user.id, newPassword);
  res.json({ success: true });
});

// ========================================
// MUSTERI ENDPOINTS
// ========================================
app.get('/api/customers', auth, async (req, res) => {
  try { res.json(await db.getAllCustomers(req.query.search)); }
  catch (e) { res.status(500).json({ error: 'Musteriler getirilemedi.' }); }
});

app.post('/api/customers', auth, adminOnly, async (req, res) => {
  const { unvan, vergi_no, telefon, adres, uygulama_tipi, email, konum } = req.body;
  if (!unvan) return res.status(400).json({ error: 'Lütfen müşteri / işletme adını giriniz.' });
  if (!konum) return res.status(400).json({ error: 'Lütfen il/ilçe (konum) bilgisini giriniz.' });
  if (!telefon || telefon.length !== 11 || !/^\d+$/.test(telefon)) return res.status(400).json({ error: 'Lütfen 11 haneli telefon numarasını eksiksiz ve sadece rakam olarak giriniz. (Örn: 05551234567)' });
  if (!adres) return res.status(400).json({ error: 'Lütfen açık adres bilgisini giriniz.' });
  if (!uygulama_tipi) return res.status(400).json({ error: 'Lütfen uygulama tipi seçiniz.' });
  
  // Mükerrer Kayıt Kontrolü
  const allCustomers = await db.getAllCustomers();
  const existing = allCustomers.find(c => c.unvan.toLowerCase().trim() === unvan.toLowerCase().trim());
  if (existing) {
    if (existing.telefon === telefon) {
      return res.status(400).json({ error: 'Bu işletme ve telefon numarası zaten sistemde kayıtlı!' });
    } else {
      return res.status(400).json({ error: 'Bu isimde bir işletme zaten kayıtlı! Eğer bu farklı bir şubeyse, lütfen isim sonuna şube veya yetkili adını ekleyin (Örn: Ömür Karabacak - Merkez).' });
    }
  }

  try { res.status(201).json(await db.addCustomer(unvan, vergi_no, telefon, adres, uygulama_tipi, email, konum)); }
  catch (e) { res.status(500).json({ error: 'Musteri eklenemedi.' }); }
});

app.put('/api/customers/:id', auth, adminOnly, async (req, res) => {
  const { unvan, vergi_no, telefon, adres, uygulama_tipi, email, konum } = req.body;
  if (!unvan || !telefon || !adres || !uygulama_tipi || !konum) return res.status(400).json({ error: 'Zorunlu alanlar eksik.' });
  try {
    const c = await db.getCustomerById(req.params.id);
    if (!c) return res.status(404).json({ error: 'Musteri bulunamadi.' });
    res.json(await db.updateCustomer(req.params.id, unvan, vergi_no, telefon, adres, uygulama_tipi, email, konum));
  } catch (e) { res.status(500).json({ error: 'Guncellenemedi.' }); }
});

app.delete('/api/customers/:id', auth, adminOnly, async (req, res) => {
  try {
    const c = await db.getCustomerById(req.params.id);
    if (!c) return res.status(404).json({ error: 'Musteri bulunamadi.' });
    await db.deleteCustomer(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: 'Silinemedi.' }); }
});

// ========================================
// RANDEVU (APPOINTMENT) ENDPOINTS
// ========================================

// 1) Randevuları getir (Tarih bazlı veya Müşteri bazlı)
app.get('/api/appointments', auth, async (req, res) => {
  const { date, customerId } = req.query;
  try {
    if (date) {
      const list = await db.getAppointmentsByDate(date);
      return res.json(list);
    }
    if (customerId) {
      const list = await db.getAppointmentsByCustomer(customerId);
      return res.json(list);
    }
    const all = await db.getAllAppointments();
    res.json(all);
  } catch (e) {
    res.status(500).json({ error: 'Randevular getirilemedi.' });
  }
});

const proximityMap = {
  "altınoluk": ["Altınoluk", "Güre", "Akçay"],
  "güre": ["Güre", "Altınoluk", "Akçay"],
  "akçay": ["Akçay", "Güre", "Zeytinli", "Edremit"],
  "zeytinli": ["Zeytinli", "Akçay", "Edremit"],
  "edremit": ["Edremit", "Akçay", "Zeytinli", "Kadıköy", "Burhaniye"],
  "kadıköy": ["Kadıköy", "Edremit"],
  "burhaniye": ["Burhaniye", "Edremit", "Gömeç"],
  "gömeç": ["Gömeç", "Burhaniye", "Ayvalık"],
  "ayvalık": ["Ayvalık", "Gömeç"]
};

// 1.5) Akıllı Randevu Önerme
app.get('/api/appointments/suggest-date', auth, async (req, res) => {
  const { ilce } = req.query;
  console.log('[API] suggest-date CALLED with ilce:', ilce);
  if (!ilce) return res.json({ suggestion: null });
  
  const ilceLower = ilce.toLowerCase();
  const regions = proximityMap[ilceLower] || [ilce];
  try {
    const list = await db.getAppointmentsByRegions(regions);
    if (list.length === 0) return res.json({ suggestion: null });

    // Tarihe göre grupla ve say
    const counts = {};
    for (const a of list) {
      counts[a.date] = (counts[a.date] || 0) + 1;
    }
    
    // En yoğun günü bul
    let maxDate = null;
    let maxCount = 0;
    for (const date in counts) {
      if (counts[date] > maxCount) {
        maxCount = counts[date];
        maxDate = date;
      }
    }
    
    if (maxDate) {
      console.log('[API] Returning maxDate:', maxDate, 'count:', maxCount);
      res.json({ suggestion: maxDate, count: maxCount, regions });
    } else {
      console.log('[API] Returning maxDate: null');
      res.json({ suggestion: null });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Öneri alınırken hata oluştu' });
  }
});

// 2) Yeni Randevu Ekle
app.post('/api/appointments', auth, async (req, res) => {
  const { customerId, date, time, notes } = req.body;
  if (!customerId || !date) {
    return res.status(400).json({ error: 'Musteri ve tarih zorunludur.' });
  }
  try {
    const a = await db.addAppointment(customerId, date, time, notes);
    res.status(201).json(a);
  } catch (e) {
    res.status(500).json({ error: 'Randevu olusturulamadi.' });
  }
});

// 3) Randevu Güncelle (Durum vs.)
app.put('/api/appointments/:id', auth, async (req, res) => {
  const { status, ek1Id } = req.body;
  try {
    const ok = await db.updateAppointmentStatus(req.params.id, status, ek1Id);
    if (!ok) return res.status(404).json({ error: 'Randevu bulunamadi.' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Guncellenemedi.' });
  }
});

// 4) Randevu Ertele (Yeni Tarih ve Neden ile)
app.post('/api/appointments/:id/reschedule', auth, async (req, res) => {
  const { newDate, newTime, reason } = req.body;
  if (!newDate) return res.status(400).json({ error: 'Yeni tarih gerekli.' });
  try {
    const updated = await db.rescheduleAppointment(req.params.id, newDate, newTime, reason);
    if (!updated) return res.status(404).json({ error: 'Randevu bulunamadi.' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Randevu ertelenemedi.' });
  }
});

// 5) Randevu Sil
app.delete('/api/appointments/:id', auth, async (req, res) => {
  try {
    const ok = await db.deleteAppointment(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Randevu bulunamadi.' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Silinemedi.' });
  }
});

// ========================================
// EK-1 EVRAK ENDPOINTS
// ========================================

// 1) EK-1 Belgesi Oluştur ve Gönder (Randevuyu tamamlar)
app.post('/api/ek1', auth, async (req, res) => {
  const { appointmentId, customerId, documentData } = req.body;
  if (!customerId || !documentData) {
    return res.status(400).json({ error: 'Musteri ve belge verileri eksik.' });
  }
  try {
    const doc = await db.addEk1Document(appointmentId, customerId, documentData);
    
    // Müşteriye otomatik e-posta gönderimini tetikle
    const customer = await db.getCustomerById(customerId);
    if (customer) {
      const emailToUse = documentData.customer_email || customer.email;
      if (documentData.customer_email && documentData.customer_email !== customer.email) {
        // Müşteri e-postasını veritabanında da güncelle
        await db.updateCustomerEmail(customerId, documentData.customer_email);
        customer.email = documentData.customer_email;
      }
      if (customer.email) {
        try {
          await sendEk1Email(customer, doc, req.headers.host);
          console.log(`EK-1 e-postası başarıyla gönderildi: ${customer.email}`);
        } catch (mailErr) {
          console.error('EK-1 e-postası gönderilemedi:', mailErr.message);
        }
      }
    }

    res.status(201).json(doc);
  } catch (e) {
    console.error('EK-1 olusturma hatasi:', e);
    res.status(500).json({ error: 'EK-1 belgesi olusturulamadi.' });
  }
});

// PDF Olarak İndirme Endpoint'i (Mail şablonuyla birebir aynı tasarıma sahip A4 PDF üretir)
app.get('/api/ek1/:id/pdf', async (req, res) => {
  try {
    const doc = await db.getEk1DocumentById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Belge bulunamadı.' });
    const customer = await db.getCustomerById(doc.customer_id);
    if (!customer) return res.status(404).json({ error: 'Müşteri bulunamadı.' });
    
    const targetPests = [];
    if (doc.hedef_hasere_yuruyen) targetPests.push('Yürüyen Haşere');
    if (doc.hedef_hasere_ucan) targetPests.push('Uçan Haşere');
    if (doc.hedef_hasere_fare) targetPests.push('Fare');
    if (doc.hedef_hasere_sican) targetPests.push('Sıçan');
    if (doc.hedef_hasere_diger) targetPests.push(`Diğer (${doc.hedef_hasere_diger_detay || ''})`);
    const pestsStr = targetPests.length > 0 ? targetPests.join(', ') : doc.hedef_hasere;

    let appsList = '';
    if (doc.uygulayicilar) {
      if (Array.isArray(doc.uygulayicilar)) {
        appsList = doc.uygulayicilar.join(', ');
      } else if (typeof doc.uygulayicilar === 'string') {
        try {
          const parsed = JSON.parse(doc.uygulayicilar);
          appsList = Array.isArray(parsed) ? parsed.join(', ') : parsed;
        } catch(e) {
          appsList = doc.uygulayicilar;
        }
      }
    }

    let ekipImzaPdfHtml = `<div style="height:60px; line-height:60px; color:#94a3b8; font-style:italic">${doc.teknisyen_adi || 'Sorumlu'}</div>`;
    let musteriImzaPdfHtml = `<div style="height:60px; line-height:60px; color:#94a3b8; font-style:italic">İmza Alınamadı</div>`;

    if (doc.signature_ekip) {
      ekipImzaPdfHtml = `<img src="${doc.signature_ekip}" style="max-height: 60px; display: block; margin: 0 auto;" alt="Teknisyen İmza" />`;
    }
    if (doc.signature_image) {
      musteriImzaPdfHtml = `<img src="${doc.signature_image}" style="max-height: 60px; display: block; margin: 0 auto;" alt="Müşteri İmza" />`;
    }

    // Çoklu ilaç verisini parse edelim
    let docProducts = [];
    if (doc.secili_urunler) {
      if (Array.isArray(doc.secili_urunler)) {
        docProducts = doc.secili_urunler;
      } else {
        try {
          docProducts = JSON.parse(doc.secili_urunler);
        } catch (e) {
          docProducts = [];
        }
      }
    }
    if (docProducts.length === 0) {
      // Geriye dönük uyumluluk
      docProducts = [{
        commercialName: doc.biyosidal_urun || '-',
        licenseDate: doc.ruhsat_tarihi || '-',
        licenseNo: doc.ruhsat_sayisi || '-',
        method: doc.uygulama_sekli || doc.uygulama_yontemi || '-',
        activeIngredient: doc.aktif_madde || '-',
        antidote: doc.antidotu || '-',
        defaultQuantity: doc.urun_miktari || '-'
      }];
    }

    const productRowsHtml = docProducts.map(p => `
      <tr style="text-align: center;">
        <td style="border: 1px solid #cbd5e1; padding: 5px;"><strong>${p.commercialName}</strong></td>
        <td style="border: 1px solid #cbd5e1; padding: 5px;">${p.licenseDate || '-'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 5px;">${p.licenseNo || '-'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 5px;">${p.method || '-'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 5px;">${p.activeIngredient || '-'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 5px;">${p.antidote || 'Semptomatik'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 5px;"><strong>${p.defaultQuantity || p.urun_miktari || '-'}</strong></td>
      </tr>
    `).join('');

    const pdfHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; border: 1px solid #cbd5e1; background: #ffffff; color: #1e293b; line-height: 1.5; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 3px solid #10b981; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #059669; text-transform: uppercase; font-size: 20px; letter-spacing: 0.5px;">Körfez Danışmanlık İlaçlama Hizmetleri</h2>
          <h3 style="margin: 4px 0 0; color: #334155; font-weight: normal; font-size: 14px;">EK-1 BİYOSİDAL ÜRÜN UYGULAMA İŞLEM FORMU</h3>
          <span style="font-weight: bold; color: #ef4444; font-size: 13px; display: block; margin-top: 4px;">Belge No: #EK1-00${doc.id}</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
          <tr>
            <th colspan="2" style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 6px; text-align: left; color: #1e293b; font-size: 12px;">1. UYGULAMAYI YAPANA AİT BİLGİLER</th>
          </tr>
          <tr>
            <td style="width: 30%; border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Uygulamayı yapan firma adı</td>
            <td style="border: 1px solid #cbd5e1; padding: 5px;">Körfez Danışmanlık İlaçlama Hizmetleri Ltd. Şti.</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Açık adresi</td>
            <td style="border: 1px solid #cbd5e1; padding: 5px;">Hamidiye Mahallesi 15034 Sokak No:4 F Edremit/Balıkesir</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Müdürlük izin tarih ve sayısı</td>
            <td style="border: 1px solid #cbd5e1; padding: 5px;">0061 / 21.09.2018</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Telefon / Faks numarası</td>
            <td style="border: 1px solid #cbd5e1; padding: 5px;">0266 373 4 333 / 0 505 825 00 11</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Mesul Müdür</td>
            <td style="border: 1px solid #cbd5e1; padding: 5px;"><strong>${doc.mesul_mudur || 'Sadun Güneş'}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Ekip Sorumlusu</td>
            <td style="border: 1px solid #cbd5e1; padding: 5px;"><strong>${doc.teknisyen_adi || '-'}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Uygulayıcılar</td>
            <td style="border: 1px solid #cbd5e1; padding: 5px;"><strong>${appsList || doc.teknisyen_adi || '-'}</strong></td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; text-align: left;">
          <thead>
            <tr style="background: #f1f5f9; color: #1e293b;">
              <th colspan="7" style="border: 1px solid #cbd5e1; padding: 6px; font-size: 12px;">2. KULLANILAN BİYOSİDAL ÜRÜNE AİT BİLGİLER</th>
            </tr>
            <tr style="background: #f8fafc; text-align: center;">
              <th style="border: 1px solid #cbd5e1; padding: 5px;">Ürünün Ticari Adı</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px;">Ruhsat Tarihi</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px;">Ruhsat Sayısı</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px;">Uygulama Şekli</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px;">Ürün Aktif Maddesi</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px;">Antidotu</th>
              <th style="border: 1px solid #cbd5e1; padding: 5px;">Miktarı</th>
            </tr>
          </thead>
          <tbody>
            ${productRowsHtml}
          </tbody>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
          <tr>
            <th colspan="2" style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 6px; text-align: left; color: #1e293b; font-size: 12px;">3. UYGULAMA YAPILAN YER HAKKINDA BİLGİLER</th>
          </tr>
          <tr>
            <td style="width: 30%; border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Uygulama yapılan yerin adresi</td>
            <td style="border: 1px solid #cbd5e1; padding: 5px;">${customer.unvan} - ${customer.adres}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Hedef zararlı türü</td>
            <td style="border: 1px solid #cbd5e1; padding: 5px;"><strong>${pestsStr}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Uygulama tarih, Başlangıç/Bitiş saati</td>
            <td style="border: 1px solid #cbd5e1; padding: 5px;">Tarih: <strong>${new Date(doc.created_at).toLocaleDateString('tr-TR')}</strong> | Saat: <strong>${doc.saat_baslangic || '12:00'} - ${doc.saat_bitis || '13:00'}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 5px; font-weight: bold; background: #f8fafc;">Yerin Türü & Alanı</td>
            <td style="border: 1px solid #cbd5e1; padding: 5px;">Yerin Türü: <strong>${doc.yerin_turu || 'İşyeri'}</strong> ${doc.yerin_turu_daire ? `(${doc.yerin_turu_daire} Daire)` : ''} | Alan: <strong>${doc.uygulama_alani || '-'} M²</strong> ${doc.yem_istasyonu_sayisi ? ` / ${doc.yem_istasyonu_sayisi} Yem İstasyonu` : ''}</td>
          </tr>
        </table>

        <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; margin-bottom: 12px; font-size: 11px; background: #f8fafc;">
          <h4 style="margin: 0 0 4px; color: #1e293b; font-size: 11px;">Yapılan Uygulamalar ve Görüşler:</h4>
          <p style="margin: 0; color: #475569; font-style: italic;">${doc.uygulamalar_ve_gorusler || '-'}</p>
        </div>

        <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; margin-bottom: 15px; font-size: 11px; background: #f8fafc;">
          <h4 style="margin: 0 0 4px; color: #1e293b; font-size: 11px;">Alınan Güvenlik Önlemleri ve Yapılan Öneriler:</h4>
          <p style="margin: 0; color: #475569;">${doc.oneriler || '-'}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; text-align: center;">
          <tr>
            <td style="width: 48%; border: 1px solid #cbd5e1; padding: 8px; border-radius: 6px;">
              <div style="font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px; color: #1e293b;">Ekip Sorumlusu / İmza</div>
              ${ekipImzaPdfHtml}
            </td>
            <td style="width: 4%;"></td>
            <td style="width: 48%; border: 1px solid #cbd5e1; padding: 8px; border-radius: 6px;">
              <div style="font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px; color: #1e293b;">Uygulama Yapılan Yer Yetkilisi / İmza</div>
              ${musteriImzaPdfHtml}
            </td>
          </tr>
        </table>

        <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; padding: 8px; font-size: 9px; color: #be123c; text-align: center; line-height: 1.4;">
          <strong>NOT:</strong> ZEHİRLENME DURUMLARINDA GEREKTİĞİNDE ULUSAL ZEHİR DANIŞMA MERKEZİNİN (UZEM) <strong>114</strong> ve ACİL SAĞLIK HİZMETLERİNİN <strong>112</strong> NOLU TELEFONUNU ARAYINIZ.
        </div>
      </div>
    `;

    const pdfBuffer = await generateEk1PdfBuffer(pdfHtmlContent);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=EK1_${doc.id}.pdf`);
    res.send(pdfBuffer);
  } catch (e) {
    console.error('PDF indirme hatasi:', e);
    res.status(500).json({ error: 'PDF olusturulamadi.' });
  }
});

// 2) Müşteriye Ait EK-1 Belgelerini Getir
app.get('/api/ek1/customer/:customerId', auth, async (req, res) => {
  try {
    const docs = await db.getEk1DocumentsByCustomer(req.params.customerId);
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: 'EK-1 belgeleri getirilemedi.' });
  }
});

// 3) İlaç Kütüphanesini Getir
app.get('/api/ek1/products', auth, async (req, res) => {
  try {
    const list = await db.getAllEk1Products();
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'İlaç listesi getirilemedi.' });
  }
});

// 4) Kütüphaneye Yeni İlaç Ekle
app.post('/api/ek1/products', auth, adminOnly, async (req, res) => {
  try {
    const { commercialName, licenseDate, licenseNo, method, activeIngredient, antidote, defaultQuantity } = req.body;
    if (!commercialName) {
      return res.status(400).json({ error: 'İlaç ticari adı zorunludur.' });
    }
    const newProduct = await db.addEk1Product({
      commercialName,
      licenseDate,
      licenseNo,
      method,
      activeIngredient,
      antidote,
      defaultQuantity
    });
    res.status(201).json(newProduct);
  } catch (e) {
    res.status(500).json({ error: 'İlaç eklenemedi.' });
  }
});

app.delete('/api/ek1/products/:id', auth, adminOnly, async (req, res) => {
  try {
    const success = await db.deleteEk1Product(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'İlaç bulunamadı.' });
    }
    res.json({ message: 'İlaç başarıyla silindi.' });
  } catch (e) {
    res.status(500).json({ error: 'İlaç silinemedi.' });
  }
});

// 5) Aylık Raporlama Verilerini Getir
app.get('/api/ek1/reports/monthly', auth, async (req, res) => {
  try {
    const report = await db.getMonthlyWorkDoneReport();
    res.json(report);
  } catch (e) {
    res.status(500).json({ error: 'Rapor verileri getirilemedi.' });
  }
});

// === FINANS VE GIDER YONETIMI ===
app.get('/api/expenses', auth, adminOnly, async (req, res) => {
  try {
    const { month } = req.query;
    const list = await db.getAllExpenses(month);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Giderler getirilemedi.' });
  }
});

app.post('/api/expenses', auth, adminOnly, async (req, res) => {
  try {
    const { date, category, explanation, amount } = req.body;
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Tutar alanı geçerli bir sayı olmalıdır.' });
    }
    const expense = await db.addExpense({ date, category, explanation, amount });
    res.status(201).json(expense);
  } catch (e) {
    res.status(500).json({ error: 'Gider eklenemedi.' });
  }
});

app.delete('/api/expenses/:id', auth, adminOnly, async (req, res) => {
  try {
    const deleted = await db.deleteExpense(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Gider kaydı bulunamadı.' });
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Gider silinemedi.' });
  }
});

// Kullanicilar (admin)
app.get('/api/users', auth, adminOnly, async (req, res) => {
  try { res.json(await db.getAllUsers()); }
  catch (e) { res.status(500).json({ error: 'Kullanicilar getirilemedi.' }); }
});

app.put('/api/users/:id/role', auth, adminOnly, async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'technician'].includes(role)) return res.status(400).json({ error: 'Gecersiz rol.' });
  await db.updateUserRole(req.params.id, role);
  res.json({ success: true });
});

// === BİLDİRİMLER VE KULLANICI AYARLARI API'LERİ ===

// 1) Bildirimleri Getir
app.get('/api/notifications', auth, async (req, res) => {
  try {
    const list = await db.getUserNotifications(req.user.id);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Bildirimler alınamadı.' });
  }
});

// 2) Tek Bildirimi Okundu İşaretle
app.post('/api/notifications/:id/read', auth, async (req, res) => {
  try {
    const ok = await db.markNotificationAsRead(req.params.id, req.user.id);
    res.json({ success: ok });
  } catch (e) {
    res.status(500).json({ error: 'İşlem başarısız.' });
  }
});

// 3) Tüm Bildirimleri Okundu İşaretle
app.post('/api/notifications/read-all', auth, async (req, res) => {
  try {
    const ok = await db.markAllNotificationsAsRead(req.user.id);
    res.json({ success: ok });
  } catch (e) {
    res.status(500).json({ error: 'İşlem başarısız.' });
  }
});

// 4) Kullanıcı Bildirim Tercihlerini Güncelle
app.delete('/api/notifications/clear', auth, async (req, res) => {
  try {
    const ok = await db.clearUserNotifications(req.user.id);
    res.json({ success: ok });
  } catch (e) {
    res.status(500).json({ error: 'İşlem başarısız.' });
  }
});

// 5) Kullanıcı Bildirim Tercihlerini Güncelle
app.put('/api/users/preferences', auth, async (req, res) => {
  try {
    const updated = await db.updateUserPreferences(req.user.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    res.json({ success: true, preferences: updated.preferences });
  } catch (e) {
    res.status(500).json({ error: 'Ayarlar güncellenemedi.' });
  }
});

// === PEST KONTROL (KROKİ, İSTASYON, BARKOD ZİYARET) API'LERİ ===

// 1) Krokileri Getir
app.get('/api/pest/floor-plans', auth, async (req, res) => {
  try {
    const { customerId } = req.query;
    if (!customerId) return res.status(400).json({ error: 'Müşteri kimliği gerekli.' });
    const list = await db.getFloorPlansByCustomer(customerId);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Krokiler getirilemedi.' });
  }
});

// 2) Kroki Ekle (Base64 resim desteğiyle)
app.post('/api/pest/floor-plans', auth, adminOnly, async (req, res) => {
  try {
    const { customerId, title, imageUrl } = req.body;
    if (!customerId || !title || !imageUrl) {
      return res.status(400).json({ error: 'Müşteri, başlık ve kroki görseli gereklidir.' });
    }
    const f = await db.addFloorPlan(customerId, title, imageUrl);
    res.status(201).json(f);
  } catch (e) {
    res.status(500).json({ error: 'Kroki eklenemedi.' });
  }
});

// 3) Kroki Sil
app.delete('/api/pest/floor-plans/:id', auth, adminOnly, async (req, res) => {
  try {
    await db.deleteFloorPlan(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Kroki silinemedi.' });
  }
});

// 4) İstasyonları Getir
app.get('/api/pest/stations', auth, async (req, res) => {
  try {
    const { customerId } = req.query;
    if (!customerId) return res.status(400).json({ error: 'Müşteri kimliği gerekli.' });
    const list = await db.getStationsByCustomer(customerId);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'İstasyonlar getirilemedi.' });
  }
});

// 5) Barkod ile İstasyon Sorgula (Tarama sonrası bulmak için)
app.get('/api/pest/stations/scan', auth, async (req, res) => {
  try {
    const { barcodeNumber, customerId } = req.query;
    if (!barcodeNumber || !customerId) {
      return res.status(400).json({ error: 'Barkod numarası ve müşteri kimliği gereklidir.' });
    }
    const list = await db.getStationsByCustomer(customerId);
    const station = list.find(s => s.barcode_number.trim() === barcodeNumber.trim());
    if (!station) return res.status(404).json({ error: 'İstasyon bulunamadı.' });
    res.json(station);
  } catch (e) {
    res.status(500).json({ error: 'Tarama gerçekleştirilemedi.' });
  }
});

// 6) İstasyon Ekle
app.post('/api/pest/stations', auth, adminOnly, async (req, res) => {
  try {
    const { customerId, stationCode, stationType, barcodeNumber, floorPlanId, positionX, positionY } = req.body;
    if (!customerId || !stationCode || !stationType || !barcodeNumber) {
      return res.status(400).json({ error: 'Eksik istasyon alanları.' });
    }
    const s = await db.addStation(customerId, stationCode, stationType, barcodeNumber, floorPlanId, positionX, positionY);
    res.status(201).json(s);
  } catch (e) {
    res.status(500).json({ error: 'İstasyon eklenemedi.' });
  }
});

// 7) İstasyon Koordinatını Güncelle (Sürükle-bırak için)
app.put('/api/pest/stations/:id/position', auth, async (req, res) => {
  try {
    const { positionX, positionY } = req.body;
    const updated = await db.updateStationPosition(req.params.id, positionX, positionY);
    if (!updated) return res.status(404).json({ error: 'İstasyon bulunamadı.' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'İstasyon konumu güncellenemedi.' });
  }
});

// 8) İstasyon Detayını Güncelle
app.put('/api/pest/stations/:id', auth, adminOnly, async (req, res) => {
  try {
    const { stationCode, stationType, barcodeNumber, status } = req.body;
    const updated = await db.updateStation(req.params.id, stationCode, stationType, barcodeNumber, status);
    if (!updated) return res.status(404).json({ error: 'İstasyon bulunamadı.' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'İstasyon güncellenemedi.' });
  }
});

// 9) İstasyon Sil
app.delete('/api/pest/stations/:id', auth, adminOnly, async (req, res) => {
  try {
    await db.deleteStation(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'İstasyon silinemedi.' });
  }
});

// 10) Müşteriye Ait İstasyon Ziyaretlerini Getir (Rapor & Grafik için)
app.get('/api/pest/visits', auth, async (req, res) => {
  try {
    const { customerId } = req.query;
    if (!customerId) return res.status(400).json({ error: 'Müşteri kimliği gerekli.' });
    const list = await db.getVisitsByCustomer(customerId);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Ziyaretler getirilemedi.' });
  }
});

// 11) İstasyon Bazlı Geçmiş Ziyaretleri Getir
app.get('/api/pest/visits/station/:stationId', auth, async (req, res) => {
  try {
    const list = await db.getVisitsByStation(req.params.stationId);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'İstasyon geçmişi getirilemedi.' });
  }
});

// 12) Kontrol/Ziyaret Sonucu Ekle (QR Tarandıktan sonra doldurulur)
app.post('/api/pest/visits', auth, async (req, res) => {
  try {
    const { stationId, pestActivity, baitConsumption, actionTaken, photoUrl } = req.body;
    if (!stationId || !pestActivity || baitConsumption === undefined) {
      return res.status(400).json({ error: 'Eksik ziyaret detayları.' });
    }
    const technicianId = req.user.id;
    const v = await db.addPestVisit(stationId, technicianId, pestActivity, baitConsumption, actionTaken, photoUrl);
    res.status(201).json(v);
  } catch (e) {
    res.status(500).json({ error: 'Ziyaret kaydı eklenemedi.' });
  }
});

// Catch-all
app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });

app.listen(PORT, '0.0.0.0', () => {
  console.log('Sunucu http://localhost:' + PORT + ' adresinde calisiyor.');
});
