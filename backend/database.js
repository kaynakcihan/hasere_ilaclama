const mongoose = require('mongoose');
const crypto = require('crypto');

const URI = 'mongodb+srv://kaynakcihan_db_user:otmnZkoPPHoZY3YG@cluster0.igiilln.mongodb.net/?appName=Cluster0';

const GlobalDataSchema = new mongoose.Schema({
  doc_id: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
});

const GlobalData = mongoose.models.GlobalData || mongoose.model('GlobalData', GlobalDataSchema);

mongoose.connect(URI)
  .then(() => console.log('MongoDB Baglantisi Basarili!'))
  .catch(err => console.error('MongoDB Baglanti Hatasi:', err));

function hashPassword(pw) {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

const defaultData = {
  users: [],
  verification_codes: [],
  customers: [],
  ek1_documents: [],
  ek1_products: [],
  appointments: [],
  pests: [
    { id: 1, name: 'Karınca', type: 'Yürüyen Haşere' },
    { id: 2, name: 'Karafatma', type: 'Yürüyen Haşere' },
    { id: 3, name: 'Hamam Böceği', type: 'Yürüyen Haşere' },
    { id: 4, name: 'Fare', type: 'Kemirgen' },
    { id: 5, name: 'Pire', type: 'Yürüyen Haşere' },
    { id: 6, name: 'Tahta Kurusu', type: 'Yürüyen Haşere' },
    { id: 7, name: 'Yılan', type: 'Sürüngen' },
    { id: 8, name: 'Akrep', type: 'Yürüyen Haşere' }
  ],
  monthly_work_done: [],
  expenses: [],
  pest_floor_plans: [],
  pest_stations: [],
  pest_visits: [],
  notifications: []
};

async function loadData() {
  try {
    const doc = await GlobalData.findOne({ doc_id: 'main' });
    if (doc && doc.data) {
      return doc.data;
    } else {
      await saveData(defaultData);
      return JSON.parse(JSON.stringify(defaultData));
    }
  } catch (e) { console.error('DB okuma hatasi:', e); return JSON.parse(JSON.stringify(defaultData)); }
}

async function saveData(data) {
  try { await GlobalData.findOneAndUpdate({ doc_id: 'main' }, { data }, { upsert: true }); }
  catch (e) { console.error('DB yazma hatasi:', e); }
}

const db = {
  hashPassword,

  // === KULLANICILAR ===
  getUserByEmail: async (email) => {
    const d = await loadData();
    return d.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },
  getUserById: async (id) => {
    const d = await loadData();
    return d.users.find(u => u.id === parseInt(id)) || null;
  },
  getUserCount: async () => (await loadData()).users.length,

  addUser: async (email, name, password) => {
    const d = await loadData();
    const newId = d.users.length > 0 ? Math.max(...d.users.map(u => u.id)) + 1 : 1;
    // Ilk kayit olan kisi admin olur
    const role = d.users.length === 0 ? 'admin' : 'technician';
    const u = {
      id: newId,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      password: hashPassword(password),
      role,
      preferences: {
        notifications_enabled: true
      },
      created_at: new Date().toISOString()
    };
    d.users.push(u);
    await saveData(d);
    return u;
  },

  getAllUsers: async () => {
    return (await loadData()).users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role, created_at: u.created_at }));
  },

  updateUserRole: async (id, role) => {
    const d = await loadData();
    const i = d.users.findIndex(u => u.id === parseInt(id));
    if (i === -1) return false;
    d.users[i].role = role;
    await saveData(d);
    return true;
  },

  changePassword: async (id, newPw) => {
    const d = await loadData();
    const i = d.users.findIndex(u => u.id === parseInt(id));
    if (i === -1) return false;
    d.users[i].password = hashPassword(newPw);
    await saveData(d);
    return true;
  },

  // === DOGRULAMA KODLARI ===
  saveVerificationCode: async (email, code) => {
    const d = await loadData();
    // Ayni e-posta icin eski kodlari sil
    d.verification_codes = d.verification_codes.filter(v => v.email !== email.toLowerCase());
    d.verification_codes.push({
      email: email.toLowerCase(),
      code,
      created_at: Date.now(),
      expires_at: Date.now() + 10 * 60 * 1000 // 10 dakika
    });
    await saveData(d);
  },

  verifyCode: async (email, code) => {
    const d = await loadData();
    const v = d.verification_codes.find(
      x => x.email === email.toLowerCase() && x.code === code && x.expires_at > Date.now()
    );
    if (v) {
      // Kodu kullanildiktan sonra sil
      d.verification_codes = d.verification_codes.filter(x => x.email !== email.toLowerCase());
      await saveData(d);
      return true;
    }
    return false;
  },

  // === MUSTERILER ===
  getAllCustomers: async (search = '') => {
    const d = await loadData();
    let list = d.customers;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.unvan.toLowerCase().includes(q) ||
        c.telefon.includes(q) ||
        c.adres.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => a.unvan.localeCompare(b.unvan, 'tr'));
  },

  getCustomerById: async (id) => {
    const d = await loadData();
    return d.customers.find(c => c.id === parseInt(id)) || null;
  },

  addCustomer: async (unvan, vergi_no, telefon, adres, uygulama_tipi, email = '', konum = '') => {
    const d = await loadData();
    const newId = d.customers.length > 0 ? Math.max(...d.customers.map(c => c.id)) + 1 : 1;
    const c = { id: newId, unvan, vergi_no: vergi_no || '', telefon, adres, uygulama_tipi, email: email || '', konum: konum || '', created_at: new Date().toISOString() };
    d.customers.push(c);
    await saveData(d);
    return c;
  },

  updateCustomer: async (id, unvan, vergi_no, telefon, adres, uygulama_tipi, email = '', konum = '') => {
    const d = await loadData();
    const i = d.customers.findIndex(c => c.id === parseInt(id));
    if (i === -1) return null;
    d.customers[i] = { ...d.customers[i], unvan, vergi_no: vergi_no || '', telefon, adres, uygulama_tipi, email: email || '', konum: konum || '' };
    await saveData(d);
    return d.customers[i];
  },

  updateCustomerEmail: async (id, email) => {
    const d = await loadData();
    const i = d.customers.findIndex(c => c.id === parseInt(id));
    if (i === -1) return null;
    d.customers[i].email = email || '';
    await saveData(d);
    return d.customers[i];
  },

  deleteCustomer: async (id) => {
    const d = await loadData();
    const i = d.customers.findIndex(c => c.id === parseInt(id));
    if (i === -1) return false;
    d.customers.splice(i, 1);
    await saveData(d);
    return true;
  },

  // === RANDEVULAR (APPOINTMENTS) ===
  getAllAppointments: async () => {
    const d = await loadData();
    return d.appointments || [];
  },

  getAppointmentsByDate: async (date) => {
    const d = await loadData();
    const appointments = d.appointments || [];
    const filtered = appointments.filter(a => a.date === date);
    const mapped = filtered.map(a => {
      const customer = d.customers.find(c => c.id === a.customer_id);
      return {
        ...a,
        customer: customer || { unvan: 'Bilinmeyen Müşteri', telefon: '', adres: '', uygulama_tipi: '' }
      };
    });
    return mapped.sort((a, b) => {
      const timeA = a.time || '00:00';
      const timeB = b.time || '00:00';
      return timeA.localeCompare(timeB);
    });
  },

  getAppointmentsByRegions: async (regions) => {
    const d = await loadData();
    const appointments = d.appointments || [];
    
    // Türkiye saati ile bugünün tarihini al
    const today = new Date();
    today.setHours(today.getHours() + 3);
    const todayStr = today.toISOString().split('T')[0];
    
    // Geçmişteki (bugünden önceki) randevuları hariç tut
    const futureAppointments = appointments.filter(a => a.date >= todayStr);
    
    const mapped = futureAppointments.map(a => {
      const customer = d.customers.find(c => c.id === a.customer_id);
      return {
        ...a,
        customer: customer || { unvan: 'Bilinmeyen Müşteri', konum: '' }
      };
    });
    
    // Bölgelerden herhangi birini içeriyorsa filtrele
    return mapped.filter(a => {
      const location = (a.customer.konum || a.customer.adres || "").toLowerCase();
      if (!location) return false;
      return regions.some(r => location.includes(r.toLowerCase()));
    });
  },

  getAppointmentsByCustomer: async (customerId) => {
    const d = await loadData();
    const appointments = d.appointments || [];
    const filtered = appointments.filter(a => a.customer_id === parseInt(customerId));
    return filtered.sort((a, b) => {
      const dateTimeA = `${a.date}T${a.time || '00:00'}`;
      const dateTimeB = `${b.date}T${b.time || '00:00'}`;
      return dateTimeA.localeCompare(dateTimeB);
    });
  },

  addAppointment: async (customerId, date, time, notes, pests) => {
    const d = await loadData();
    if (!d.appointments) d.appointments = [];
    const newId = d.appointments.length > 0 ? Math.max(...d.appointments.map(a => a.id)) + 1 : 1;
    const a = {
      id: newId,
      customer_id: parseInt(customerId),
      date,
      time: time || '12:00',
      notes: notes || '',
      pests: pests || [], // Seçilen haşereler listesi
      status: 'pending', // pending, completed
      ek1_id: null,
      created_at: new Date().toISOString()
    };
    d.appointments.push(a);
    
    // Bildirim tetikle
    const customer = d.customers.find(c => c.id === parseInt(customerId));
    const customerName = customer ? customer.unvan : 'Bilinmeyen Müşteri';
    
    await saveData(d);
    
    await db.addNotification(
      'Yeni İş Girildi',
      `Yeni bir iş/randevu oluşturuldu: ${customerName} (Tarih: ${date} - Saat: ${time || '12:00'})`,
      'info'
    );
    
    return a;
  },

  rescheduleAppointment: async (id, newDate, newTime, reason) => {
    const d = await loadData();
    const appointments = d.appointments || [];
    const i = appointments.findIndex(a => a.id === parseInt(id));
    if (i === -1) return null;
    
    const oldDate = appointments[i].date;
    const oldTime = appointments[i].time || '12:00';
    appointments[i].date = newDate;
    if (newTime) {
      appointments[i].time = newTime;
    }
    appointments[i].status = 'pending'; // reset status
    const formatDate = (dStr) => {
      if (!dStr) return '';
      const parts = dStr.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return dStr;
    };
    
    const fOldDate = formatDate(oldDate);
    const fNewDate = formatDate(newDate);
    const noteStr = `${fOldDate} tarihinden ${fNewDate} tarihine ${reason || 'belirtilmeyen bir neden'} dolayısıyla ertelenmiştir.`;

    appointments[i].notes = appointments[i].notes 
      ? `${appointments[i].notes}\n(Not: ${noteStr})`
      : noteStr;
    
    // Bildirim tetikle
    const customer = d.customers.find(c => c.id === appointments[i].customer_id);
    const customerName = customer ? customer.unvan : 'Bilinmeyen Müşteri';
    
    await saveData(d);
    
    await db.addNotification(
      'İşlem Ertelendi',
      `${customerName} işi ertelendi. Yeni Tarih: ${newDate} - Saat: ${newTime || oldTime} (Neden: ${reason || 'Belirtilmedi'})`,
      'warning'
    );
    
    return appointments[i];
  },

  updateAppointmentStatus: async (id, status, ek1Id = null) => {
    const d = await loadData();
    const appointments = d.appointments || [];
    const i = appointments.findIndex(a => a.id === parseInt(id));
    if (i === -1) return false;
    appointments[i].status = status;
    if (ek1Id) {
      appointments[i].ek1_id = parseInt(ek1Id);
    }
    await saveData(d);
    return true;
  },

  deleteAppointment: async (id) => {
    const d = await loadData();
    const appointments = d.appointments || [];
    const i = appointments.findIndex(a => a.id === parseInt(id));
    if (i === -1) return false;
    appointments.splice(i, 1);
    d.appointments = appointments;
    await saveData(d);
    return true;
  },

  // === EK-1 BELGELERI ===
  getEk1DocumentById: async (id) => {
    const d = await loadData();
    const docs = d.ek1_documents || [];
    return docs.find(doc => doc.id === parseInt(id)) || null;
  },

  addEk1Document: async (appointmentId, customerId, documentData) => {
    const d = await loadData();
    if (!d.ek1_documents) d.ek1_documents = [];
    const newId = d.ek1_documents.length > 0 ? Math.max(...d.ek1_documents.map(e => e.id)) + 1 : 1;
    
    const doc = {
      id: newId,
      appointment_id: appointmentId ? parseInt(appointmentId) : null,
      customer_id: parseInt(customerId),
      ...documentData,
      created_at: new Date().toISOString()
    };
    
    d.ek1_documents.push(doc);
    
    let appInfo = {};
    if (appointmentId) {
      if (!d.appointments) d.appointments = [];
      const i = d.appointments.findIndex(a => a.id === parseInt(appointmentId));
      if (i !== -1) {
        d.appointments[i].status = 'completed';
        d.appointments[i].ek1_id = newId;
        
        // Randevu tarihi varsa, belgenin tarihi de randevu tarihi olmali (ileriye donuk doldurmalar icin)
        if (d.appointments[i].date) {
          doc.created_at = d.appointments[i].date + 'T12:00:00.000Z';
        }
        
        appInfo = {
          appointment_id: d.appointments[i].id,
          scheduled_date: d.appointments[i].date,
          scheduled_time: d.appointments[i].time,
          appointment_notes: d.appointments[i].notes
        };
      }
    }
    
    // Aylık Yapılan İşler Kaydı (Fatura ve raporlama için tüm detayları kaydeder)
    if (!d.monthly_work_done) d.monthly_work_done = [];
    const workId = d.monthly_work_done.length > 0 ? Math.max(...d.monthly_work_done.map(w => w.id)) + 1 : 1;
    
    const customer = d.customers.find(c => c.id === parseInt(customerId)) || {};
    const appDate = appInfo.scheduled_date || new Date().toISOString().split('T')[0];
    const dateObj = new Date(appDate);
    const ay = String(dateObj.getMonth() + 1).padStart(2, '0');
    const yil = dateObj.getFullYear();
    const donem = `${yil}-${ay}`; // Örn: 2026-05
    
    const workRecord = {
      id: workId,
      ek1_id: newId,
      donem,
      completed_at: new Date().toISOString(),
      
      // Müşteri Bilgileri
      customer: {
        id: customer.id,
        unvan: customer.unvan,
        vergi_no: customer.vergi_no || '',
        telefon: customer.telefon,
        adres: customer.adres,
        uygulama_tipi: customer.uygulama_tipi
      },
      
      // Uygulanan Biyosidal & EK-1 Detayları
      hedef_hasere: documentData.hedef_hasere,
      biyosidal_urun: documentData.biyosidal_urun,
      aktif_madde: documentData.aktif_madde,
      urun_miktari: documentData.urun_miktari,
      uygulama_yontemi: documentData.uygulama_yontemi,
      teknisyen_adi: documentData.teknisyen_adi,
      uygulayicilar: documentData.uygulayicilar,
      signature_image: documentData.signature_image || null,
      
      // Randevu Bilgileri
      ...appInfo
    };
    
    d.monthly_work_done.push(workRecord);
    
    await saveData(d);
    
    // Bildirim tetikle
    const customerName = customer.unvan || 'Bilinmeyen Müşteri';
    await db.addNotification(
      'İşlem Tamamlandı',
      `İlaçlama işlemi tamamlandı: ${customerName} için EK-1 belgesi oluşturuldu.`,
      'success'
    );
    
    return doc;
  },

  getEk1DocumentsByCustomer: async (customerId) => {
    const d = await loadData();
    const docs = d.ek1_documents || [];
    return docs.filter(doc => doc.customer_id === parseInt(customerId))
               .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getAllEk1Products: async () => {
    const d = await loadData();
    if (!d.ek1_products || d.ek1_products.length === 0) {
      d.ek1_products = [
        { id: 1, commercialName: 'K-Othrine JEL', licenseDate: '15.10.2015', licenseNo: '2015/124', method: 'Jel Noktalama', activeIngredient: 'Deltamethrin', antidote: 'Semptomatik Tedavi', defaultQuantity: '10 gr' },
        { id: 2, commercialName: 'Maxforce Jel', licenseDate: '12.04.2016', licenseNo: '2016/98', method: 'Jel Noktalama', activeIngredient: 'Imidacloprid', antidote: 'Semptomatik Tedavi', defaultQuantity: '10 gr' },
        { id: 3, commercialName: 'Rodentisit Yem', licenseDate: '08.09.2017', licenseNo: '2017/215', method: 'Yem İstasyonu Yerleşimi', activeIngredient: 'Brodifacoum', antidote: 'K1 Vitamini', defaultQuantity: '2 adet' },
        { id: 4, commercialName: 'Solfac WP 10', licenseDate: '20.11.2014', licenseNo: '2014/312', method: 'Sırt Pompası (Rezidüel)', activeIngredient: 'Cyfluthrin', antidote: 'Semptomatik Tedavi', defaultQuantity: '50 gr' },
        { id: 5, commercialName: 'Chrysamed', licenseDate: '05.05.2018', licenseNo: '2018/88', method: 'U.L.V. Püskürtme', activeIngredient: 'Permethrin', antidote: 'Semptomatik Tedavi', defaultQuantity: '100 ml' }
      ];
      await saveData(d);
    }
    return d.ek1_products;
  },

  addEk1Product: async (productData) => {
    const d = await loadData();
    if (!d.ek1_products) d.ek1_products = [];
    const newId = d.ek1_products.length > 0 ? Math.max(...d.ek1_products.map(p => p.id)) + 1 : 1;
    const p = {
      id: newId,
      commercialName: productData.commercialName,
      licenseDate: productData.licenseDate || '',
      licenseNo: productData.licenseNo || '',
      method: productData.method || 'Jel Noktalama',
      activeIngredient: productData.activeIngredient || '',
      antidote: productData.antidote || 'Semptomatik Tedavi',
      defaultQuantity: productData.defaultQuantity || '10 gr',
      created_at: new Date().toISOString()
    };
    d.ek1_products.push(p);
    await saveData(d);
    return p;
  },

  updateEk1Product: async (id, productData) => {
    const d = await loadData();
    if (!d.ek1_products) d.ek1_products = [];
    const idx = d.ek1_products.findIndex(p => p.id === parseInt(id));
    if (idx === -1) throw new Error('İlaç bulunamadı');
    d.ek1_products[idx] = { ...d.ek1_products[idx], ...productData };
    await saveData(d);
    return d.ek1_products[idx];
  },

  deleteEk1Product: async (id) => {
    const d = await loadData();
    if (!d.ek1_products) return false;
    const initialLength = d.ek1_products.length;
    d.ek1_products = d.ek1_products.filter(p => p.id !== parseInt(id));
    await saveData(d);
    return d.ek1_products.length < initialLength;
  },

  getMonthlyWorkDoneReport: async () => {
    const d = await loadData();
    const reports = d.monthly_work_done || [];
    const docs = d.ek1_documents || [];
    return reports.map(rep => {
      const doc = docs.find(docItem => docItem.id === rep.ek1_id);
      let apps = rep.uygulayicilar;
      if (!apps && doc) {
        if (doc.uygulayicilar) {
          if (Array.isArray(doc.uygulayicilar)) {
            apps = doc.uygulayicilar.join(', ');
          } else if (typeof doc.uygulayicilar === 'string') {
            try {
              const parsed = JSON.parse(doc.uygulayicilar);
              apps = Array.isArray(parsed) ? parsed.join(', ') : parsed;
            } catch(e) {
              apps = doc.uygulayicilar;
            }
          }
        }
      }
      return {
        ...rep,
        uygulayicilar: apps || rep.teknisyen_adi
      };
    });
  },

  // === GİDERLER ===
  getAllExpenses: async (month = '') => {
    const d = await loadData();
    let list = d.expenses || [];
    if (month) {
      list = list.filter(e => e.date.startsWith(month));
    }
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  addExpense: async (expenseData) => {
    const d = await loadData();
    if (!d.expenses) d.expenses = [];
    const newId = d.expenses.length > 0 ? Math.max(...d.expenses.map(e => e.id)) + 1 : 1;
    const expense = {
      id: newId,
      date: expenseData.date || new Date().toISOString().split('T')[0],
      category: expenseData.category || 'Diğer',
      explanation: expenseData.explanation || '',
      amount: parseFloat(expenseData.amount) || 0,
      created_at: new Date().toISOString()
    };
    d.expenses.push(expense);
    await saveData(d);
    return expense;
  },
  deleteExpense: async (id) => {
    const d = await loadData();
    const beforeLength = d.expenses.length;
    d.expenses = (d.expenses || []).filter(e => e.id !== parseInt(id));
    await saveData(d);
    return d.expenses.length < beforeLength;
  },

  // === PEST KONTROL (KROKİ, İSTASYON, ZİYARET) ===
  getFloorPlansByCustomer: async (customerId) => {
    const d = await loadData();
    if (!d.pest_floor_plans) d.pest_floor_plans = [];
    return d.pest_floor_plans.filter(f => f.customer_id === parseInt(customerId));
  },
  addFloorPlan: async (customerId, title, imageUrl) => {
    const d = await loadData();
    if (!d.pest_floor_plans) d.pest_floor_plans = [];
    const newId = d.pest_floor_plans.length > 0 ? Math.max(...d.pest_floor_plans.map(f => f.id)) + 1 : 1;
    const f = { id: newId, customer_id: parseInt(customerId), title, image_url: imageUrl, created_at: new Date().toISOString() };
    d.pest_floor_plans.push(f);
    await saveData(d);
    return f;
  },
  deleteFloorPlan: async (id) => {
    const d = await loadData();
    if (!d.pest_floor_plans) d.pest_floor_plans = [];
    d.pest_floor_plans = d.pest_floor_plans.filter(f => f.id !== parseInt(id));
    if (d.pest_stations) {
      d.pest_stations = d.pest_stations.filter(s => s.floor_plan_id !== parseInt(id));
    }
    await saveData(d);
    return true;
  },

  getStationsByCustomer: async (customerId) => {
    const d = await loadData();
    if (!d.pest_stations) d.pest_stations = [];
    return d.pest_stations.filter(s => s.customer_id === parseInt(customerId));
  },
  addStation: async (customerId, stationCode, stationType, barcodeNumber, floorPlanId, positionX = 50, positionY = 50) => {
    const d = await loadData();
    if (!d.pest_stations) d.pest_stations = [];
    const newId = d.pest_stations.length > 0 ? Math.max(...d.pest_stations.map(s => s.id)) + 1 : 1;
    const s = {
      id: newId,
      customer_id: parseInt(customerId),
      station_code: stationCode.trim(),
      station_type: stationType, // rodent, pheromone, ILT, fly, gecko
      barcode_number: barcodeNumber.trim(),
      floor_plan_id: floorPlanId ? parseInt(floorPlanId) : null,
      position_x: parseFloat(positionX),
      position_y: parseFloat(positionY),
      status: 'active', // active, inactive
      created_at: new Date().toISOString()
    };
    d.pest_stations.push(s);
    await saveData(d);
    return s;
  },
  updateStationPosition: async (id, positionX, positionY) => {
    const d = await loadData();
    if (!d.pest_stations) d.pest_stations = [];
    const i = d.pest_stations.findIndex(s => s.id === parseInt(id));
    if (i === -1) return null;
    d.pest_stations[i].position_x = parseFloat(positionX);
    d.pest_stations[i].position_y = parseFloat(positionY);
    await saveData(d);
    return d.pest_stations[i];
  },
  updateStation: async (id, stationCode, stationType, barcodeNumber, status) => {
    const d = await loadData();
    if (!d.pest_stations) d.pest_stations = [];
    const i = d.pest_stations.findIndex(s => s.id === parseInt(id));
    if (i === -1) return null;
    d.pest_stations[i].station_code = stationCode.trim();
    d.pest_stations[i].station_type = stationType;
    d.pest_stations[i].barcode_number = barcodeNumber.trim();
    d.pest_stations[i].status = status;
    await saveData(d);
    return d.pest_stations[i];
  },
  deleteStation: async (id) => {
    const d = await loadData();
    if (!d.pest_stations) d.pest_stations = [];
    d.pest_stations = d.pest_stations.filter(s => s.id !== parseInt(id));
    if (d.pest_visits) {
      d.pest_visits = d.pest_visits.filter(v => v.station_id !== parseInt(id));
    }
    await saveData(d);
    return true;
  },

  getVisitsByCustomer: async (customerId) => {
    const d = await loadData();
    if (!d.pest_visits) d.pest_visits = [];
    const stations = d.pest_stations ? d.pest_stations.filter(s => s.customer_id === parseInt(customerId)) : [];
    const stationIds = stations.map(s => s.id);
    return d.pest_visits.filter(v => stationIds.includes(v.station_id))
                         .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  getVisitsByStation: async (stationId) => {
    const d = await loadData();
    if (!d.pest_visits) d.pest_visits = [];
    return d.pest_visits.filter(v => v.station_id === parseInt(stationId))
                         .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  addPestVisit: async (stationId, technicianId, pestActivity, baitConsumption, actionTaken, photoUrl = '') => {
    const d = await loadData();
    if (!d.pest_visits) d.pest_visits = [];
    const newId = d.pest_visits.length > 0 ? Math.max(...d.pest_visits.map(v => v.id)) + 1 : 1;
    const v = {
      id: newId,
      station_id: parseInt(stationId),
      technician_id: parseInt(technicianId),
      pest_activity: pestActivity, // none, low, medium, high
      bait_consumption: parseInt(baitConsumption), // 0, 25, 50, 75, 100
      action_taken: actionTaken || '',
      photo_url: photoUrl || '',
      created_at: new Date().toISOString()
    };
    d.pest_visits.push(v);
    await saveData(d);
    return v;
  },

  // === BİLDİRİMLER VE AYARLAR ===
  addNotification: async (title, message, type = 'info') => {
    const d = await loadData();
    if (!d.notifications) d.notifications = [];
    const newId = d.notifications.length > 0 ? Math.max(...d.notifications.map(n => n.id)) + 1 : 1;
    const n = {
      id: newId,
      title,
      message,
      type, // info, success, warning
      read_by_users: [], // okuyan kullanıcılar
      created_at: new Date().toISOString()
    };
    d.notifications.push(n);
    await saveData(d);
    return n;
  },

  getUserNotifications: async (userId) => {
    const d = await loadData();
    const user = d.users.find(u => u.id === parseInt(userId));
    if (!user) return [];
    
    // Varsayılan olarak bildirimler açık kabul edilir
    const isEnabled = user.preferences && user.preferences.notifications_enabled !== undefined
      ? user.preferences.notifications_enabled
      : true;
      
    if (!isEnabled) return [];

    const list = d.notifications || [];
    return list.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      is_read: n.read_by_users ? n.read_by_users.includes(parseInt(userId)) : false,
      created_at: n.created_at
    })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 50);
  },

  markNotificationAsRead: async (id, userId) => {
    const d = await loadData();
    if (!d.notifications) d.notifications = [];
    const n = d.notifications.find(x => x.id === parseInt(id));
    if (!n) return false;
    const uId = parseInt(userId);
    if (!n.read_by_users) n.read_by_users = [];
    if (!n.read_by_users.includes(uId)) {
      n.read_by_users.push(uId);
      await saveData(d);
    }
    return true;
  },

  clearUserNotifications: async (userId) => {
    const d = await loadData();
    if (!d.notifications) return false;
    const uId = parseInt(userId);
    const initialLength = d.notifications.length;
    d.notifications = d.notifications.filter(n => !n.read_by_users || !n.read_by_users.includes(uId));
    if (d.notifications.length !== initialLength) {
      await saveData(d);
      return true;
    }
    return true; // Return true even if nothing to delete, to avoid failure
  },

  markAllNotificationsAsRead: async (userId) => {
    const d = await loadData();
    if (!d.notifications) d.notifications = [];
    const uId = parseInt(userId);
    let changed = false;
    d.notifications.forEach(n => {
      if (!n.read_by_users) n.read_by_users = [];
      if (!n.read_by_users.includes(uId)) {
        n.read_by_users.push(uId);
        changed = true;
      }
    });
    if (changed) {
      await saveData(d);
    }
    return true;
  },

  updateUserPreferences: async (userId, preferences) => {
    const d = await loadData();
    const i = d.users.findIndex(u => u.id === parseInt(userId));
    if (i === -1) return null;
    
    if (!d.users[i].preferences) {
      d.users[i].preferences = { notifications_enabled: true };
    }
    
    if (preferences && preferences.notifications_enabled !== undefined) {
      d.users[i].preferences.notifications_enabled = !!preferences.notifications_enabled;
    }
    
    await saveData(d);
    return d.users[i];
  }
,

  // === HAŞERE KÜTÜPHANESİ ===
  getAllPests: async () => {
    const d = await loadData();
    return d.pests || [];
  },
  addPest: async (name, type) => {
    const d = await loadData();
    if (!d.pests) d.pests = [];
    const newId = d.pests.length > 0 ? Math.max(...d.pests.map(p => p.id)) + 1 : 1;
    const p = { id: newId, name, type: type || '' };
    d.pests.push(p);
    await saveData(d);
    return p;
  },
  updatePest: async (id, name, type) => {
    const d = await loadData();
    if (!d.pests) d.pests = [];
    const idx = d.pests.findIndex(p => p.id === parseInt(id));
    if (idx === -1) throw new Error('Haşere bulunamadı');
    d.pests[idx].name = name;
    d.pests[idx].type = type || '';
    await saveData(d);
    return d.pests[idx];
  },
  deletePest: async (id) => {
    const d = await loadData();
    if (!d.pests) return false;
    const initialLen = d.pests.length;
    d.pests = d.pests.filter(p => p.id !== parseInt(id));
    if (d.pests.length < initialLen) {
      await saveData(d);
      return true;
    }
    return false;
  }
};


console.log('Veritabani aktif.');
module.exports = db;

