import React, { useState, useEffect, useRef } from 'react';

// Dinamik API adresi belirleme (Telefondan yerel ağa bağlanırken sorun yaşamamak için)
const API_URL = 'https://hasere-ilaclama.vercel.app';

// ==========================================
// ÖZEL SVG İKON BİLEŞENLERİ (Bağımlılık azaltmak için)
// ==========================================
const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconFileText = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
  </svg>
);

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconLogOut = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconFile = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconDashboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

const IconExpenses = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const IconSettings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const IconBell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconCheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconInfo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const IconAlertCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ==========================================
// 📄 PEST KONTROL (ZARARLI YÖNETİMİ) MODÜLÜ BİLEŞENİ
// ==========================================
function PestControlPanel({ customers, token, user }) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [floorPlans, setFloorPlans] = useState([]);
  const [stations, setStations] = useState([]);
  const [visits, setVisits] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Form State
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanImage, setNewPlanImage] = useState('');
  const [showAddPlan, setShowAddPlan] = useState(false);
  
  // İstasyon Ekleme
  const [showAddStationModal, setShowAddStationModal] = useState(false);
  const [clickCoords, setClickCoords] = useState({ x: 50, y: 50 });
  const [newStation, setNewStation] = useState({
    code: '',
    type: 'rodent', // rodent, pheromone, ILT, fly
    barcode: ''
  });
  
  // Teknisyen Ziyaret Girişi
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [selectedStationForCheck, setSelectedStationForCheck] = useState(null);
  const [visitForm, setVisitForm] = useState({
    pestActivity: 'none',
    baitConsumption: 0,
    actionTaken: '',
    photoUrl: ''
  });

  // Seçili istasyon geçmişi modalı
  const [viewingStationHistory, setViewingStationHistory] = useState(null);
  const [stationVisits, setStationVisits] = useState([]);

  useEffect(() => {
    if (selectedCustomerId) {
      fetchPlans();
      fetchStations();
      fetchVisits();
      setSelectedPlan(null);
      setSelectedStationForCheck(null);
    }
  }, [selectedCustomerId]);

  const fetchPlans = async () => {
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/pest/floor-plans?customerId=${selectedCustomerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setFloorPlans(data);
      if (data.length > 0) setSelectedPlan(data[0]);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStations = async () => {
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/pest/stations?customerId=${selectedCustomerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setStations(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchVisits = async () => {
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/pest/visits?customerId=${selectedCustomerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setVisits(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePlanUpload = async (e) => {
    e.preventDefault();
    if (!newPlanTitle || !newPlanImage) return alert('Lütfen başlık girin ve bir dosya seçin.');
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/pest/floor-plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          title: newPlanTitle,
          imageUrl: newPlanImage
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNewPlanTitle('');
      setNewPlanImage('');
      setShowAddPlan(false);
      fetchPlans();
      alert('Kat planı (kroki) başarıyla yüklendi.');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPlanImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKrokiClick = (e) => {
    if (user.role !== 'admin') return; // Sadece admin istasyon pini ekleyebilir
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setClickCoords({ x, y });
    setNewStation({
      code: `İST-${stations.length + 1}`,
      type: 'rodent',
      barcode: `BRC-${Math.floor(100000 + Math.random() * 900000)}`
    });
    setShowAddStationModal(true);
  };

  const handleAddStationSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/pest/stations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          stationCode: newStation.code,
          stationType: newStation.type,
          barcodeNumber: newStation.barcode,
          floorPlanId: selectedPlan.id,
          positionŞ: clickCoords.x,
          positionY: clickCoords.y
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShowAddStationModal(false);
      fetchStations();
      alert('Cihaz/İstasyon kat planına başarıyla eklendi.');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBarcodeScan = async (e) => {
    e.preventDefault();
    if (!scannedBarcode) return;
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/pest/stations/scan?barcodeNumber=${scannedBarcode}&customerId=${selectedCustomerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'İstasyon bulunamadı.');
      setSelectedStationForCheck(data);
      setVisitForm({
        pestActivity: 'none',
        baitConsumption: 0,
        actionTaken: '',
        photoUrl: ''
      });
      setScannedBarcode('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleVisitSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/pest/visits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          stationId: selectedStationForCheck.id,
          pestActivity: visitForm.pestActivity,
          baitConsumption: visitForm.baitConsumption,
          actionTaken: visitForm.actionTaken,
          photoUrl: visitForm.photoUrl
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSelectedStationForCheck(null);
      fetchVisits();
      fetchStations();
      alert('Kontrol sonucu başarıyla kaydedildi.');
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePinClick = async (station) => {
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/pest/visits/station/${station.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setStationVisits(data);
      setViewingStationHistory(station);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStationDelete = async (id) => {
    if (!window.confirm('Bu yem istasyonunu tamamen silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/pest/stations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setViewingStationHistory(null);
        fetchStations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStationColor = (stationId) => {
    const stationVis = visits.filter(v => v.station_id === stationId);
    if (stationVis.length === 0) return '#10B981'; // Yeşil (kontrol yok, temiz)
    const latest = stationVis[0]; // İlk eleman en yeni olandır
    if (latest.pest_activity && latest.pest_activity !== 'none') return '#EF4444'; // Kırmızı (aktivite var)
    if (latest.action_taken && latest.action_taken.toLowerCase().includes('kırık')) return '#F59E0B'; // Sarı (kırık vb)
    return '#10B981';
  };

  const getStationTypeLabel = (type) => {
    switch (type) {
      case 'rodent': return '🏢 Fare Yem İstasyonu';
      case 'pheromone': return '🪤 Feromonlu Yapışkan Kapan';
      case 'ILT': return 'çağ Sinek Cihazı (ILT)';
      case 'fly': return '🏢 Karasinek Yapışkan Tuzak';
      default: return '🏢 Yem İstasyonu';
    }
  };

  // Son 6 ayın trend grafiğini hesaplama (SVG olarak)
  const getTrendData = () => {
    const months = [];
    const counts = [];
    const date = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      const label = d.toLocaleDateString('tr-TR', { month: 'short' });
      const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      
      const activeVisits = visits.filter(v => 
        v.created_at.startsWith(yearMonth) && v.pest_activity && v.pest_activity !== 'none'
      ).length;
      
      months.push(label);
      counts.push(activeVisits);
    }
    return { months, counts };
  };

  const trend = getTrendData();
  const maxCount = Math.max(...trend.counts, 5);

  return (
    <div style={{ color: '#F8FAFC' }}>
      <h1 className="section-title">Entegre Pest Kontrol İstasyon Yönetimi 📄</h1>
      <p className="section-subtitle">Müşteri yerleşim krokisi, QR/Barkodlu kapan kontrolleri ve HACCP trend analizleri.</p>

      {/* Müşteri Seçimi */}
      <div style={{ background: '#1E293B', padding: '20px', borderRadius: '24px', border: '1px solid #334155', marginBottom: '25px' }}>
        <label className="input-label" style={{ fontSize: '1rem', color: '#F59E0B' }}>🏢 Lütfen Pest Kontrol Uygulanacak Kurumsal Firmayı Seçin *</label>
        <select
          className="form-input"
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          style={{ marginTop: '10px', fontSize: '1rem' }}
        >
          <option value="">-- Müşteri Seçin --</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.unvan}</option>
          ))}
        </select>
      </div>

      {selectedCustomerId && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
          
          {/* ÜST TAB: Teknisyen Tarayıcı Girişi */}
          <div style={{ background: '#1E293B', padding: '20px', borderRadius: '24px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              👷 Saha Teknisyen Barkod Okuma Arayüzü
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              <div style={{ background: '#0F172A', padding: '20px', borderRadius: '16px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <form onSubmit={handleBarcodeScan}>
                  <label className="input-label">🔍 Cihaz Barkod / QR Kod Numarası Okutun</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Barkodu okutun veya yazın (Örn: BRC-123)..."
                      value={scannedBarcode}
                      onChange={(e) => setScannedBarcode(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '0 20px' }}>Sorgula</button>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '6px' }}>
                    * Mobil cihazlarda barkod okuyucuyla taranan kod anında buraya işlenerek istasyon arayüzünü açar.
                  </div>
                </form>
              </div>

              {selectedStationForCheck && (
                <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '20px', borderRadius: '16px', border: '1.5px solid var(--accent)' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: 'var(--accent)' }}>📍 {selectedStationForCheck.station_code} - İstasyon Kontrol Formu</h4>
                  <form onSubmit={handleVisitSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label className="input-label" style={{ fontSize: '0.75rem' }}>Zararlı Aktivitesi</label>
                        <select
                          className="form-input"
                          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                          value={visitForm.pestActivity}
                          onChange={(e) => setVisitForm({ ...visitForm, pestActivity: e.target.value })}
                        >
                          <option value="none">Temiz (Aktivite Yok)</option>
                          <option value="fare">🏢 Fare Aktivitesi</option>
                          <option value="hamam_bocegi">🏢 Hamamböceği Bulgusu</option>
                          <option value="karasinek">🏢 Uçan Haşere Yoğunluğu</option>
                          <option value="diger"> Diğer Zararlılar</option>
                        </select>
                      </div>
                      <div>
                        <label className="input-label" style={{ fontSize: '0.75rem' }}>Yem Tüketim Oranı</label>
                        <select
                          className="form-input"
                          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                          value={visitForm.baitConsumption}
                          onChange={(e) => setVisitForm({ ...visitForm, baitConsumption: parseInt(e.target.value) })}
                        >
                          <option value="0">%0 Tüketim</option>
                          <option value="25">%25 Tüketim</option>
                          <option value="50">%50 Tüketim (Yarı)</option>
                          <option value="75">%75 Tüketim</option>
                          <option value="100">%100 Tüketim (Bitti)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="input-label" style={{ fontSize: '0.75rem' }}>Uygulanan Müdahale / Görüş</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                        placeholder="Yem taözelendi, kapan temizlendi, cihaz kırık yenilendi vb..."
                        value={visitForm.actionTaken}
                        onChange={(e) => setVisitForm({ ...visitForm, actionTaken: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                      <button type="submit" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '8px 15px' }}>✅ Sonucu Kaydet</button>
                      <button type="button" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 15px', width: 'auto' }} onClick={() => setSelectedStationForCheck(null)}>Vazgeç</button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>

          {/* İKİNCİ BÖLÜM: Kat Planı (Kroki) Üzerine İstasyon Yerleştirme */}
          <div style={{ background: '#1E293B', padding: '25px', borderRadius: '24px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🗺️ İnteraktif Yerleşim Planı (Kat Krokisi)
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '3px' }}>
                  {user.role === 'admin' ? '➕ İstasyon eklemek için kroki resminin üzerine tıklayın. Koordinat otomatik kaydedilir.' : '🪤 İstasyon detaylarını ve son kontrol durumlarını piyonlara tıklayarak görün.'}
                </p>
              </div>
              {user.role === 'admin' && (
                <button
                  className="btn btn-secondary"
                  style={{ width: 'auto', padding: '8px 16px', fontSize: '0.8rem' }}
                  onClick={() => setShowAddPlan(!showAddPlan)}
                >
                  ➕ Yeni Kroki Yükle
                </button>
              )}
            </div>

            {showAddPlan && (
              <form onSubmit={handlePlanUpload} style={{ background: '#0F172A', padding: '15px', borderRadius: '16px', border: '1px solid #334155', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label className="input-label">Kroki Başlığı (Örn: A Blok Zemin Kat) *</label>
                    <input type="text" className="form-input" required value={newPlanTitle} onChange={(e) => setNewPlanTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="input-label">Kroki Görseli Seçin *</label>
                    <input type="file" accept="image/*" className="form-input" required onChange={handleFileChange} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', width: 'auto', padding: '8px 25px' }}>Kaydet ve Yükle</button>
              </form>
            )}

            {floorPlans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748B', background: '#0F172A', borderRadius: '20px', border: '1.5px dashed #334155' }}>
                ℹ️ Bu müşteriye ait yüklenmiş yerleşim planı bulunmamaktadır.
              </div>
            ) : (
              <div>
                {/* Kroki Seçim Tabı */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', overflow: 'auto', paddingBottom: '5px' }}>
                  {floorPlans.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlan(p)}
                      style={{
                        padding: '8px 15px',
                        background: selectedPlan?.id === p.id ? 'var(--accent)' : '#0F172A',
                        color: selectedPlan?.id === p.id ? '#FFFFFF' : '#94A3B8',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      📍 {p.title}
                    </button>
                  ))}
                </div>

                {selectedPlan && (
                  <div style={{ position: 'relative', border: '2px solid #334155', borderRadius: '20px', overflow: 'hidden', background: '#0F172A' }}>
                    
                    {/* Kroki Görseli */}
                    <img
                      src={selectedPlan.image_url}
                      alt={selectedPlan.title}
                      onClick={handleKrokiClick}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        maxHeight: '600px',
                        objectFit: 'contain',
                        cursor: user.role === 'admin' ? 'crosshair' : 'default'
                      }}
                    />

                    {/* Cihaz Pinleri */}
                    {stations.filter(s => s.floor_plan_id === selectedPlan.id).map(st => (
                      <div
                        key={st.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePinClick(st);
                        }}
                        style={{
                          position: 'absolute',
                          left: `${st.position_x}%`,
                          top: `${st.position_y}%`,
                          transform: 'translate(-50%, -50%)',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: getStationColor(st.id),
                          border: '2px solid #FFFFFF',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          color: '#FFFFFF',
                          fontWeight: 'bold',
                          transition: 'all 0.2s ease',
                          zIndex: 10
                        }}
                        title={`${st.station_code} (${st.barcode_number})`}
                      >
                        {st.station_code.split('-')[1] || '⬢'}
                      </div>
                    ))}

                  </div>
                )}
              </div>
            )}
          </div>

          {/* ÜÇÜNCÜ BÖLÜM: HACCP Denetim Trend Analiz Grafikleri */}
          <div style={{ background: '#1E293B', padding: '25px', borderRadius: '24px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📈 HACCP Zararlı Yoğunluğu Aylık Trend Analizi
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '20px' }}>
              Son 6 ayda gıda güvenliği kapsamında istasyonlarda tespit edilen aktif pest (zararlı) hareket yoğunluk istatistiği.
            </p>

            <div style={{ background: '#0F172A', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
              {visits.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748B', fontStyle: 'italic' }}>
                  Yeterli kontrol verisi girilmediğinden trend grafiği şu an oluşturulamıyor.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <svg viewBox="0 0 500 200" style={{ width: '100%', height: 'auto', maxHeight: '250px' }}>
                    {/* Grid Çizgileri */}
                    <line x1="40" y1="20" x2="480" y2="20" stroke="#334155" strokeWidth="1" strokeDasharray="4" />
                    <line x1="40" y1="80" x2="480" y2="80" stroke="#334155" strokeWidth="1" strokeDasharray="4" />
                    <line x1="40" y1="140" x2="480" y2="140" stroke="#334155" strokeWidth="1" strokeDasharray="4" />
                    <line x1="40" y1="170" x2="480" y2="170" stroke="#475569" strokeWidth="1.5" />

                    {/* Çubuk Grafikler */}
                    {trend.counts.map((c, i) => {
                      const x = 70 + i * 70;
                      const h = (c / maxCount) * 140; // Max yükseklik 140px
                      const y = 170 - h;
                      return (
                        <g key={i}>
                          {/* Sütun */}
                          <rect
                            x={x - 15}
                            y={y}
                            width="30"
                            height={h}
                            rx="4"
                            fill="url(#trendGrad)"
                          />
                          {/* Değer */}
                          <text x={x} y={y - 8} fill="#F8FAFC" fontSize="10" textAnchor="middle" fontWeight="bold">
                            {c}
                          </text>
                          {/* Etiket */}
                          <text x={x} y="185" fill="#94A3B8" fontSize="9" textAnchor="middle">
                            {trend.months[i]}
                          </text>
                        </g>
                      );
                    })}

                    {/* Gradients */}
                    <defs>
                      <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" />
                        <stop offset="100%" stopColor="#BE123C" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ fontSize: '0.8rem', color: '#EF4444', fontWeight: 'bold', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🔴 Kırmızı Sütunlar: İlgili Ayda Zararlı Bulunan Cihaz Adetlerini Temsil Eder.
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* POPUP: İstasyon Ekleme Modalı */}
      {showAddStationModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2 className="modal-title">➕ Yeni Yem İstasyonu Ekle</h2>
              <button className="close-btn" onClick={() => setShowAddStationModal(false)}>❌</button>
            </div>
            <form onSubmit={handleAddStationSubmit}>
              <div className="input-group">
                <label className="input-label">Cihaz Kodu *</label>
                <input type="text" className="form-input" required value={newStation.code} onChange={(e) => setNewStation({ ...newStation, code: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Barkod Numarası *</label>
                <input type="text" className="form-input" required value={newStation.barcode} onChange={(e) => setNewStation({ ...newStation, barcode: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Cihaz Türü *</label>
                <select className="form-input" value={newStation.type} onChange={(e) => setNewStation({ ...newStation, type: e.target.value })}>
                  <option value="rodent">🏢 Fare Yem İstasyonu</option>
                  <option value="pheromone">🪤 Feromonlu Kapan (Böcek)</option>
                  <option value="ILT">çağ Sinek Cihazı (ILT)</option>
                  <option value="fly">🏢 Yapışkan Sinek Şeridi</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary">Kaydet</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddStationModal(false)}>İptal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP: İstasyon Geçmişi ve Detay Modalı */}
      {viewingStationHistory && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px', background: '#1E293B' }}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ fontSize: '1.1rem', color: 'var(--accent)' }}>📋 Cihaz Kartı ve Kontrol Geçmişi</h2>
              <button className="close-btn" onClick={() => setViewingStationHistory(null)}>❌</button>
            </div>
            
            <div style={{ background: '#0F172A', padding: '15px', borderRadius: '14px', border: '1px solid #334155', marginBottom: '20px', fontSize: '0.85rem' }}>
              <div>Kodu: <strong>{viewingStationHistory.station_code}</strong></div>
              <div>Barkod: <strong>{viewingStationHistory.barcode_number}</strong></div>
              <div>Tipi: <strong>{getStationTypeLabel(viewingStationHistory.station_type)}</strong></div>
              <div>Durumu: <span style={{ color: viewingStationHistory.status === 'active' ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>{viewingStationHistory.status === 'active' ? 'Aktif' : 'Pasif'}</span></div>
            </div>

            <h4 style={{ color: '#F8FAFC', marginBottom: '10px' }}>✅ Son Kontroller</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stationVisits.length === 0 ? (
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontStyle: 'italic' }}>Bu cihaza ait henüz bir ziyaret kaydı bulunmuyor.</span>
              ) : (
                stationVisits.map(v => (
                  <div key={v.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent)', fontWeight: 'bold' }}>
                      <span>📅 {new Date(v.created_at).toLocaleDateString('tr-TR')}</span>
                      <span>Bait: %{v.bait_consumption}</span>
                    </div>
                    <div style={{ marginTop: '4px' }}>Bulgu: <strong style={{ color: v.pest_activity !== 'none' ? '#EF4444' : '#10B981' }}>{v.pest_activity === 'none' ? 'Temiz' : v.pest_activity}</strong></div>
                    {v.action_taken && <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Açıklama: {v.action_taken}</div>}
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px' }}>
              {user.role === 'admin' && (
                <button
                  type="button"
                  className="btn btn-action-danger"
                  style={{ width: 'auto', padding: '8px 20px', background: 'rgba(239,68,68,0.2)', border: '1.5px solid #EF4444', color: '#EF4444', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}
                  onClick={() => handleStationDelete(viewingStationHistory.id)}
                >
                  🗑️ Cihazı Sil
                </button>
              )}
              <button type="button" className="btn btn-secondary" style={{ width: 'auto', padding: '8px 20px', marginLeft: 'auto' }} onClick={() => setViewingStationHistory(null)}>Kapat</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// WeatherBadge Component for showing weather on each appointment card
const distCoords = {
  'edremit': { lat: 39.5961, lon: 27.0244 },
  'burhaniye': { lat: 39.5028, lon: 26.9744 },
  'akçay': { lat: 39.5856, lon: 26.9231 },
  'güre': { lat: 39.5919, lon: 26.8528 },
  'altınoluk': { lat: 39.5761, lon: 26.7486 },
  'ayvalık': { lat: 39.3198, lon: 26.6953 },
  'gömeç': { lat: 39.3878, lon: 26.8406 },
  'havran': { lat: 39.5592, lon: 27.0983 },
  'zeytinli': { lat: 39.5861, lon: 26.9658 },
  'kadıköy': { lat: 39.5892, lon: 27.0017 },
  'küçükkuyu': { lat: 39.5500, lon: 26.6111 }
};

const weatherCache = {};

const WeatherBadge = ({ date, address, konum }) => {
  const [weather, setWeather] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    const fetchW = async () => {
      let ilce = (konum || "").split(" / ")[1] || address || "edremit";
      ilce = ilce.toLowerCase().trim();
      
      const coords = distCoords[ilce] || distCoords['edremit'];
      const cacheKey = `${ilce}_${date}`;
      
      if (weatherCache[cacheKey]) {
        if (isMounted) setWeather(weatherCache[cacheKey]);
        return;
      }
      
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=precipitation_probability_max,wind_speed_10m_max&timezone=Europe%2FIstanbul&start_date=${date}&end_date=${date}`);
        const data = await response.json();
        if (data.daily && data.daily.precipitation_probability_max) {
          const w = {
            rain: data.daily.precipitation_probability_max[0],
            wind: data.daily.wind_speed_10m_max[0],
            ilce: ilce.charAt(0).toUpperCase() + ilce.slice(1)
          };
          weatherCache[cacheKey] = w;
          if (isMounted) setWeather(w);
        }
      } catch (err) {}
    };
    if (date) fetchW();
    return () => { isMounted = false; };
  }, [date, address, konum]);
  
  if (!weather) return null;
  
  return (
    <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', marginTop: '6px', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '6px', width: 'fit-content' }}>
      <span style={{ color: '#94A3B8' }}>{weather.ilce}:</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        🌧️ Yağış: <strong style={{ color: weather.rain > 50 ? '#EF4444' : '#10B981' }}>%{weather.rain}</strong>
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        💨 Rüzgar: <strong style={{ color: weather.wind > 30 ? '#F59E0B' : '#10B981' }}>{weather.wind} km/h</strong>
      </span>
    </div>
  );
};

export default function App() {
  // Oturum Durumları
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  
  // Arayüz Durumları
  const [activeTab, setActiveTab] = useState('daily_plan'); // Varsayılan sekme Günlük Plan (İş Listesi)
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (val.length >= 3) {
      const query = val.toLowerCase();
      const matched = customers.find(c => 
        c.unvan.toLowerCase().includes(query) || 
        (c.vergi_no && c.vergi_no.includes(query)) ||
        c.telefon.includes(query) ||
        c.adres.toLowerCase().includes(query)
      );
      if (matched) {
        setSelectedCustomerForDetail(matched);
        setSearchQuery('');
      }
    }
  };
  
  // Modal Durumları
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Bildirimler & Ayarlar
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const notificationsRef = useRef(null);

  // Bildirim menüsü dışına tıklanınca kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotificationsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Giriş Formu (Google olana kadar kolay test için)
  const [emailInput, setEmailInput] = useState('admin@example.com'); // Varsayılan kolay test e-postası

  // Form Alanları (Müşteri Ekleme/Düzenleme)
  const [formData, setFormData] = useState({
    unvan: '',
    vergi_no: '',
      konum: '',
    telefon: '',
    adres: '',
    uygulama_tipi: 'Kapalı Alan',
    email: ''
  });

  // Yeni Arayüz State Alanları
  const [selectedCustomerForDetail, setSelectedCustomerForDetail] = useState(null);
  const [dailyAppointments, setDailyAppointments] = useState([]);
  const [customerAppointments, setCustomerAppointments] = useState([]);
  
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [dailyWeather, setDailyWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=39.5961&longitude=27.0244&daily=precipitation_probability_max,wind_speed_10m_max&timezone=Europe%2FIstanbul&start_date=${selectedDate}&end_date=${selectedDate}`);
        const data = await response.json();
        if (data.daily && data.daily.precipitation_probability_max) {
          setDailyWeather({
            rain: data.daily.precipitation_probability_max[0],
            wind: data.daily.wind_speed_10m_max[0]
          });
        } else {
          setDailyWeather(null);
        }
      } catch (err) {
        console.error("Hava durumu alınamadı:", err);
        setDailyWeather(null);
      }
    };
    if (selectedDate) {
      fetchWeather();
    }
  }, [selectedDate]);

  // Randevu Planlama Form State
  const [newAppDate, setNewAppDate] = useState('');
  const [newAppTime, setNewAppTime] = useState('12:00');
  const [newAppNotes, setNewAppNotes] = useState('');

  // Erteleme Modalı State
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppForReschedule, setSelectedAppForReschedule] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('12:00');
  const [rescheduleReason, setRescheduleReason] = useState('Hava Muhalefeti (Yağmur/Rüzgar)');

  // EK-1 Form Modalı State
  const [showEk1Modal, setShowEk1Modal] = useState(false);
  const [selectedAppForEk1, setSelectedAppForEk1] = useState(null);
  const [ek1FormData, setEk1FormData] = useState({
    hedef_hasere: 'Hamam Böceği',
    biyosidal_urun: '',
    urun_miktari: '',
    uygulama_yontemi: '',
    aktif_madde: ''
  });
  const [ek1Docs, setEk1Docs] = useState([]); 
  const [viewingEk1Doc, setViewingEk1Doc] = useState(null);

  // Hızlı Randevu Modalı State (Günlük Plandan)
  const [showQuickAppModal, setShowQuickAppModal] = useState(false);
  const [quickAppCustomerId, setQuickAppCustomerId] = useState('');
  const [quickAppDate, setQuickAppDate] = useState('');
  const [quickAppTime, setQuickAppTime] = useState('12:00');
  const [quickAppNotes, setQuickAppNotes] = useState('');

  // İlaç Kütüphanesi ve Aylık Raporlama State Alanları
  const [ek1Products, setEk1Products] = useState([]);
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [newBiocide, setNewBiocide] = useState({
    commercialName: '',
    licenseDate: '',
    licenseNo: '',
    method: 'Jel Noktalama',
    activeIngredient: '',
    antidote: 'Semptomatik Tedavi',
    defaultQuantity: '10 gr'
  });
  
  const getTodayMonthString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const [expenses, setExpenses] = useState([]);
  const [selectedExpenseMonth, setSelectedExpenseMonth] = useState(getTodayMonthString());
  const [searchExpenseQuery, setSearchExpenseQuery] = useState('');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpenseData, setNewExpenseData] = useState({
    date: getTodayString(),
    category: '🚗 Araç Yakıt / Benzin',
    explanation: '',
    amount: ''
  });
  
  const [selectedReportMonth, setSelectedReportMonth] = useState(getTodayMonthString());
  const [searchReportQuery, setSearchReportQuery] = useState('');
  const [showAddBiocideModal, setShowAddBiocideModal] = useState(false);
  const [isNewBiocideMode, setIsNewBiocideMode] = useState(false);

  // Uygulayıcılar Listesi (Çoktan Seçmeli + Dinamik Ekleme)
  const [applicatorsList, setApplicatorsList] = useState(() => {
    const saved = localStorage.getItem('hasere_applicators');
    const defaultList = ['Cihan Kaynak', 'Erkan Erdem', 'Mehmet Selim'];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter(name => name !== 'Ömür Karabacak');
      } catch (e) {
        return defaultList;
      }
    }
    return defaultList;
  });
  const [newApplicatorInput, setNewApplicatorInput] = useState('');

  // Sabit Mesul Müdür
  const MESUL_MUDUR = 'Sadun Güneş';

  // Sayfa yüklendiğinde yerel hafızadan (localStorage) oturumu kurtar
  useEffect(() => {
    const savedToken = localStorage.getItem('hasere_token');
    const savedUser = localStorage.getItem('hasere_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Kullanıcı değiştiğinde veya arama yapıldığında müşterileri getir
  useEffect(() => {
    if (token) {
      fetchCustomers();
    }
  }, [token, searchQuery]);

  // Hata/Başarı bildirimlerini 4 saniye sonra otomatik temizle
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Tarih değiştiğinde veya İş Listesi sekmesine gelindiğinde randevuları çek
  useEffect(() => {
    if (token && activeTab === 'daily_plan') {
      fetchDailyAppointments(selectedDate);
    }
  }, [token, selectedDate, activeTab]);

  // Seçili detay müşterisi değiştiğinde onun evrak arşivini ve randevu geçmişini çek
  useEffect(() => {
    if (token && selectedCustomerForDetail) {
      fetchCustomerEk1Docs(selectedCustomerForDetail.id);
      fetchCustomerAppointments(selectedCustomerForDetail.id);
    }
  }, [token, selectedCustomerForDetail]);

  // Bildirimleri Çek
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setNotifications(data);
    } catch (err) {
      console.error('Bildirimler yüklenemedi:', err.message);
    }
  };

  // Bildirim okundu işaretle
  const markNotificationAsRead = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  // Tüm bildirimleri okundu işaretle
  const markAllNotificationsAsRead = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notifications/read-all`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  // Okunmuş bildirimleri sil/temizle
  const clearAllNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notifications/clear`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchNotifications();
        setShowNotificationsDropdown(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Kullanıcı tercihlerini güncelle
  const updatePreferences = async (enabled) => {
    try {
      const response = await fetch(`${API_URL}/api/users/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notifications_enabled: enabled })
      });
      const data = await response.json();
      if (response.ok) {
        setNotificationsEnabled(enabled);
        setSuccess(enabled ? 'Bildirimler başarıyla açıldı.' : 'Bildirimler başarıyla kapatıldı.');
        
        // Kullanıcı state'ini de güncelle
        const updatedUser = { ...user, preferences: { notifications_enabled: enabled } };
        setUser(updatedUser);
        localStorage.setItem('hasere_user', JSON.stringify(updatedUser));
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Polling: Her 30 saniyede bir bildirimleri ve token/user set edildikten sonra ilk seferinde çek
  useEffect(() => {
    if (token && user) {
      // Preferences'tan initial state'i al
      if (user.preferences && user.preferences.notifications_enabled !== undefined) {
        setNotificationsEnabled(user.preferences.notifications_enabled);
      }
      
      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 30000);
      return () => clearInterval(intervalId);
    }
  }, [token, user]);

  // Günlük randevuları çek
  const fetchDailyAppointments = async (date) => {
    try {
      const response = await fetch(`${API_URL}/api/appointments?date=${date}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Randevular yüklenemedi.');
      setDailyAppointments(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // İlaç kütüphanesini çek
  const fetchEk1Products = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ek1/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'İlaçlar yüklenemedi.');
      setEk1Products(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Aylık yapılan iş raporlarını çek
  const fetchMonthlyReports = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ek1/reports/monthly`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Rapor verileri yüklenemedi.');
      setMonthlyReports(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Aylık yapılan iş raporlarını Excel olarak dışa aktar (ŞML Spreadsheet formatında stilize edilmiş olarak)
  const exportToExcel = (reportsToExport) => {
    if (!reportsToExport || reportsToExport.length === 0) {
      alert('Dışa aktarılacak tamamlanmış iş kaydı bulunamadı.');
      return;
    }
    
    // Excel ŞML formatı ile mükemmel stilize edilmiş tablo yapısı
    let şml = '<?şml version="1.0" encoding="utf-8"?>\n';
    şml += '<?mso-application progid="Excel.Sheet"?>\n';
    şml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
    şml += ' xmlns:o="urn:schemas-microsoft-com:office:microsoft"\n';
    şml += ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n';
    şml += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n';
    şml += ' xmlns:html="http://www.w3.org/TR/REC-html40">\n';
    
    // Stil tanımlamaları
    şml += ' <Styles>\n';
    şml += '  <Style ss:ID="Default" ss:Name="Normal">\n';
    şml += '   <Alignment ss:Vertical="Bottom"/>\n';
    şml += '   <Borders/>\n';
    şml += '   <Font ss:FontName="Calibri" x:CharSet="162" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>\n';
    şml += '   <Interior/>\n';
    şml += '   <NumberFormat/>\n';
    şml += '   <Protection/>\n';
    şml += '  </Style>\n';
    
    // Tablo başlık stili (Yeşil arka plan, beyaz kalın yazı)
    şml += '  <Style ss:ID="Header">\n';
    şml += '   <Font ss:FontName="Calibri" x:CharSet="162" x:Family="Swiss" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>\n';
    şml += '   <Interior ss:Color="#10B981" ss:Pattern="Solid"/>\n';
    şml += '   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>\n';
    şml += '   <Borders>\n';
    şml += '    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#059669"/>\n';
    şml += '   </Borders>\n';
    şml += '  </Style>\n';
    
    // Rapor başlık stili
    şml += '  <Style ss:ID="Title">\n';
    şml += '   <Font ss:FontName="Calibri" x:CharSet="162" x:Family="Swiss" ss:Size="14" ss:Bold="1" ss:Color="#059669"/>\n';
    şml += '   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>\n';
    şml += '  </Style>\n';
    
    // Zebra stili (Tek satırlar için hafif gri arka plan)
    şml += '  <Style ss:ID="Zebra">\n';
    şml += '   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>\n';
    şml += '  </Style>\n';
    şml += ' </Styles>\n';
    
    const monthStr = selectedReportMonth ? `${selectedReportMonth} Dönemi` : 'Tüm Dönemler';
    şml += ` <Worksheet ss:Name="Aylik Hizmet Raporu">\n`;
    şml += '  <Table>\n';
    
    // Sütun genişlikleri
    şml += '   <Column ss:Width="100"/>\n'; // Tarih
    şml += '   <Column ss:Width="220"/>\n'; // Müşteri Unvanı
    şml += '   <Column ss:Width="250"/>\n'; // Açık Adres
    şml += '   <Column ss:Width="110"/>\n'; // Hedef Zararlı
    şml += '   <Column ss:Width="150"/>\n'; // Biyosidal Ürün
    şml += '   <Column ss:Width="120"/>\n'; // Aktif Madde
    şml += '   <Column ss:Width="90"/>\n';  // Kullanım Miktarı
    şml += '   <Column ss:Width="120"/>\n'; // Uygulayıcı Teknisyen
    
    // Satır 1: Başlık
    şml += '   <Row ss:Height="35">\n';
    şml += `    <Cell ss:StyleID="Title" ss:MergeAcross="7"><Data ss:Type="String">KÖRFEZ İLAÇLAMA - AYLIK YAPILAN HİZMETLER RAPORU (${monthStr})</Data></Cell>\n`;
    şml += '   </Row>\n';
    
    // Satır 2: Boşluk
    şml += '   <Row ss:Height="10"/>\n';
    
    // Satır 3: Sütun Başlıkları
    şml += '   <Row ss:Height="24" ss:StyleID="Header">\n';
    şml += '    <Cell><Data ss:Type="String">Uygulama Tarihi</Data></Cell>\n';
    şml += '    <Cell><Data ss:Type="String">Müşteri / Firma Unvanı</Data></Cell>\n';
    şml += '    <Cell><Data ss:Type="String">Uygulama Yapılan Adres</Data></Cell>\n';
    şml += '    <Cell><Data ss:Type="String">Hedef Zararlı Türü</Data></Cell>\n';
    şml += '    <Cell><Data ss:Type="String">Kullanılan Biyosidal Ürün</Data></Cell>\n';
    şml += '    <Cell><Data ss:Type="String">Aktif Madde / İçerik</Data></Cell>\n';
    şml += '    <Cell><Data ss:Type="String">Kullanılan Miktar</Data></Cell>\n';
    şml += '    <Cell><Data ss:Type="String">Uygulayıcılar</Data></Cell>\n';
    şml += '   </Row>\n';
    
    // Verileri Dolduralım
    reportsToExport.forEach((rep, idx) => {
      const isZebra = idx % 2 === 1;
      const style = isZebra ? ' ss:StyleID="Zebra"' : '';
      
      const repDate = new Date(rep.completed_at).toLocaleDateString('tr-TR');
      const unvan = rep.customer.unvan || '-';
      const adres = rep.customer.adres || '-';
      const hasere = rep.hedef_hasere || '-';
      const urun = rep.biyosidal_urun || '-';
      const aktif = rep.aktif_madde || '-';
      const miktar = rep.urun_miktari || '-';
      const tek = rep.uygulayicilar || rep.teknisyen_adi || '-';
      
      şml += `   <Row ss:Height="20"${style}>\n`;
      şml += `    <Cell><Data ss:Type="String">${repDate}</Data></Cell>\n`;
      şml += `    <Cell><Data ss:Type="String">${unvan}</Data></Cell>\n`;
      şml += `    <Cell><Data ss:Type="String">${adres}</Data></Cell>\n`;
      şml += `    <Cell><Data ss:Type="String">${hasere}</Data></Cell>\n`;
      şml += `    <Cell><Data ss:Type="String">${urun}</Data></Cell>\n`;
      şml += `    <Cell><Data ss:Type="String">${aktif}</Data></Cell>\n`;
      şml += `    <Cell><Data ss:Type="String">${miktar}</Data></Cell>\n`;
      şml += `    <Cell><Data ss:Type="String">${tek}</Data></Cell>\n`;
      şml += '   </Row>\n';
    });
    
    şml += '  </Table>\n';
    şml += ' </Worksheet>\n';
    şml += '</Workbook>\n';
    
    // Tarayıcı üzerinden Excel dosyasını tetikle
    const blob = new Blob([şml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Korfez_Ilaclama_Hizmet_Raporu_${selectedReportMonth || 'Tum_Donemler'}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Kütüphaneye yeni ilaç ekle
  const handleAddBiocide = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/ek1/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newBiocide)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'İlaç eklenemedi.');
      
      setSuccess('Yeni ilaç başarıyla kütüphaneye eklendi.');
      setShowAddBiocideModal(false);
      setNewBiocide({
        commercialName: '',
        licenseDate: '',
        licenseNo: '',
        method: 'Jel Noktalama',
        activeIngredient: '',
        antidote: 'Semptomatik Tedavi',
        defaultQuantity: '10 gr'
      });
      
      // Auto-fill the EK-1 form if it's currently open
      if (showEk1Modal) {
        setEk1FormData(prev => {
          const nextFormData = {
            ...prev,
            biyosidal_urun: data.commercialName,
            ruhsat_tarihi: data.licenseDate || '',
            ruhsat_sayisi: data.licenseNo || '',
            uygulama_sekli: data.method || 'Jel Noktalama',
            uygulama_yontemi: data.method || 'Jel Noktalama',
            aktif_madde: data.activeIngredient || '',
            antidotu: data.antidote || 'Semptomatik Tedavi',
            urun_miktari: data.defaultQuantity || '10 gr'
          };
          
          // Trigger report text update as well
          const pests = [];
          if (nextFormData.hedef_hasere_yuruyen) pests.push('Yürüyen Haşere');
          if (nextFormData.hedef_hasere_ucan) pests.push('Uçan Haşere');
          if (nextFormData.hedef_hasere_fare) pests.push('Fare');
          if (nextFormData.hedef_hasere_sican) pests.push('Sıçan');
          if (nextFormData.hedef_hasere_diger && nextFormData.hedef_hasere_diger_detay) pests.push(nextFormData.hedef_hasere_diger_detay);
          const pestsStr = pests.join(', ') || nextFormData.hedef_hasere;

          const customer = selectedAppForEk1 ? selectedAppForEk1.customer : selectedCustomerForDetail;
          if (customer) {
            nextFormData.uygulamalar_ve_gorusler = `${nextFormData.teknisyen_adi} refakatinde, Hamidiye Mahallesi 15034 Sokak No:4 F Edremit/Balıkesir adresinde faaliyet gösteren Körfez Danışmanlık İlaçlama Hizmetleri yetkilileri tarafından ${customer.unvan} firmasının/adresinin (${customer.adres}) ${nextFormData.yerin_turu || 'İşyeri'} alanlarında, hedef zararlı ${pestsStr} haşerelerine karşı ${data.commercialName} (${data.activeIngredient}) biyosidal ürünü ${nextFormData.uygulama_yontemi} yöntemiyle uygulanarak başarılı bir ilaçlama işlemi gerçekleştirilmiştir.`;
          }
          
          return nextFormData;
        });
      }

      fetchEk1Products();
    } catch (err) {
      setError(err.message);
    }
  };

  // Giderleri çek
  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/expenses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Giderler yüklenemedi.');
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Yeni gider ekle
  const handleAddExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!newExpenseData.amount || isNaN(newExpenseData.amount)) {
      setError('Lütfen geçerli bir tutar girin.');
      return;
    }
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newExpenseData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gider eklenemedi.');
      setSuccess('Gider başarıyla eklendi.');
      setShowAddExpenseModal(false);
      setNewExpenseData({
        date: getTodayString(),
        category: '🚗 Araç Yakıt / Benzin',
        explanation: '',
        amount: ''
      });
      fetchExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  // Gider sil
  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Bu gider kaydını tamamen silmek istediğinize emin misiniz?')) {
      return;
    }
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gider silinemedi.');
      setSuccess('Gider kaydı başarıyla silindi.');
      fetchExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  // Gider Raporunu Excel Olarak Dışa Aktar
  const exportExpensesToExcel = (expensesToExport) => {
    if (!expensesToExport || expensesToExport.length === 0) {
      alert('Dışa aktarılacak gider kaydı bulunamadı.');
      return;
    }
    
    let şml = '<?şml version="1.0" encoding="utf-8"?>\n';
    şml += '<?mso-application progid="Excel.Sheet"?>\n';
    şml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
    şml += ' xmlns:o="urn:schemas-microsoft-com:office:microsoft"\n';
    şml += ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n';
    şml += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n';
    şml += ' xmlns:html="http://www.w3.org/TR/REC-html40">\n';
    
    şml += ' <Styles>\n';
    şml += '  <Style ss:ID="Default" ss:Name="Normal">\n';
    şml += '   <Alignment ss:Vertical="Bottom"/>\n';
    şml += '   <Borders/>\n';
    şml += '   <Font ss:FontName="Calibri" x:CharSet="162" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>\n';
    şml += '   <Interior/>\n';
    şml += '   <NumberFormat/>\n';
    şml += '   <Protection/>\n';
    şml += '  </Style>\n';
    
    şml += '  <Style ss:ID="Header">\n';
    şml += '   <Font ss:FontName="Calibri" x:CharSet="162" x:Family="Swiss" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>\n';
    şml += '   <Interior ss:Color="#3B82F6" ss:Pattern="Solid"/>\n';
    şml += '   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>\n';
    şml += '   <Borders>\n';
    şml += '    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#1D4ED8"/>\n';
    şml += '   </Borders>\n';
    şml += '  </Style>\n';
    
    şml += '  <Style ss:ID="Title">\n';
    şml += '   <Font ss:FontName="Calibri" x:CharSet="162" x:Family="Swiss" ss:Size="14" ss:Bold="1" ss:Color="#1D4ED8"/>\n';
    şml += '   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>\n';
    şml += '  </Style>\n';
    
    şml += '  <Style ss:ID="Zebra">\n';
    şml += '   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>\n';
    şml += '  </Style>\n';
    
    şml += '  <Style ss:ID="Currency">\n';
    şml += '   <NumberFormat ss:Format="#,##0.00\ &quot;TRY&quot;"/>\n';
    şml += '  </Style>\n';
    
    şml += '  <Style ss:ID="ZebraCurrency">\n';
    şml += '   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>\n';
    şml += '   <NumberFormat ss:Format="#,##0.00\ &quot;TRY&quot;"/>\n';
    şml += '  </Style>\n';
    şml += ' </Styles>\n';
    
    const monthStr = selectedExpenseMonth ? `${selectedExpenseMonth} Dönemi` : 'Tüm Dönemler';
    şml += ` <Worksheet ss:Name="Gider Raporu">\n`;
    şml += '  <Table>\n';
    
    şml += '   <Column ss:Width="100"/>\n'; // Tarih
    şml += '   <Column ss:Width="150"/>\n'; // Kategori
    şml += '   <Column ss:Width="300"/>\n'; // Harcama Detayı
    şml += '   <Column ss:Width="120"/>\n'; // Tutar
    
    şml += '   <Row ss:Height="35">\n';
    şml += `    <Cell ss:StyleID="Title" ss:MergeAcross="3"><Data ss:Type="String">KÖRFEZ İLAÇLAMA - FİNANS VE GİDER RAPORU (${monthStr})</Data></Cell>\n`;
    şml += '   </Row>\n';
    
    şml += '   <Row ss:Height="10"/>\n';
    
    şml += '   <Row ss:Height="24" ss:StyleID="Header">\n';
    şml += '    <Cell><Data ss:Type="String">Harcama Tarihi</Data></Cell>\n';
    şml += '    <Cell><Data ss:Type="String">Harcama Kategorisi</Data></Cell>\n';
    şml += '    <Cell><Data ss:Type="String">Açıklama / Detay</Data></Cell>\n';
    şml += '    <Cell><Data ss:Type="String">Tutar (TL)</Data></Cell>\n';
    şml += '   </Row>\n';
    
    let totalSum = 0;
    expensesToExport.forEach((exp, idx) => {
      const isZebra = idx % 2 === 1;
      const style = isZebra ? ' ss:StyleID="Zebra"' : '';
      const currStyle = isZebra ? ' ss:StyleID="ZebraCurrency"' : ' ss:StyleID="Currency"';
      
      const expDate = new Date(exp.date).toLocaleDateString('tr-TR');
      const category = exp.category || 'Diğer';
      const explanation = exp.explanation || '-';
      const amount = exp.amount || 0;
      totalSum += amount;
      
      şml += `   <Row ss:Height="20">\n`;
      şml += `    <Cell${style}><Data ss:Type="String">${expDate}</Data></Cell>\n`;
      şml += `    <Cell${style}><Data ss:Type="String">${category}</Data></Cell>\n`;
      şml += `    <Cell${style}><Data ss:Type="String">${explanation}</Data></Cell>\n`;
      şml += `    <Cell${currStyle}><Data ss:Type="Number">${amount}</Data></Cell>\n`;
      şml += '   </Row>\n';
    });
    
    // Toplam Satırı
    şml += '   <Row ss:Height="22">\n';
    şml += '    <Cell ss:MergeAcross="2" ss:StyleID="Zebra"><Data ss:Type="String">TOPLAM HARCAMA</Data></Cell>\n';
    şml += `    <Cell ss:StyleID="ZebraCurrency"><Data ss:Type="Number">${totalSum}</Data></Cell>\n`;
    şml += '   </Row>\n';
    
    şml += '  </Table>\n';
    şml += ' </Worksheet>\n';
    şml += '</Workbook>\n';
    
    const blob = new Blob([şml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Korfez_Ilaclama_Gider_Raporu_${selectedExpenseMonth || 'Tum_Donemler'}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // İlaç kütüphanesi ve aylık rapor tetikleyicisi
  useEffect(() => {
    if (token) {
      fetchEk1Products();
      fetchMonthlyReports();
      if (user && user.role === 'admin') {
        fetchExpenses();
      }
    }
  }, [token, user]);

  // Müşterinin EK-1 evraklarını çek
  const fetchCustomerEk1Docs = async (customerId) => {
    try {
      const response = await fetch(`${API_URL}/api/ek1/customer/${customerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Evraklar yüklenemedi.');
      setEk1Docs(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Müşterinin tüm randevu planlarını çek
  const fetchCustomerAppointments = async (customerId) => {
    try {
      const response = await fetch(`${API_URL}/api/appointments?customerId=${customerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Randevular yüklenemedi.');
      setCustomerAppointments(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Yeni randevu ekle (Müşteri Detay ekranından)
  const handleAddAppointment = async (e) => {
    e.preventDefault();
    if (!newAppDate) {
      setError('Lütfen bir randevu tarihi seçin.');
      return;
    }

    let finalDate = newAppDate;
    const ilce = (selectedCustomerForDetail.konum || "").split(" / ")[1] || selectedCustomerForDetail.adres || "";
    if (ilce) {
      try {
        const res = await fetch(`${API_URL}/api/appointments/suggest-date?ilce=${encodeURIComponent(ilce)}&t=${Date.now()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const d = await res.json();
        if (d.suggestion && d.suggestion !== newAppDate) {
          const msg = `Dikkat: ${ilce} ve yakın bölgesinde ${d.suggestion} tarihinde ${d.count} randevunuz var. Yol optimizasyonu için bu randevuyu da o güne almak ister misiniz? (Tamam'a basarsanız tarih otomatik olarak o günle değişecek ve kaydedilecektir.)`;
          if (window.confirm(msg)) {
            finalDate = d.suggestion;
            setNewAppDate(finalDate);
          }
        }
      } catch (err) {
        console.error("Öneri alınamadı:", err);
      }
    }

    if (!window.confirm('Bu randevuyu kaydetmek istediğinize emin misiniz?')) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerId: selectedCustomerForDetail.id,
          date: finalDate,
          time: newAppTime,
          notes: newAppNotes
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Randevu atanamadı.');
      
      const savedDate = newAppDate;
      
      setSuccess('Randevu başarıyla oluşturuldu.');
      setNewAppDate('');
      setNewAppTime('12:00');
      setNewAppNotes('');
      fetchCustomerEk1Docs(selectedCustomerForDetail.id);
      fetchCustomerAppointments(selectedCustomerForDetail.id);
      
      // Günlük çalışma listesine yönlendir ve eklenen randevu tarihini seç
      setSelectedDate(savedDate);
      setActiveTab('daily_plan');
    } catch (err) {
      setError(err.message);
    }
  };

  // Günlük Plandan Hızlı Randevu Ekleme
  const handleQuickAppSubmit = async (e) => {
    e.preventDefault();
    if (!quickAppCustomerId) {
      setError('Lütfen bir müşteri seçin.');
      return;
    }
    
    let finalDate = quickAppDate;
    const selectedCustomer = customers.find(c => c.id === parseInt(quickAppCustomerId));
    const ilce = (selectedCustomer?.konum || "").split(" / ")[1] || selectedCustomer?.adres || "";
    if (ilce) {
      try {
        const res = await fetch(`${API_URL}/api/appointments/suggest-date?ilce=${encodeURIComponent(ilce)}&t=${Date.now()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const d = await res.json();
        if (d.suggestion && d.suggestion !== quickAppDate) {
          const msg = `Dikkat: ${ilce} ve yakın bölgesinde ${d.suggestion} tarihinde ${d.count} randevunuz var. Yol optimizasyonu için bu randevuyu da o güne almak ister misiniz? (Tamam'a basarsanız tarih otomatik olarak o günle değişecek ve kaydedilecektir.)`;
          if (window.confirm(msg)) {
            finalDate = d.suggestion;
            setQuickAppDate(finalDate);
          }
        }
      } catch (err) {
        console.error("Öneri alınamadı:", err);
      }
    }

    if (!window.confirm('Bu randevuyu kaydetmek istediğinize emin misiniz?')) {
      return;
    }

    setError('');
    try {
      const response = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerId: quickAppCustomerId,
          date: finalDate,
          time: quickAppTime,
          notes: quickAppNotes
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Randevu atanamadı.');
      setSuccess('Randevu başarıyla oluşturuldu.');
      setShowQuickAppModal(false);
      fetchDailyAppointments(selectedDate);
      if (selectedCustomerForDetail && selectedCustomerForDetail.id === parseInt(quickAppCustomerId)) {
        fetchCustomerAppointments(selectedCustomerForDetail.id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Randevuyu iptal et ve veritabanından sil
  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Bu randevuyu tamamen iptal etmek ve takvimden silmek istediğinize emin misiniz?')) {
      return;
    }
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/appointments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Randevu iptal edilemedi.');
      setSuccess('Randevu başarıyla iptal edildi ve takvimden silindi.');
      fetchDailyAppointments(selectedDate);
      if (selectedCustomerForDetail) {
        fetchCustomerAppointments(selectedCustomerForDetail.id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Randevu Erteleme İşlemi (Modal içinden)
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleDate) {
      setError('Lütfen yeni bir tarih seçin.');
      return;
    }
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/appointments/${selectedAppForReschedule.id}/reschedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          newDate: rescheduleDate,
          newTime: rescheduleTime,
          reason: rescheduleReason
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Randevu ertelenemedi.');
      setSuccess('Randevu başarıyla ertelendi ve yeni tarihe aktarıldı.');
      setShowRescheduleModal(false);
      setSelectedAppForReschedule(null);
      setRescheduleDate('');
      setRescheduleTime('12:00');
      fetchDailyAppointments(selectedDate);
      if (selectedCustomerForDetail) {
        fetchCustomerAppointments(selectedCustomerForDetail.id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteEk1Product = async (id) => {
    if (!window.confirm('Bu ilacı kütüphaneden kalıcı olarak silmek istediğinize emin misiniz?')) return;
    try {
      const response = await fetch(`${API_URL}/api/ek1/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'İlaç silinemedi.');
      }
      setEk1Products(prev => prev.filter(p => p.id !== id));
      toastSuccess('İlaç başarıyla silindi.');
    } catch (err) {
      alert(err.message);
    }
  };

  // Yeni İlacı Doğrudan Kütüphaneye ve Seçili İlaçlara Ekleme İşlemi
  const handleAddNewProductInline = async () => {
    if (!ek1FormData.biyosidal_urun) {
      alert('Lütfen yeni ürünün ticari adını yazın.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/ek1/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          commercialName: ek1FormData.biyosidal_urun,
          licenseDate: ek1FormData.ruhsat_tarihi || '-',
          licenseNo: ek1FormData.ruhsat_sayisi || '-',
          method: ek1FormData.uygulama_sekli || 'Jel Noktalama',
          activeIngredient: ek1FormData.aktif_madde || '-',
          antidote: ek1FormData.antidotu || 'Semptomatik Tedavi',
          defaultQuantity: ek1FormData.urun_miktari || '10 gr'
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Yeni ilaç kaydedilemedi.');

      // Kütüphaneye ekle
      setEk1Products(prev => [...prev, data]);
      
      // Seçili ilaçlara ekle
      const current = ek1FormData.secili_urunler || [];
      const updatedProds = [...current, {
        commercialName: data.commercialName,
        licenseDate: data.licenseDate,
        licenseNo: data.licenseNo,
        method: data.method,
        activeIngredient: data.activeIngredient,
        antidote: data.antidote,
        defaultQuantity: data.defaultQuantity
      }];

      const first = updatedProds[0] || {};
      const nextFormData = {
        ...ek1FormData,
        secili_urunler: updatedProds,
        biyosidal_urun: first.commercialName || '',
        ruhsat_tarihi: first.licenseDate || '',
        ruhsat_sayisi: first.licenseNo || '',
        uygulama_sekli: first.method || '',
        uygulama_yontemi: first.method || '',
        aktif_madde: first.activeIngredient || '',
        antidotu: first.antidote || '',
        urun_miktari: first.defaultQuantity || ''
      };

      // Rapor metnini kararlı bir şekilde hesaplayalım
      const pests = [];
      if (nextFormData.hedef_hasere_yuruyen) pests.push('Yürüyen Haşere');
      if (nextFormData.hedef_hasere_ucan) pests.push('Uçan Haşere');
      if (nextFormData.hedef_hasere_fare) pests.push('Fare');
      if (nextFormData.hedef_hasere_sican) pests.push('Sıçan');
      if (nextFormData.hedef_hasere_diger && nextFormData.hedef_hasere_diger_detay) {
        pests.push(nextFormData.hedef_hasere_diger_detay);
      }
      const pestsStr = pests.join(', ') || 'Belirtilmeyen Haşere';

      let hasereTuruText = 'haşere';
      let uygulamaYontemText = 'ilaçlama';

      if (nextFormData.hedef_hasere_ucan && !nextFormData.hedef_hasere_yuruyen && !nextFormData.hedef_hasere_fare && !nextFormData.hedef_hasere_sican) {
        hasereTuruText = 'uçan haşere';
        uygulamaYontemText = 'U.L.V. Soğuk Sisleme Püskürtme';
      } else if ((nextFormData.hedef_hasere_fare || nextFormData.hedef_hasere_sican) && !nextFormData.hedef_hasere_yuruyen && !nextFormData.hedef_hasere_ucan) {
        hasereTuruText = 'kemirgen (fare/sıçan)';
        uygulamaYontemText = 'yem istasyonları kurulumu ve yemleme';
      } else if (nextFormData.hedef_hasere_yuruyen && !nextFormData.hedef_hasere_ucan && !nextFormData.hedef_hasere_fare && !nextFormData.hedef_hasere_sican) {
        hasereTuruText = 'yürüyen haşere (hamam böceği)';
        uygulamaYontemText = 'jel noktalama';
      } else {
        hasereTuruText = pestsStr.toLowerCase();
        uygulamaYontemText = nextFormData.uygulama_yontemi || 'ilaçlama';
      }

      const urunlerStr = updatedProds.map(p => `${p.commercialName} (${p.activeIngredient || ''})`).join(', ') || data.commercialName || 'biyosidal';
      const yontemlerList = Array.from(new Set(updatedProds.map(p => p.method).filter(Boolean)));
      const yontemlerStr = yontemlerList.join(' / ') || uygulamaYontemText;

      const customer = selectedAppForEk1 ? selectedAppForEk1.customer : selectedCustomerForDetail;
      if (customer) {
        const reportText = `Ömür Karabacak refakatinde, Hamidiye Mahallesi 15034 Sokak No:4 F Edremit/Balıkesir adresinde faaliyet gösteren Körfez Danışmanlık İlaçlama Hizmetleri yetkilileri tarafından ${customer.unvan} firmasının/adresinin (${customer.adres}) ${nextFormData.yerin_turu || 'İşyeri'} alanlarında, hedef zararlı ${hasereTuruText} türlerine karşı ${urunlerStr} biyosidal ürünü/ürünleri kullanılarak ${yontemlerStr} yöntemi ile ilaçlama uygulaması başarıyla tamamlanmıştır.`;
        nextFormData.uygulamalar_ve_gorusler = reportText;
      }

      setEk1FormData(nextFormData);

      // Modu kapat
      setIsNewBiocideMode(false);
      alert('Yeni ilaç başarıyla kütüphaneye eklendi ve seçildi!');
    } catch (err) {
      alert('İlaç ekleme hatası: ' + err.message);
    }
  };

  // EK-1 Raporu ve İmza Kaydetme İşlemi
  const handleEk1Submit = async (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const signatureImage = canvas.toDataURL('image/png');
    
    let signatureEkipImage = savedEkipSignature;
    if (!savedEkipSignature || changeEkipSignature) {
      const ekipCanvas = ekipCanvasRef.current;
      if (ekipCanvas) {
        signatureEkipImage = ekipCanvas.toDataURL('image/png');
        localStorage.setItem('saved_ekip_signature', signatureEkipImage);
        setSavedEkipSignature(signatureEkipImage);
        setChangeEkipSignature(false);
      }
    }

    setError('');
    try {
      let finalBiocide = {
        biyosidal_urun: ek1FormData.biyosidal_urun,
        ruhsat_tarihi: ek1FormData.ruhsat_tarihi || '',
        ruhsat_sayisi: ek1FormData.ruhsat_sayisi || '',
        uygulama_sekli: ek1FormData.uygulama_sekli || '',
        uygulama_yontemi: ek1FormData.uygulama_yontemi || '',
        aktif_madde: ek1FormData.aktif_madde,
        antidotu: ek1FormData.antidotu || '',
        urun_miktari: ek1FormData.urun_miktari
      };

      if (isNewBiocideMode) {
        // Yeni ilacı kütüphaneye arka planda ekleyelim
        const prodResponse = await fetch(`${API_URL}/api/ek1/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            commercialName: ek1FormData.biyosidal_urun,
            licenseDate: ek1FormData.ruhsat_tarihi,
            licenseNo: ek1FormData.ruhsat_sayisi,
            method: ek1FormData.uygulama_sekli,
            activeIngredient: ek1FormData.aktif_madde,
            antidote: ek1FormData.antidotu || 'Semptomatik Tedavi',
            defaultQuantity: ek1FormData.urun_miktari
          })
        });
        const savedProd = await prodResponse.json();
        if (!prodResponse.ok) throw new Error(savedProd.error || 'Yeni ilaç kaydedilemedi.');
        
        // Kaydedilen yeni ilacı payload'a ve form durumlarına geçir
        finalBiocide = {
          biyosidal_urun: savedProd.commercialName,
          ruhsat_tarihi: savedProd.licenseDate || '',
          ruhsat_sayisi: savedProd.licenseNo || '',
          uygulama_sekli: savedProd.method || '',
          uygulama_yontemi: savedProd.method || '',
          aktif_madde: savedProd.activeIngredient,
          antidotu: savedProd.antidote || '',
          urun_miktari: savedProd.defaultQuantity
        };

        // Kütüphaneyi güncelleyelim ve yeni ilaç modunu kapatalım
        fetchEk1Products();
        setIsNewBiocideMode(false);
      }

      const pests = [];
      if (ek1FormData.hedef_hasere_yuruyen) pests.push('Yürüyen Haşere');
      if (ek1FormData.hedef_hasere_ucan) pests.push('Uçan Haşere');
      if (ek1FormData.hedef_hasere_fare) pests.push('Fare');
      if (ek1FormData.hedef_hasere_sican) pests.push('Sıçan');
      if (ek1FormData.hedef_hasere_diger) {
        pests.push(ek1FormData.hedef_hasere_diger_detay || 'Diğer');
      }
      const compiledHedefHasere = pests.join(', ') || ek1FormData.hedef_hasere || 'Belirtilmedi';

      const payload = {
        appointmentId: selectedAppForEk1 ? selectedAppForEk1.id : null,
        customerId: selectedAppForEk1 ? selectedAppForEk1.customer_id : selectedCustomerForDetail.id,
        documentData: {
          hedef_hasere: compiledHedefHasere,
          hedef_hasere_yuruyen: ek1FormData.hedef_hasere_yuruyen || false,
          hedef_hasere_ucan: ek1FormData.hedef_hasere_ucan || false,
          hedef_hasere_fare: ek1FormData.hedef_hasere_fare || false,
          hedef_hasere_sican: ek1FormData.hedef_hasere_sican || false,
          hedef_hasere_diger: ek1FormData.hedef_hasere_diger || false,
          hedef_hasere_diger_detay: ek1FormData.hedef_hasere_diger_detay || '',
          
          secili_urunler: JSON.stringify(ek1FormData.secili_urunler || []), // Çoklu ilaç listesini kaydet
          biyosidal_urun: finalBiocide.biyosidal_urun,
          ruhsat_tarihi: finalBiocide.ruhsat_tarihi,
          ruhsat_sayisi: finalBiocide.ruhsat_sayisi,
          uygulama_sekli: finalBiocide.uygulama_sekli,
          uygulama_yontemi: finalBiocide.uygulama_yontemi,
          aktif_madde: finalBiocide.aktif_madde,
          antidotu: finalBiocide.antidotu,
          urun_miktari: finalBiocide.urun_miktari,
          
          yerin_turu: ek1FormData.yerin_turu || 'İşyeri',
          yerin_turu_daire: ek1FormData.yerin_turu_daire || '',
          saat_baslangic: ek1FormData.saat_baslangic || '',
          saat_bitis: ek1FormData.saat_bitis || '',
          uygulama_alani: ek1FormData.uygulama_alani || '',
          yem_istasyonu_sayisi: ek1FormData.yem_istasyonu_sayisi || '',
          
          uygulamalar_ve_gorusler: ek1FormData.uygulamalar_ve_gorusler || '',
          oneriler: ek1FormData.oneriler || '',
          
          teknisyen_adi: ek1FormData.teknisyen_adi || user.name,
          uygulayicilar: (ek1FormData.uygulayicilar || []).join(', '),
          mesul_mudur: MESUL_MUDUR,
          customer_email: ek1FormData.customer_email || '',
          
          signature_image: signatureImage,
          signature_ekip: signatureEkipImage
        }
      };

      const response = await fetch(`${API_URL}/api/ek1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'EK-1 belgesi kaydedilemedi.');
      
      if (data._email_status === 'failed') {
        setSuccess(`EK-1 Raporu kaydedildi ancak e-posta GÖNDERİLEMEDİ! Hata: ${data._email_error}`);
      } else if (ek1FormData.customer_email && ek1FormData.customer_email.trim() !== '') {
        setSuccess('EK-1 Raporu başarıyla oluşturuldu ve müşteriye e-posta olarak gönderildi.');
      } else {
        setSuccess('EK-1 Raporu sisteme başarıyla kaydedildi. (E-posta adresi girilmediği için mail gönderilmedi.)');
      }
      setShowEk1Modal(false);
      setSelectedAppForEk1(null);
      clearCanvas();
      if (ekipCanvasRef.current) clearEkipCanvas();
      
      if (activeTab === 'daily_plan') {
        fetchDailyAppointments(selectedDate);
      }
      if (selectedCustomerForDetail) {
        fetchCustomerEk1Docs(selectedCustomerForDetail.id);
        fetchCustomerAppointments(selectedCustomerForDetail.id);
      }
      fetchMonthlyReports();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFaturaKesClick = () => {
    setSuccess('🧾 Aylık Fatura Kesme Entegrasyon Modülü Yakında Aktif Edilecektir! (Talep Üzerine Sonra Yapılacaktır)');
  };

  // İmza Alanı Çizim Mantığı
  const canvasRef = useRef(null);
  const ekipCanvasRef = useRef(null);
  const [savedEkipSignature, setSavedEkipSignature] = useState(localStorage.getItem('saved_ekip_signature') || '');
  const [changeEkipSignature, setChangeEkipSignature] = useState(false);
  const isDrawing = useRef(false);

  const startDrawing = (e) => {
    const canvas = e.target;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#10B981';
    
    isDrawing.current = true;
    const pos = getEventPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = e.target;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pos = getEventPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const getEventPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const clearEkipCanvas = () => {
    const canvas = ekipCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Tarih Şeridi İçin Gün Üretici
  const getDaysArray = () => {
    const arr = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 3);
    
    const weekdayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    
    for (let i = 0; i < 8; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i); 
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      arr.push({
        dateString,
        dayNum: d.getDate(),
        dayName: weekdayNames[d.getDay()]
      });
    }
    return arr;
  };

  // ==========================================
  // API İŞLEMLERİ (FETCH CALLS)
  // ==========================================

  // 1. Giriş Yap (Google API olana kadar hızlı şifresiz e-posta doğrulama köprüsü)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/api/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, name: emailInput === 'admin@example.com' ? 'Yönetici Ömür' : 'Teknisyen Ahmet' })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Giriş yapılamadı.');
      }

      // Oturumu kaydet
      localStorage.setItem('hasere_token', data.token);
      localStorage.setItem('hasere_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setSuccess('Başarıyla giriş yapıldı!');
    } catch (err) {
      setError(err.message);
    }
  };

  // 2. Çıkış Yap
  const handleLogout = () => {
    localStorage.removeItem('hasere_token');
    localStorage.removeItem('hasere_user');
    setToken('');
    setUser(null);
    setCustomers([]);
    setSuccess('Güvenli çıkış yapıldı.');
  };

  // 3. Müşteri Listesini Çek
  const fetchCustomers = async () => {
    try {
      const url = searchQuery 
        ? `${API_URL}/api/customers?search=${encodeURIComponent(searchQuery)}`
        : `${API_URL}/api/customers`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Müşteriler yüklenemedi.');
      }

      setCustomers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // 4. Müşteri Ekle
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setError('');

    const vNo = formData.vergi_no ? formData.vergi_no.trim() : '';
    if (!formData.unvan) {
      setError('Lütfen müşteri / işletme adını giriniz.');
      return;
    }
    if (!formData.konum) {
      setError('Lütfen il/ilçe (konum) bilgisini giriniz.');
      return;
    }
    if (!formData.telefon || formData.telefon.length !== 11) {
      setError('Lütfen 11 haneli telefon numarasını eksiksiz giriniz. (Örn: 05551234567)');
      return;
    }
    if (!formData.adres) {
      setError('Lütfen açık adres bilgisini giriniz.');
      return;
    }
    if (!formData.uygulama_tipi) {
      setError('Lütfen uygulama tipi seçiniz.');
      return;
    }

    

    try {
      const response = await fetch(`${API_URL}/api/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Müşteri eklenemedi.');
      }

      setSuccess('Yeni müşteri başarıyla eklendi.');
      setShowAddModal(false);
      // Formu sıfırla
      setFormData({
        unvan: '',
        vergi_no: '',
      konum: '',
        telefon: '',
        adres: '',
        uygulama_tipi: 'Kapalı Alan',
        email: ''
      });
      fetchCustomers();
    } catch (err) {
      setError(err.message);
    }
  };

  // 5. Müşteri Güncelle
  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    setError('');

    const vNo = formData.vergi_no ? formData.vergi_no.trim() : '';
    if (!formData.unvan) {
      setError('Lütfen müşteri / işletme adını giriniz.');
      return;
    }
    if (!formData.konum) {
      setError('Lütfen il/ilçe (konum) bilgisini giriniz.');
      return;
    }
    if (!formData.telefon || formData.telefon.length !== 11) {
      setError('Lütfen 11 haneli telefon numarasını eksiksiz giriniz. (Örn: 05551234567)');
      return;
    }
    if (!formData.adres) {
      setError('Lütfen açık adres bilgisini giriniz.');
      return;
    }
    if (!formData.uygulama_tipi) {
      setError('Lütfen uygulama tipi seçiniz.');
      return;
    }

    

    try {
      const response = await fetch(`${API_URL}/api/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Müşteri güncellenemedi.');
      }

      setSuccess('Müşteri başarıyla güncellendi.');
      setShowEditModal(false);
      fetchCustomers();
    } catch (err) {
      setError(err.message);
    }
  };

  // 6. Müşteri Sil
  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Bu müşteriyi veritabanından silmek istediğinize emin misiniz?')) return;
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/customers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Müşteri silinemedi.');
      }

      setSuccess('Müşteri başarıyla silindi.');
      fetchCustomers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Düzenleme Modalı Açma Yardımcısı
  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      unvan: customer.unvan,
      vergi_no: customer.vergi_no || '',
        konum: customer.konum || '',
      telefon: customer.telefon,
      adres: customer.adres,
      uygulama_tipi: customer.uygulama_tipi,
      email: customer.email || ''
    });
    setShowEditModal(true);
  };

  // EK-1 Raporlama Modalı Açma Yardımcısı
  const openEk1ModalHelper = (app = null) => {
    setSelectedAppForEk1(app);
    
    const customer = app ? app.customer : selectedCustomerForDetail;
    if (!customer) {
      setError('Müşteri bilgisi yüklenemedi.');
      return;
    }
    
    // Mevcut saati al
    const now = new Date();
    const currentHour = String(now.getHours()).padStart(2, '0');
    const currentMinute = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHour}:${currentMinute}`;
    
    // Bitiş saatini 30 dakika sonrası olarak ayarla
    const endNow = new Date(now.getTime() + 30 * 60000);
    const endHour = String(endNow.getHours()).padStart(2, '0');
    const endMinute = String(endNow.getMinutes()).padStart(2, '0');
    const endTimeStr = `${endHour}:${endMinute}`;
    
    // Hiçbir ilaç seçili gelmeyecek
    const defaultProduct = null;

    const initialReport = `Ömür Karabacak refakatinde, Hamidiye Mahallesi 15034 Sokak No:4 F Edremit/Balıkesir adresinde faaliyet gösteren Körfez Danışmanlık İlaçlama Hizmetleri yetkilileri tarafından ${customer.unvan} adresinde (${customer.adres}) hedef zararlı Hamam Böceği haşeresine karşı gerekli biyosidal ürünler kullanılarak ilaçlama uygulaması başarıyla tamamlanmıştır.`;

    setEk1FormData({
      teknisyen_adi: 'Ömür Karabacak',
      uygulayicilar: [], // Hiçbir uygulayıcı otomatik seçili gelmeyecek
      mesul_mudur: MESUL_MUDUR,
      hedef_hasere: 'Hamam Böceği',
      hedef_hasere_yuruyen: true,
      hedef_hasere_ucan: false,
      hedef_hasere_fare: false,
      hedef_hasere_sican: false,
      hedef_hasere_diger: false,
      hedef_hasere_diger_detay: '',
      
      secili_urunler: [], // Hiçbir ilaç seçili gelmesin
      biyosidal_urun: '',
      ruhsat_tarihi: '',
      ruhsat_sayisi: '',
      uygulama_sekli: '',
      uygulama_yontemi: '',
      aktif_madde: '',
      antidotu: '',
      urun_miktari: '',
      customer_email: customer.email || '',
      
      yerin_turu: 'İşyeri',
      yerin_turu_daire: '',
      saat_baslangic: currentTimeStr,
      saat_bitis: endTimeStr,
      uygulama_alani: '100',
      yem_istasyonu_sayisi: '',
      
      uygulamalar_ve_gorusler: initialReport,
      oneriler: 'Uygulama sonrasında alan en az 2 saat havalandırılmalı, gıda maddeleri açıkta bırakılmamalıdır. Temizlik kurallarına uyulmalıdır.'
    });
    
    setIsNewBiocideMode(false);
    setChangeEkipSignature(false);
    setShowEk1Modal(true);
  };

  // ==========================================
  // GÖRÜNÜM (JSŞ RENDER)
  // ==========================================

  // Eğer Giriş Yapılmadıysa GİRİŞ EKRANINI göster
  if (!user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            Körfez <span>İlaçlama</span>
          </div>
          <div className="login-tagline">
            Biyosidal Ürün Uygulama ve EK-1 Belgelendirme Mobil Yönetim Sistemi
          </div>

          {error && <div className="toast toast-error">{error}</div>}
          {success && <div className="toast toast-success">{success}</div>}

          {/* Test Giriş Seçeneği */}
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">E-Posta Adresi (Google/Gmail)</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="Örn: admin@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ marginBottom: '15px' }}>
              Giriş Yap (Test)
            </button>
          </form>

          <div className="mock-login-divider">YA DA GOOGLE İLE GİRİŞ</div>

          {/* Google ile Giriş Butonu Görsel ŞŞablonu */}
          <button 
            type="button" 
            className="btn btn-google"
            onClick={() => {
              // Canlı entegrasyonda google login penceresini tetikler
              setError('Google Client ID henüz yapılandırılmadı. Lütfen yukarıdaki e-posta girişini kullanarak test edin. (Tüm e-postalar kabul edilir, limit 5 kişidir).');
            }}
          >
            <svg style={{ width: '18px', height: '18px', marginRight: '8px' }} viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ile Giriş Yap
          </button>

          <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            * Sisteme ilk giriş yapan e-posta adresi otomatik olarak <strong>YÖNETİCİ</strong> yetkisine sahip olur.
          </div>
        </div>
      </div>
    );
  }

  // Giriş Yapıldıysa ANA UYGULAMAYI göster
  return (
    <div className="app-container">
      
      {/* 1. Üst Başlık (Header - Mobilde Görünür) */}
      <header className="app-header">
        <div className="app-logo">
          Körfez <span>İlaçlama</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          
          {/* Bildirim Zili */}
          <div style={{ position: 'relative' }} ref={notificationsRef}>
            <button 
              className="action-btn" 
              style={{ position: 'relative', background: showNotificationsDropdown ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)', color: showNotificationsDropdown ? '#fff' : 'var(--text-color)' }}
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              title="Bildirimler"
            >
              <IconBell />
              {notifications.filter(n => !n.is_read).length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  border: '2px solid var(--bg-dark)'
                }}>
                  {notifications.filter(n => !n.is_read).length}
                </span>
              )}
            </button>
            
            {/* Bildirim Dropdown Paneli */}
            {showNotificationsDropdown && (
              <div style={{
                position: 'absolute',
                top: '45px',
                right: '0',
                width: '320px',
                maxHeight: '400px',
                background: 'rgba(30, 41, 59, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                overflowY: 'auto',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>Bildirimler</h3>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {notifications.filter(n => !n.is_read).length > 0 && (
                      <button 
                        onClick={markAllNotificationsAsRead}
                        style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                      >
                        Tümünü Okundu İşaretle
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearAllNotifications}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                        title="Tüm bildirimleri sil"
                      >
                        Temizle
                      </button>
                    )}
                  </div>
                </div>
                
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Henüz bildiriminiz yok.
                    </div>
                  ) : (
                    notifications.map(notification => {
                      const isUnread = !notification.read_by_users?.includes(user?.id);
                      return (
                        <div 
                          key={notification.id} 
                          onClick={() => {
                            if (isUnread) markNotificationAsRead(notification.id);
                          }}
                          style={{
                            padding: '12px',
                            background: isUnread ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                            border: '1px solid',
                            borderColor: isUnread ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                            borderRadius: '12px',
                            cursor: isUnread ? 'pointer' : 'default',
                            transition: 'all 0.2s',
                            opacity: isUnread ? 1 : 0.7
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <strong style={{ fontSize: '0.85rem', color: isUnread ? '#38bdf8' : '#e2e8f0' }}>{notification.title}</strong>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {new Date(notification.created_at).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            {notification.message}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.8rem' }} className="user-profile-box">
            <div className="user-name">{user.name}</div>
            <div className="user-role-badge">{user.role === 'admin' ? 'YÖNETİCİ' : 'TEKNİSYEN'}</div>
          </div>
          <button onClick={handleLogout} className="action-btn action-btn-danger" title="Çıkış Yap">
            <IconLogOut />
          </button>
        </div>
      </header>
      {/* 2. Sol/Alt Menü (Navigation) */}
      <nav className="mobile-nav">
        {/* Masaüstü için Navigasyon En Üstünde Profil & Çıkış Kutusu (Körfez İlaçlama Yazısının Hemen Altında) */}
        <div className="desktop-profile-wrapper" style={{ margin: '0 0 25px 0', padding: '0 10px' }}>
          <div className="user-profile-box" style={{ width: '100%', display: 'flex', position: 'static', background: 'rgba(255, 255, 255, 0.05)', boxShadow: 'none' }}>
            <div className="user-avatar" style={{ flexShrink: 0 }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'Y'}
            </div>
            <div className="user-details" style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
              <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div className="user-role-badge">{user.role === 'admin' ? 'YÖNETİCİ' : 'TEKNİSYEN'}</div>
            </div>
            <button 
              onClick={handleLogout} 
              className="action-btn action-btn-danger" 
              title="Çıkış Yap"
              style={{ padding: '6px', flexShrink: 0 }}
            >
              <IconLogOut />
            </button>
          </div>
        </div>

        <button 
          className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('customers');
            setSelectedCustomerForDetail(null);
          }}
        >
          <IconUsers />
          <span>Müşteriler</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'daily_plan' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('daily_plan');
          }}
        >
          <IconCalendar />
          <span>Günlük Plan</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('dashboard');
          }}
        >
          <IconDashboard />
          <span>Özet Rapor</span>
        </button>

        {user && user.role === 'admin' && (
          <button 
            className={`nav-item ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('expenses');
            }}
          >
            <IconExpenses />
            <span>Finans & Giderler</span>
          </button>
        )}

        <button 
          className={`nav-item ${activeTab === 'pest_control' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('pest_control');
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span>Pest Kontrol</span>
        </button>

        <div style={{ flexGrow: 1 }}></div>

        <button 
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}
          onClick={() => {
            setActiveTab('settings');
          }}
        >
          <IconSettings />
          <span>Ayarlar</span>
        </button>
      </nav>

       {/* Hata ve Başarı Popupları */}
       <div style={{ position: 'fixed', top: '25px', left: '280px', right: '20px', zIndex: '9999' }}>
         {error && <div className="toast toast-error">{error}</div>}
         {success && <div className="toast toast-success">{success}</div>}
       </div>

      {/* 3. Ana İçerik Alanı (Main Panels) */}
      <main className="main-content">
        
        {/* TEMA 5: PEST KONTROL (KROKİ VE İSTASYON TAKİBİ) SEKME GÖRÜNÜMÜ */}
        {activeTab === 'pest_control' && (
          <PestControlPanel customers={customers} token={token} user={user} />
        )}

        {/* AYARLAR SEKME GÖRÜNÜMÜ */}
        {activeTab === 'settings' && (
          <div>
            <h1 className="section-title">Ayarlar ⚙️</h1>
            <p className="section-subtitle">Sistem tercihlerinizi ve bildirim ayarlarınızı buradan yönetebilirsiniz.</p>
            
            <div style={{ background: '#1E293B', padding: '30px', borderRadius: '24px', border: '1px solid #334155', maxWidth: '600px', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconBell /> Sistem Bildirimleri
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#94A3B8' }}>
                    Yeni iş atamaları, görev tamamlanma ve erteleme durumlarında bildirim almayı {notificationsEnabled ? 'kapatın' : 'açın'}.
                  </p>
                </div>
                
                {/* Modern Toggle Switch */}
                <label style={{ position: 'relative', display: 'inline-block', width: '56px', height: '32px' }}>
                  <input 
                    type="checkbox" 
                    checked={notificationsEnabled}
                    onChange={(e) => updatePreferences(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: notificationsEnabled ? 'var(--primary)' : '#475569',
                    transition: '.4s',
                    borderRadius: '34px',
                    boxShadow: notificationsEnabled ? '0 0 10px rgba(56, 189, 248, 0.4)' : 'none'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '24px',
                      width: '24px',
                      left: notificationsEnabled ? '28px' : '4px',
                      bottom: '4px',
                      backgroundColor: 'white',
                      transition: '.4s',
                      borderRadius: '50%',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TEMA 1: MÜŞTERİLER SEKME GÖRÜNÜMÜ */}
        {activeTab === 'customers' && (
          selectedCustomerForDetail ? (
            /* ==========================================
               MÜŞTERİ DETAY GÖRÜNÜMÜ (MÜŞTERİNİN KENDİ SEKME ALANI)
               ========================================== */
            <div>
              <button className="back-btn" onClick={() => setSelectedCustomerForDetail(null)}>
                👤 Müşteri Portföyüne Geri Dön
              </button>
              
              <h1 className="section-title">{selectedCustomerForDetail.unvan}</h1>
              <p className="section-subtitle">Müşteri detay kartı ve geçmiş biyosidal işlem takipleri.</p>

              <div className="detail-grid">
                {/* Sol Sütun: Müşteri Künyesi ve EK-1 Arşivi */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Bilgi Kartı */}
                  <div className="detail-card">
                    <h2 className="detail-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}><IconUsers /> Müşteri Bilgileri</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                      {selectedCustomerForDetail.vergi_no && (
                        <div className="customer-info-row">
                          <IconFile />
                          <span>Vergi/TC No: <strong>{selectedCustomerForDetail.vergi_no}</strong></span>
                        </div>
                      )}
                      <div className="customer-info-row">
                        <IconPhone />
                        <span>Telefon: <strong>{selectedCustomerForDetail.telefon}</strong></span>
                      </div>
                      <div className="customer-info-row">
                        <IconMapPin />
                        <span>Adres: {selectedCustomerForDetail.adres}</span>
                      </div>
                      <div className="customer-info-row">
                        <IconFileText />
                        <span>Uygulama Tipi: <strong>{selectedCustomerForDetail.uygulama_tipi}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* EK-1 Belgeleri Geçmişi */}
                  <div className="detail-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                      <h2 className="detail-title" style={{ margin: 0, padding: 0, border: 'none' }}><IconFileText /> EK-1 Evrak Geçmişi</h2>
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={() => openEk1ModalHelper()}
                        style={{ width: 'auto' }}
                      >
                        <IconPlus /> Yeni EK-1 Oluştur
                      </button>
                    </div>
                    
                    {ek1Docs.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 10px', color: '#94A3B8', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                        <IconFileText />
                        <p style={{ fontSize: '0.85rem', marginTop: '10px' }}>Bu müşteriye ait geçmiş dijital EK-1 evrakı bulunamadı.</p>
                      </div>
                    ) : (
                      <div className="document-archive-list">
                        {ek1Docs.map(doc => (
                          <div key={doc.id} className="document-archive-item">
                            <div className="archive-meta">
                              <span>Evrak No: #EK1-{doc.id}</span>
                              <span>{new Date(doc.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="archive-pest">📄 {doc.hedef_hasere} İlaçlaması</div>
                            <div className="archive-details">
                              <div>Kullanılan Ürün: <strong>{doc.biyosidal_urun}</strong> ({doc.aktif_madde})</div>
                              <div>Yöntem & Miktar: {doc.uygulama_yontemi} - {doc.urun_miktari}</div>
                              <div>Uygulayan Teknisyen: {doc.teknisyen_adi}</div>
                            </div>
                            {doc.signature_image && (
                              <div className="archive-signature-preview">
                                <span>Müşteri Imzası:</span>
                                <img src={doc.signature_image} alt="İmza" className="archive-signature-img" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Sağ Sütun: Randevu Oluşturma Aracı ve Geçmiş Planlar */}
                <div>
                  <div className="detail-card">
                    <h2 className="detail-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}><IconCalendar /> Randevu Programı Oluştur</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', marginTop: '10px' }}>
                      Müşteriye ileri bir tarihte periyodik ilaçlama görevi atamak için tarih belirleyin.
                    </p>

                    <form onSubmit={handleAddAppointment}>
                      <div className="form-grid-2col">
                        <div>
                          <label className="input-label">Uygulama Tarihi *</label>
                          <input 
                            type="date" 
                            required 
                            className="form-input" 
                            value={newAppDate}
                            onChange={(e) => setNewAppDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="input-label">Uygulama Saati *</label>
                          <input 
                            type="time" 
                            required 
                            className="form-input" 
                            value={newAppTime}
                            onChange={(e) => setNewAppTime(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="input-group">
                        <label className="input-label">Ziyaret / Uygulama Notları</label>
                        <textarea 
                          className="form-input"
                          rows="3"
                          style={{ resize: 'none' }}
                          placeholder="İlaçlama öncesi veya alanla ilgili özel notlar..."
                          value={newAppNotes}
                          onChange={(e) => setNewAppNotes(e.target.value)}
                        />
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                        <IconPlus /> Randevu Programı Kaydet
                      </button>
                    </form>
                  </div>

                  {/* Müşteri Randevu Geçmişi & Planları */}
                  <div className="detail-card" style={{ marginTop: '20px' }}>
                    <h2 className="detail-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px' }}>
                      <IconClock /> Randevu Geçmişi & Planları
                    </h2>
                    {customerAppointments.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94A3B8', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                        <IconCalendar />
                        <p style={{ fontSize: '0.85rem', marginTop: '10px' }}>Bu müşteriye ait planlanmış aktif randevu bulunmuyor.</p>
                      </div>
                    ) : (
                      <div className="customer-appointment-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
                        {customerAppointments.map(app => {
                          const appDateStr = new Date(app.date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                          return (
                            <div key={app.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 15px', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 'bold', color: '#F8FAFC' }}>
                                  <span style={{ color: 'var(--accent)' }}>📅 {appDateStr}</span>
                                  <span style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '8px', fontSize: '0.75rem' }}>⏰ {app.time || '12:00'}</span>
                                </div>
                                <span className={`customer-badge ${app.status === 'completed' ? 'badge-completed' : 'badge-pending'}`} style={{ fontSize: '0.7rem', margin: 0, padding: '2px 6px' }}>
                                  {app.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                                </span>
                              </div>
                              {app.notes && (
                                <div style={{ fontSize: '0.75rem', color: '#CBD5E1', background: 'rgba(0,0,0,0.12)', padding: '6px 10px', borderRadius: '8px', borderLeft: '2px solid var(--accent)' }}>
                                  {app.notes}
                                </div>
                              )}
                              {app.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                                  <button 
                                    type="button"
                                    className="btn-small btn-action-warning" 
                                    style={{ padding: '4px 8px', fontSize: '0.7rem', borderRadius: '8px', flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}
                                    onClick={() => {
                                      setSelectedAppForReschedule(app);
                                      setRescheduleDate(app.date);
                                      setRescheduleTime(app.time || '12:00');
                                      setRescheduleReason('Hava Muhalefeti (Yağmur/Rüzgar)');
                                      setShowRescheduleModal(true);
                                    }}
                                  >
                                    ⏰ Ertele
                                  </button>
                                  <button 
                                    type="button"
                                    className="btn-small btn-action-success"
                                    style={{ padding: '4px 8px', fontSize: '0.7rem', borderRadius: '8px', flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}
                                    onClick={() => openEk1ModalHelper(app)}
                                  >
                                    📄 EK-1 Raporu
                                  </button>
                                  <button 
                                    type="button"
                                    className="btn-small" 
                                    style={{ padding: '4px 8px', fontSize: '0.7rem', borderRadius: '8px', flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: 'var(--error)' }}
                                    onClick={() => handleCancelAppointment(app.id)}
                                  >
                                    ÜR İptal
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ==========================================
               MÜŞTERİ LİSTELEME GÖRÜNÜMÜ
               ========================================== */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h1 className="section-title">Müşteri Portföyü</h1>
                  <p className="section-subtitle">Toplam {customers.length} kayıtlı müşteri veritabanında saklanıyor.</p>
                </div>
                
                {user.role === 'admin' && (
                  <button 
                    onClick={() => setShowAddModal(true)} 
                    className="btn btn-primary" 
                    style={{ width: 'auto' }}
                  >
                    <IconPlus /> Yeni Müşteri
                  </button>
                )}
              </div>

              {/* Arama ve Filtreleme */}
              <div className="controls-bar">
                <div className="search-wrapper" style={{ maxWidth: '100%' }}>
                  <IconSearch />
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Müşteri unvanı, telefon veya adrese göre ara..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
              </div>

              {/* Müşteri Listesi (Grid Görünüm) */}
              {customers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8', background: '#1E293B', borderRadius: '24px', border: '1px solid #334155' }}>
                  <IconUsers />
                  <h3 style={{ marginTop: '15px', color: '#F8FAFC' }}>Müşteri Bulunamadı</h3>
                  <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                    {searchQuery ? 'Arama kriterlerinize uygun müşteri kaydı yok.' : 'Henüz veritabanına müşteri kaydedilmemiş.'}
                  </p>
                </div>
              ) : (
                <div className="card-grid">
                  {customers.map((c) => (
                    <div 
                      key={c.id} 
                      className="customer-card" 
                      onClick={() => setSelectedCustomerForDetail(c)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div>
                        <div className="customer-unvan">{c.unvan}</div>
                        
                        {c.vergi_no && (
                          <div className="customer-info-row">
                            <IconFile />
                            <span>Vergi/TC No: <strong>{c.vergi_no}</strong></span>
                          </div>
                        )}

                        <div className="customer-info-row">
                          <IconPhone />
                          <span>Telefon: <strong>{c.telefon}</strong></span>
                        </div>

                        <div className="customer-info-row">
                          <IconMapPin />
                          <span>Adres: {c.adres}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="customer-badge">{c.uygulama_tipi}</span>
                        
                        {/* Sadece ADMİN düzenleyebilir ve silebilir */}
                        {user.role === 'admin' && (
                          <div className="customer-actions">
                            <button 
                              className="action-btn" 
                              title="Düzenle"
                              onClick={(e) => { e.stopPropagation(); openEditModal(c); }}
                            >
                              <IconEdit />
                            </button>
                            <button 
                              className="action-btn action-btn-danger" 
                              title="Sil"
                              onClick={(e) => { e.stopPropagation(); handleDeleteCustomer(c.id); }}
                            >
                              <IconTrash />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
 
        {/* TEMA 2: GÜNLÜK İŞ LİSTESİ ÇALIŞMA PLANI SEKME GÖRÜNÜMÜ */}
        {activeTab === 'daily_plan' && (
          <div>
            <h1 className="section-title">Günlük Çalışma Planı</h1>
            <p className="section-subtitle">
              Seçilen tarihte sahada yapılması planlanan ilaçlama uygulamaları ve iş listesi.
            </p>

            {/* Tarih Şeridi ve Takvim Seçici */}
            <div className="date-strip-container">
              <div className="date-strip">
                {getDaysArray().map(day => (
                  <div 
                    key={day.dateString}
                    className={`date-card ${selectedDate === day.dateString ? 'active' : ''}`}
                    onClick={() => setSelectedDate(day.dateString)}
                  >
                    <span className="date-card-day-num">{day.dayNum}</span>
                    <span className="date-card-day-name">{day.dayName}</span>
                  </div>
                ))}
              </div>
              
              <div className="calendar-picker-wrapper" title="Başka Tarih Seç" style={{ position: 'relative', overflow: 'hidden', marginLeft: '10px' }}>
                <button className="calendar-picker-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--primary)', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>
                  <IconCalendar /> Tarih Seç 📅
                </button>
                <input 
                  id="hidden-date-picker"
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    opacity: 0, 
                    cursor: 'pointer' 
                  }}
                />
              </div>
            </div>

            {/* Seçili Tarih Başlığı ve Hava Durumu */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <h3 style={{ color: '#F8FAFC', margin: 0 }}>
                  📅 {new Date(selectedDate).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Toplam {dailyAppointments.length} Görev Planlı
                </span>
                <button 
                  className="btn btn-primary btn-small"
                  onClick={() => {
                    setQuickAppDate(selectedDate);
                    setQuickAppTime('12:00');
                    setQuickAppNotes('');
                    setQuickAppCustomerId(customers.length > 0 ? customers[0].id : '');
                    setShowQuickAppModal(true);
                  }}
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <IconPlus /> Randevu Ekle
                </button>
              </div>
            </div>

            {/* Görev Kartları Listesi */}
            {dailyAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748B', background: 'transparent', border: '1px dashed #334155', borderRadius: '16px' }}>
                <div style={{ width: '40px', height: '40px', margin: '0 auto', opacity: 0.4 }}>
                  <IconCalendar />
                </div>
                <h3 style={{ marginTop: '12px', color: '#94A3B8', fontSize: '1.1rem', fontWeight: '500' }}>İş Planı Boş</h3>
                <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                  Bu tarihte planlanmış bir ilaçlama çalışması bulunmuyor.
                </p>
              </div>
            ) : (
              <div className="card-grid">
                {dailyAppointments.map((app) => (
                  <div key={app.id} className="compact-job-card">
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--accent)', padding: '3px 8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                            <IconClock /> {app.time || '12:00'}
                          </span>
                          <WeatherBadge date={app.date} address={app.customer?.adres} konum={app.customer?.konum} />
                        </div>
                        <span className={`customer-badge ${
                          app.status === 'completed' ? 'badge-completed' : 'badge-pending'
                        }`} style={{ margin: 0, padding: '3px 8px', fontSize: '0.75rem' }}>
                          {app.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                        </span>
                      </div>

                      <div className="customer-unvan" style={{ margin: '0 0 10px 0', fontSize: '1.15rem' }}>{app.customer.unvan}</div>

                      {app.notes && (
                        <div style={{ background: 'rgba(0,0,0,0.15)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '12px', borderLeft: '3px solid var(--accent)' }}>
                          {app.notes}
                        </div>
                      )}

                      <div className="customer-info-row">
                        <IconPhone />
                        <span>Telefon: <strong>{app.customer.telefon}</strong></span>
                      </div>

                      <div className="customer-info-row">
                        <IconMapPin />
                        <span>Adres: {app.customer.adres}</span>
                      </div>
                      
                      <div className="customer-info-row">
                        <IconFileText />
                        <span>Tip: <strong>{app.customer.uygulama_tipi}</strong></span>
                      </div>
                    </div>

                    {/* Görev Eylemleri */}
                    <div className="job-card-actions" style={{ marginTop: '10px', paddingTop: '10px', display: 'flex', gap: '5px' }}>
                      {app.status === 'pending' ? (
                        <>
                          <button 
                            className="btn-small btn-action-success"
                            onClick={() => openEk1ModalHelper(app)}
                          >
                            <IconFileText /> EK-1 Gönder
                          </button>
                          
                          <button 
                            className="btn-small btn-action-warning"
                            onClick={() => {
                              setSelectedAppForReschedule(app);
                              setRescheduleDate(selectedDate);
                              setRescheduleTime(app.time || '12:00');
                              setRescheduleReason('Hava Muhalefeti (Yağmur/Rüzgar)');
                              setShowRescheduleModal(true);
                            }}
                          >
                            ⏰ Ertele
                          </button>

                          <button 
                            className="btn-small btn-action-info"
                            onClick={handleFaturaKesClick}
                          >
                            🧾 Fatura Kes
                          </button>

                          <button 
                            className="btn-small"
                            onClick={() => handleCancelAppointment(app.id)}
                            style={{ padding: '10px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: 'var(--error)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            <IconTrash /> İşi İptal Et
                          </button>
                        </>
                      ) : (
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '5px' }}>
                          <span>✓ Görev başarıyla tamamlandı.</span>
                          {app.ek1_id && (
                            <button 
                              className="btn-small btn-secondary"
                              onClick={async () => {
                                try {
                                  const response = await fetch(`${API_URL}/api/ek1/customer/${app.customer_id}`, {
                                    headers: { 'Authorization': `Bearer ${token}` }
                                  });
                                  const docs = await response.json();
                                  const doc = docs.find(d => d.id === app.ek1_id);
                                  if (doc) setViewingEk1Doc(doc);
                                  else setError('Evrak detayı bulunamadı.');
                                } catch (err) {
                                  setError('Yüklenemedi.');
                                }
                              }}
                              style={{ padding: '6px 12px' }}
                            >
                              Evrağı Gör
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
 
        {/* TEMA 3: ÖZET RAPOR / DASHBOARD SEKME GÖRÜNÜMÜ */}
        {activeTab === 'dashboard' && (() => {
          // Aylık filtreye göre yapılan işleri hesapla
          const filteredReports = monthlyReports.filter(rep => {
            const matchesMonth = !selectedReportMonth || rep.donem === selectedReportMonth;
            const matchesSearch = !searchReportQuery || rep.customer.unvan.toLowerCase().includes(searchReportQuery.toLowerCase()) || (rep.customer.adres && rep.customer.adres.toLowerCase().includes(searchReportQuery.toLowerCase()));
            return matchesMonth && matchesSearch;
          });

          // Müşteri bazlı ziyaret sayaçlarını hesapla
          const customerVisitCounts = {};
          filteredReports.forEach(rep => {
            const name = rep.customer.unvan;
            customerVisitCounts[name] = (customerVisitCounts[name] || 0) + 1;
          });

          return (
            <div>
              <h1 className="section-title">Firma Yönetim Paneli</h1>
              <p className="section-subtitle">Körfez İlaçlama iş planı, ilaç kütüphanesi ve aylık hizmet raporları.</p>

              {/* Stat Kartları */}
              <div className="card-grid" style={{ marginBottom: '30px' }}>
                <div className="customer-card">
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Toplam Müşteri</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent)', margin: '8px 0' }}>
                    {customers.length}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>Kayıtlı aktif firma/mesken sayısı.</p>
                </div>

                <div className="customer-card">
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Aylık Toplam Ziyaret</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#F59E0B', margin: '8px 0' }}>
                    {filteredReports.length}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>Seçili aydaki tamamlanan toplam iş.</p>
                </div>

                <div className="customer-card">
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>İlaç Kütüphanesi</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#10B981', margin: '8px 0' }}>
                    {ek1Products.length}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>Sistemde kayıtlı biyosidal ürün sayısı.</p>
                </div>
              </div>

              {/* İlaç Kütüphanesi Paneli */}
              <div style={{ background: '#1E293B', border: '1px solid #334155', padding: '25px', borderRadius: '24px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🏢 Aktif İlaç Kütüphanesi
                  </h2>
                  {user.role === 'admin' && (
                    <button 
                      className="btn btn-primary btn-small"
                      onClick={() => setShowAddBiocideModal(true)}
                      style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <IconPlus /> Yeni İlaç Ekle
                    </button>
                  )}
                </div>

                <div style={{ overflow: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: '#CBD5E1', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #334155', color: '#94A3B8' }}>
                        <th style={{ padding: '10px' }}>Ürün Ticari Adı</th>
                        <th style={{ padding: '10px' }}>Ruhsat Tarih / No</th>
                        <th style={{ padding: '10px' }}>Aktif Madde</th>
                        <th style={{ padding: '10px' }}>Uygulama Şekli</th>
                        <th style={{ padding: '10px' }}>Antidotu</th>
                        <th style={{ padding: '10px' }}>Birim Miktar</th>
                        {user.role === 'admin' && <th style={{ padding: '10px', textAlign: 'right' }}>İşlem</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {ek1Products.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '10px', fontWeight: 'bold', color: '#F8FAFC' }}>{p.commercialName}</td>
                          <td style={{ padding: '10px' }}>{p.licenseDate} <br/><span style={{ fontSize: '0.75rem', color: '#64748B' }}>{p.licenseNo}</span></td>
                          <td style={{ padding: '10px', color: 'var(--accent)' }}>{p.activeIngredient}</td>
                          <td style={{ padding: '10px' }}>{p.method}</td>
                          <td style={{ padding: '10px' }}>{p.antidote}</td>
                          <td style={{ padding: '10px', fontWeight: 'bold' }}>{p.defaultQuantity}</td>
                          {user.role === 'admin' && (
                            <td style={{ padding: '10px', textAlign: 'right' }}>
                              <button 
                                onClick={() => handleDeleteEk1Product(p.id)}
                                style={{ background: '#EF4444', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}
                                title="İlacı Sil"
                              >
                                <IconTrash /> Sil
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Raporlama Paneli */}
              <div style={{ background: '#1E293B', border: '1px solid #334155', padding: '25px', borderRadius: '24px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📊 Aylık Yapılan İşler Raporu
                  </h2>
                  <button 
                    onClick={() => exportToExcel(filteredReports)}
                    className="btn"
                    style={{ width: 'auto', padding: '8px 16px', fontSize: '0.82rem', background: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  >
                    📄 Excel Raporu İndir
                  </button>
                </div>

                {/* Filtreler */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label className="input-label">Dönem / Ay Seçin</label>
                    <input 
                      type="month" 
                      className="form-input"
                      value={selectedReportMonth}
                      onChange={(e) => setSelectedReportMonth(e.target.value)}
                    />
                  </div>
                  <div style={{ flex: '2', minWidth: '250px' }}>
                    <label className="input-label">Müşteri / Firma Ara</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Firma unvanına göre filtreleyin..."
                      value={searchReportQuery}
                      onChange={(e) => setSearchReportQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Ziyaret Sayaçları Özet Kutusu */}
                <div style={{ background: '#0F172A', border: '1px solid #334155', padding: '15px', borderRadius: '16px', marginBottom: '25px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#F59E0B', fontSize: '0.9rem' }}>🏢 Müşteri Bazlı Aylık Ziyaret Sayıları</h4>
                  {Object.keys(customerVisitCounts).length === 0 ? (
                    <span style={{ fontSize: '0.85rem', color: '#64748B', fontStyle: 'italic' }}>Bu dönemde yapılmış kayıtlı ziyaret bulunmamaktadır.</span>
                  ) : (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {Object.entries(customerVisitCounts).map(([name, count]) => (
                        <div key={name} style={{ background: '#1E293B', padding: '8px 12px', borderRadius: '10px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.05)', color: '#E2E8F0' }}>
                          🏢 <strong>{name}</strong>: <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{count} Ziyaret</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Yapılan İşler Detay Tablosu */}
                <div style={{ overflow: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: '#CBD5E1', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #334155', color: '#94A3B8' }}>
                        <th style={{ padding: '12px' }}>Tarih / Saat</th>
                        <th style={{ padding: '12px' }}>Müşteri Unvanı / Adres</th>
                        <th style={{ padding: '12px' }}>Hedef Zararlı</th>
                        <th style={{ padding: '12px' }}>Kullanılan Ürün</th>
                        <th style={{ padding: '12px' }}>Uygulayıcı</th>
                        <th style={{ padding: '12px' }}>İmza</th>
                        <th style={{ padding: '12px', textAlignment: 'right' }}>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ padding: '30px 10px', textAlignment: 'center', color: '#64748B', fontStyle: 'italic' }}>
                            Arama kriterlerine uygun tamamlanmış görev kaydı bulunamadı.
                          </td>
                        </tr>
                      ) : (
                        filteredReports.map(rep => (
                          <tr key={rep.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '12px' }}>
                              <strong>{new Date(rep.completed_at).toLocaleDateString('tr-TR')}</strong>
                              <br/><span style={{ fontSize: '0.75rem', color: '#64748B' }}>{rep.scheduled_time || '12:00'}</span>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <strong style={{ color: '#F8FAFC' }}>{rep.customer.unvan}</strong>
                              <br/><span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{rep.customer.adres}</span>
                            </td>
                            <td style={{ padding: '12px', color: '#F59E0B', fontWeight: 'bold' }}>{rep.hedef_hasere}</td>
                            <td style={{ padding: '12px' }}>
                              {rep.biyosidal_urun}
                              <br/><span style={{ fontSize: '0.75rem', color: '#64748B' }}>{rep.aktif_madde} / {rep.urun_miktari}</span>
                            </td>
                            <td style={{ padding: '12px' }}>{rep.uygulayicilar || rep.teknisyen_adi}</td>
                            <td style={{ padding: '12px' }}>
                              {rep.signature_image ? (
                                <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✍️ İmzalı</span>
                              ) : (
                                <span style={{ color: 'var(--error)' }}>❌ İmzasız</span>
                              )}
                            </td>
                            <td style={{ padding: '12px' }}>
                              <button 
                                className="btn-small btn-secondary"
                                onClick={async () => {
                                  try {
                                    const response = await fetch(`${API_URL}/api/ek1/customer/${rep.customer.id}`, {
                                      headers: { 'Authorization': `Bearer ${token}` }
                                    });
                                    const docs = await response.json();
                                    const doc = docs.find(d => d.id === rep.ek1_id);
                                    if (doc) setViewingEk1Doc(doc);
                                    else setError('Evrak detayı yüklenemedi.');
                                  } catch (err) {
                                    setError('Hata oluştu.');
                                  }
                                }}
                                style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                              >
                                Evrağı Gör
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Yönetici Notu */}
              <div style={{ background: '#1E293B', border: '1px solid #334155', padding: '25px', borderRadius: '24px' }}>
                <h3>Yönetici Notu</h3>
                <p style={{ color: '#94A3B8', marginTop: '10px', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  Hoş geldiniz <strong>{user.name}</strong>! Bu sistem Körfez İlaçlama firmasına özel, ekibinizin dijital form doldurma işlerini hızlandırmak amacıyla tasarlanmıştır. 
                  Yönetici panelinden yeni ilaçlar tanımlayabilir, aylık yapılan ziyaret raporlarını ve imzalı resmi belgeleri filtreleyerek görüntüleyebilirsiniz.
                  Sahadaki teknisyenleriniz sadece iş planını görebilir ve tamamlanan işler için EK-1 formu doldurabilir. Müşteri ekleme/silme ve ilaç kütüphanesini düzenleme yetkisi tamamen size aittir.
                </p>
              </div>
            </div>
          );
        })()}
 
        {/* TEMA 4: FİNANS & GİDERLER SEKME GÖRÜNÜMÜ */}
        {activeTab === 'expenses' && user && user.role === 'admin' && (() => {
          // Giderleri filtrele
          const filteredExpenses = expenses.filter(exp => {
            const matchesMonth = !selectedExpenseMonth || exp.date.startsWith(selectedExpenseMonth);
            const matchesSearch = !searchExpenseQuery || 
              (exp.explanation && exp.explanation.toLowerCase().includes(searchExpenseQuery.toLowerCase())) ||
              (exp.category && exp.category.toLowerCase().includes(searchExpenseQuery.toLowerCase()));
            return matchesMonth && matchesSearch;
          });

          // Toplam harcamayı hesapla
          const totalExpenseAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

          // Kategorilere göre harcama dağılımını hesapla
          const categoryTotals = {};
          filteredExpenses.forEach(exp => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
          });

          return (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h1 className="section-title">Finans ve Gider Yönetimi 💰</h1>
                  <p className="section-subtitle">Araç yakıt, ekipman, parça, muhasebe ve diğer tüm işletme giderlerinin takibi.</p>
                </div>
                <button 
                  onClick={() => setShowAddExpenseModal(true)} 
                  className="btn btn-primary" 
                  style={{ width: 'auto' }}
                >
                  <IconPlus /> Yeni Gider Ekle
                </button>
              </div>

              {/* İstatistik Kartları */}
              <div className="card-grid" style={{ marginBottom: '30px' }}>
                <div className="customer-card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#94A3B8' }}>Toplam Harcama</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#3B82F6', margin: '8px 0' }}>
                    {totalExpenseAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>Seçili aydaki toplam gider miktarı.</p>
                </div>

                <div className="customer-card">
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#94A3B8' }}>En Çok Harcanan Kategori</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#EF4444', margin: '12px 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {Object.keys(categoryTotals).length > 0 
                      ? Object.entries(categoryTotals).reduce((max, curr) => curr[1] > max[1] ? curr : max)[0] 
                      : 'Kayıt Yok'}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>Bu ay en fazla giderin olduğu alan.</p>
                </div>

                <div className="customer-card">
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#94A3B8' }}>Gider Kalemleri</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#10B981', margin: '8px 0' }}>
                    {filteredExpenses.length}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>Seçili dönemde girilen harcama adedi.</p>
                </div>
              </div>

              {/* Kategori Dağılımı Bar Grafiksel Görünüm */}
              <div style={{ background: '#1E293B', border: '1px solid #334155', padding: '25px', borderRadius: '24px', marginBottom: '30px' }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#F8FAFC' }}>📑 Kategorilere Göre Harcama Dağılımı</h3>
                {Object.keys(categoryTotals).length === 0 ? (
                  <div style={{ color: '#64748B', fontStyle: 'italic', fontSize: '0.9rem' }}>Bu dönemde yapılmış kayıtlı harcama bulunmamaktadır.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {Object.entries(categoryTotals).map(([cat, amount]) => {
                      const percentage = totalExpenseAmount > 0 ? (amount / totalExpenseAmount) * 100 : 0;
                      return (
                        <div key={cat}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '5px' }}>
                            <span>{cat}</span>
                            <span style={{ fontWeight: 'bold' }}>{amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div style={{ height: '8px', background: '#0F172A', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${percentage}%`, background: '#3B82F6', borderRadius: '4px' }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Gider Tablosu ve Filtreler */}
              <div style={{ background: '#1E293B', border: '1px solid #334155', padding: '25px', borderRadius: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🏷️ Harcama Kayıtları
                  </h2>
                  <button 
                    onClick={() => exportExpensesToExcel(filteredExpenses)}
                    className="btn"
                    style={{ width: 'auto', padding: '8px 16px', fontSize: '0.82rem', background: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  >
                    📄 Excel Raporu İndir
                  </button>
                </div>

                {/* Filtreler */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label className="input-label">Dönem / Ay Seçin</label>
                    <input 
                      type="month" 
                      className="form-input"
                      value={selectedExpenseMonth}
                      onChange={(e) => setSelectedExpenseMonth(e.target.value)}
                    />
                  </div>
                  <div style={{ flex: '2', minWidth: '250px' }}>
                    <label className="input-label">Açıklama / Kategori Ara</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Harcama detaylarına göre filtreleyin..."
                      value={searchExpenseQuery}
                      onChange={(e) => setSearchExpenseQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Tablo */}
                <div style={{ overflow: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: '#CBD5E1', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #334155', color: '#94A3B8' }}>
                        <th style={{ padding: '12px' }}>Tarih</th>
                        <th style={{ padding: '12px' }}>Kategori</th>
                        <th style={{ padding: '12px' }}>Açıklama / Detay</th>
                        <th style={{ padding: '12px' }}>Tutar (TL)</th>
                        <th style={{ padding: '12px', textAlignment: 'right' }}>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ padding: '30px 10px', textAlignment: 'center', color: '#64748B', fontStyle: 'italic' }}>
                            Arama kriterlerine uygun harcama kaydı bulunamadı.
                          </td>
                        </tr>
                      ) : (
                        filteredExpenses.map(exp => (
                          <tr key={exp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '12px' }}>
                              <strong>{new Date(exp.date).toLocaleDateString('tr-TR')}</strong>
                            </td>
                            <td style={{ padding: '12px', color: '#3B82F6', fontWeight: 'bold' }}>{exp.category}</td>
                            <td style={{ padding: '12px', color: '#F8FAFC' }}>{exp.explanation}</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>
                              {exp.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                            </td>
                            <td style={{ padding: '12px' }}>
                              <button 
                                className="action-btn action-btn-danger"
                                onClick={() => handleDeleteExpense(exp.id)}
                                title="Sil"
                                style={{ padding: '4px 8px' }}
                              >
                                <IconTrash />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}
 
      </main>

      {/* ==========================================
         POPUPLAR (MODAL FORMLAR)
         ========================================== */}

      {/* POPUP 1: YENİ MÜŞTERİ EKLEME FORMU (Sadece Admin görebilir) */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Yeni Müşteri Ekle</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <IconClose />
              </button>
            </div>

            <form onSubmit={handleAddCustomer}>
              <div className="input-group">
                <label className="input-label">Müşteri Unvanı / Adı *</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="Örn: Körfez Otelcilik Tic. A.Ş.."
                  value={formData.unvan}
                  onChange={(e) => setFormData({ ...formData, unvan: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Vergi No / TC No</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="10 Haneli Vergi No veya 11 Haneli TC"
                  value={formData.vergi_no}
                  onChange={(e) => setFormData({ ...formData, vergi_no: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Telefon Numarası *</label>
                <input 
                  type="tel" 
                  required 
                  className="form-input" 
                  placeholder="Örn: 0555 123 4567"
                  value={formData.telefon}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                    setFormData({ ...formData, telefon: val });
                  }}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Müşteri E-posta Adresi</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="Örn: musteri@gmail.com (Otomatik EK-1 gönderimi için)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Açık Adres *</label>
                <textarea 
                  required 
                  className="form-input" 
                  rows="3" 
                  style={{ resize: 'none' }}
                  placeholder="Sokak, Mahalle, Bina No, İlçe / İl"
                  value={formData.adres}
                  onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Konum (İl / İlçe) *</label>
                <input 
                  type="text" 
                  required
                  className="form-input" 
                  placeholder="Örn: Edremit / Balıkesir"
                  value={formData.konum}
                  onChange={(e) => setFormData({ ...formData, konum: e.target.value })}
                />
              </div>


              <div className="input-group">
                <label className="input-label">Uygulama Alanı Tipi *</label>
                <select 
                  className="form-input"
                  value={formData.uygulama_tipi}
                  onChange={(e) => setFormData({ ...formData, uygulama_tipi: e.target.value })}
                >
                  <option value="Kapalı Alan">Kapalı Alan (Mesken, İşyeri vb.)</option>
                  <option value="Açık Alan">Açık Alan (Bahçe, Tarla, Sokak vb.)</option>
                  <option value="Açık ve Kapalı Alan">Hem Açık Hem Kapalı Alan</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Vazgeç
                </button>
                <button type="submit" className="btn btn-primary">
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP 2: MÜŞTERİ GÜNCELLEME/DÜZENLEME FORMU (Sadece Admin görebilir) */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Müşteri Bilgilerini Düzenle</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                <IconClose />
              </button>
            </div>

            <form onSubmit={handleUpdateCustomer}>
              <div className="input-group">
                <label className="input-label">Müşteri Unvanı / Adı *</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  value={formData.unvan}
                  onChange={(e) => setFormData({ ...formData, unvan: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Vergi No / TC No</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.vergi_no}
                  onChange={(e) => setFormData({ ...formData, vergi_no: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Telefon Numarası *</label>
                <input 
                  type="tel" 
                  required 
                  className="form-input" 
                  value={formData.telefon}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                    setFormData({ ...formData, telefon: val });
                  }}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Müşteri E-posta Adresi</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="Örn: musteri@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Açık Adres *</label>
                <textarea 
                  required 
                  className="form-input" 
                  rows="3" 
                  style={{ resize: 'none' }}
                  value={formData.adres}
                  onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Konum (İl / İlçe) *</label>
                <input 
                  type="text" 
                  required
                  className="form-input" 
                  placeholder="Örn: Edremit / Balıkesir"
                  value={formData.konum}
                  onChange={(e) => setFormData({ ...formData, konum: e.target.value })}
                />
              </div>


              <div className="input-group">
                <label className="input-label">Uygulama Alanı Tipi *</label>
                <select 
                  className="form-input"
                  value={formData.uygulama_tipi}
                  onChange={(e) => setFormData({ ...formData, uygulama_tipi: e.target.value })}
                >
                  <option value="Kapalı Alan">Kapalı Alan (Mesken, İşyeri vb.)</option>
                  <option value="Açık Alan">Açık Alan (Bahçe, Tarla, Sokak vb.)</option>
                  <option value="Açık ve Kapalı Alan">Hem Açık Hem Kapalı Alan</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Vazgeç
                </button>
                <button type="submit" className="btn btn-primary">
                  Güncellemeleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP 3: RANDEVU ERTELEME MODALI */}
      {showRescheduleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Randevuyu Ertele ⏰</h2>
              <button className="close-btn" onClick={() => { setShowRescheduleModal(false); setSelectedAppForReschedule(null); }}>
                <IconClose />
              </button>
            </div>

             <form onSubmit={handleRescheduleSubmit}>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(245, 158, 11, 0.25)', fontSize: '0.85rem', color: '#F59E0B', marginBottom: '20px' }}>
                çağ️ Ertelenen randevu bugünün listesinden silinip, seçtiğiniz yeni tarihe otomatik olarak eklenecektir.
              </div>

              <div className="form-grid-2col">
                <div>
                  <label className="input-label">Yeni Uygulama Tarihi *</label>
                  <input 
                    type="date" 
                    required 
                    className="form-input" 
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Yeni Uygulama Saati *</label>
                  <input 
                    type="time" 
                    required 
                    className="form-input" 
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Hızlı Erteleme Nedeni Seçin</label>
                <div className="quick-reasons-grid">
                  {['Hava Muhalefeti (Yağmur/Rüzgar)', 'Müşteri Talebi / Mekan Kapalı', 'Zaman Yetersizliği', 'Teknik / Cihaz Arızası'].map(reason => (
                    <button
                      key={reason}
                      type="button"
                      className={`quick-reason-btn ${rescheduleReason.startsWith(reason.substring(0, 5)) ? 'active' : ''}`}
                      onClick={() => setRescheduleReason(reason)}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Açıklama / Özel Not</label>
                <textarea 
                  className="form-input" 
                  rows="2"
                  style={{ resize: 'none' }}
                  placeholder="Erteleme ile ilgili ek bilgiler..."
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowRescheduleModal(false); setSelectedAppForReschedule(null); }}>
                  Vazgeç
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#F59E0B', color: '#0F172A', width: 'auto', marginLeft: 'auto' }}>
                  Tarihi Güncelle ve Ertele
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP 4: EK-1 BELGESİ DOLDURMA VE MOBİL İMZA MODALI */}
      {showEk1Modal && (() => {
        const customer = selectedAppForEk1 ? selectedAppForEk1.customer : selectedCustomerForDetail;

        const uniqueLicenseDates = Array.from(new Set(ek1Products.map(p => p.licenseDate).filter(Boolean)));
        const uniqueLicenseNos = Array.from(new Set(ek1Products.map(p => p.licenseNo).filter(Boolean)));
        const uniqueActiveIngredients = Array.from(new Set(ek1Products.map(p => p.activeIngredient).filter(Boolean)));
        const uniqueAntidotes = Array.from(new Set(ek1Products.map(p => p.antidote).filter(Boolean)));
        const uniqueMethods = Array.from(new Set(ek1Products.map(p => p.method).filter(Boolean)));
        const uniqueQuantities = Array.from(new Set(ek1Products.map(p => p.defaultQuantity).filter(Boolean)));

        // Ürün değiştiğinde ruhsat ve aktif maddeleri otomatik doldur
        const handleProductChange = (val) => {
          const prod = ek1Products.find(p => p.commercialName === val);
          if (prod) {
            setEk1FormData(prev => {
              const nextFormData = {
                ...prev,
                biyosidal_urun: val,
                ruhsat_tarihi: prod.licenseDate,
                ruhsat_sayisi: prod.licenseNo,
                uygulama_sekli: prod.method,
                uygulama_yontemi: prod.method,
                aktif_madde: prod.activeIngredient,
                antidotu: prod.antidote,
                urun_miktari: prod.defaultQuantity
              };
              
              // Rapor metnini de tetikleyelim
              const pests = [];
              if (nextFormData.hedef_hasere_yuruyen) pests.push('Yürüyen Haşere');
              if (nextFormData.hedef_hasere_ucan) pests.push('Uçan Haşere');
              if (nextFormData.hedef_hasere_fare) pests.push('Fare');
              if (nextFormData.hedef_hasere_sican) pests.push('Sıçan');
              if (nextFormData.hedef_hasere_diger && nextFormData.hedef_hasere_diger_detay) pests.push(nextFormData.hedef_hasere_diger_detay);
              const pestsStr = pests.join(', ') || nextFormData.hedef_hasere;

              nextFormData.uygulamalar_ve_gorusler = `${nextFormData.teknisyen_adi} refakatinde, Hamidiye Mahallesi 15034 Sokak No:4 F Edremit/Balıkesir adresinde faaliyet gösteren Körfez Danışmanlık İlaçlama Hizmetleri yetkilileri tarafından ${customer.unvan} firmasının/adresinin (${customer.adres}) ${nextFormData.yerin_turu || 'İşyeri'} alanlarında, hedef zararlı ${pestsStr} haşerelerine karşı ${val} (${nextFormData.aktif_madde}) biyosidal ürünü ${nextFormData.uygulama_yontemi} yöntemiyle uygulanarak başarılı bir ilaçlama işlemi gerçekleştirilmiştir.`;

              return nextFormData;
            });
          } else {
            setEk1FormData(prev => ({ ...prev, biyosidal_urun: val }));
          }
        };

        // Rapor metnini dinamik olarak yenileyen fonksiyon
        const refreshReportText = (customFormData = ek1FormData) => {
          const pests = [];
          if (customFormData.hedef_hasere_yuruyen) pests.push('Yürüyen Haşere');
          if (customFormData.hedef_hasere_ucan) pests.push('Uçan Haşere');
          if (customFormData.hedef_hasere_fare) pests.push('Fare');
          if (customFormData.hedef_hasere_sican) pests.push('Sıçan');
          if (customFormData.hedef_hasere_diger && customFormData.hedef_hasere_diger_detay) pests.push(customFormData.hedef_hasere_diger_detay);
          const pestsStr = pests.join(', ') || 'Belirtilmeyen Haşere';

          let hasereTuruText = 'haşere';
          let uygulamaYontemText = 'ilaçlama';

          if (customFormData.hedef_hasere_ucan && !customFormData.hedef_hasere_yuruyen && !customFormData.hedef_hasere_fare && !customFormData.hedef_hasere_sican) {
            hasereTuruText = 'uçan haşere';
            uygulamaYontemText = 'U.L.V. Soğuk Sisleme Püskürtme';
          } else if ((customFormData.hedef_hasere_fare || customFormData.hedef_hasere_sican) && !customFormData.hedef_hasere_yuruyen && !customFormData.hedef_hasere_ucan) {
            hasereTuruText = 'kemirgen (fare/sıçan)';
            uygulamaYontemText = 'yem istasyonları kurulumu ve yemleme';
          } else if (customFormData.hedef_hasere_yuruyen && !customFormData.hedef_hasere_ucan && !customFormData.hedef_hasere_fare && !customFormData.hedef_hasere_sican) {
            hasereTuruText = 'yürüyen haşere (hamam böceği)';
            uygulamaYontemText = 'jel noktalama';
          } else {
            hasereTuruText = pestsStr.toLowerCase();
            uygulamaYontemText = customFormData.uygulama_yontemi || 'ilaçlama';
          }

          // Seçilen tüm ilaçları ve aktif maddeleri virgülle birleştirelim
          const selectedProds = customFormData.secili_urunler || [];
          const urunlerStr = selectedProds.map(p => `${p.commercialName} (${p.activeIngredient || ''})`).join(', ') || customFormData.biyosidal_urun || 'biyosidal';
          const yontemlerList = Array.from(new Set(selectedProds.map(p => p.method).filter(Boolean)));
          const yontemlerStr = yontemlerList.join(' / ') || uygulamaYontemText;

          const text = `Ömür Karabacak refakatinde, Hamidiye Mahallesi 15034 Sokak No:4 F Edremit/Balıkesir adresinde faaliyet gösteren Körfez Danışmanlık İlaçlama Hizmetleri yetkilileri tarafından ${customer.unvan} firmasının/adresinin (${customer.adres}) ${customFormData.yerin_turu || 'İşyeri'} alanlarında, hedef zararlı ${hasereTuruText} türlerine karşı ${urunlerStr} biyosidal ürünü/ürünleri kullanılarak ${yontemlerStr} yöntemi ile ilaçlama uygulaması başarıyla tamamlanmıştır.`;

          setEk1FormData(prev => ({ ...prev, uygulamalar_ve_gorusler: text }));
        };

        return (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="modal-header">
                <h2 className="modal-title">📄 Resmi EK-1 Belgesi Düzenle</h2>
                <button className="close-btn" onClick={() => { setShowEk1Modal(false); setSelectedAppForEk1(null); clearCanvas(); }}>
                  <IconClose />
                </button>
              </div>

              <form onSubmit={handleEk1Submit}>
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '0.8rem', color: '#10B981', marginBottom: '20px', lineHeight: '1.4' }}>
                  ️ Bu form, A4 resmi standardına göre hazırlanmıştır. Tamamlandığında müşteriye otomatik e-posta gönderilecek ve A4 PDF olarak basılmaya hazır hale gelecektir.
                </div>

                {/* 1. UYGULAMAYI YAPANA AİT BİLGİLER */}
                <div style={{ borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '15px' }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 10px 0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    1. Uygulamayı Yapana Ait Bilgiler
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '10px' }}>
                    <div>Firma: <strong>Körfez Danışmanlık İlaçlama Hizmetleri Ltd. Şti.</strong></div>
                    <div>Adres: <strong>Hamidiye Mahallesi 15034 Sokak No:4 F Edremit/Balıkesir</strong></div>
                    <div>İzin No/Tarih: <strong>0061 / 21.09.2018</strong> | Tel: <strong>0266 373 4 333</strong></div>
                    <div>Mesul Müdür: <strong style={{ color: '#10B981' }}>{MESUL_MUDUR}</strong></div>
                  </div>

                  {/* Ekip Sorumlusu Seçimi (Sabit Ömür Karabacak) */}
                  <div className="input-group" style={{ marginBottom: '10px' }}>
                    <label className="input-label">Ekip Sorumlusu</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ background: 'rgba(0,0,0,0.15)', cursor: 'not-allowed' }}
                      readOnly
                      value="Ömür Karabacak"
                    />
                  </div>

                  {/* Uygulayıcılar - Çoktan Seçmeli */}
                  <div className="input-group" style={{ marginBottom: '10px' }}>
                    <label className="input-label">Uygulayıcılar (Çoktan Seçmeli) *</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      {applicatorsList.map(name => {
                        const isSelected = (ek1FormData.uygulayicilar || []).includes(name);
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              setEk1FormData(prev => {
                                const current = prev.uygulayicilar || [];
                                if (current.includes(name)) {
                                  return { ...prev, uygulayicilar: current.filter(n => n !== name) };
                                } else {
                                  return { ...prev, uygulayicilar: [...current, name] };
                                }
                              });
                            }}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '20px',
                              border: isSelected ? '2px solid #10B981' : '1px solid #475569',
                              background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(51, 65, 85, 0.4)',
                              color: isSelected ? '#10B981' : '#94A3B8',
                              fontSize: '0.78rem',
                              fontWeight: isSelected ? '700' : '500',
                              cursor: 'pointer',
                              fontFamily: 'var(--font-family)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {isSelected ? '✅ ' : ''}{name}
                          </button>
                        );
                      })}
                    </div>
                    {/* Seçili Uygulayıcılar Özeti */}
                    {(ek1FormData.uygulayicilar || []).length > 0 && (
                      <div style={{ fontSize: '0.75rem', color: '#10B981', marginBottom: '8px' }}>
                        Seçili: {(ek1FormData.uygulayicilar || []).join(', ')}
                      </div>
                    )}
                    {/* Yeni Uygulayıcı Ekleme */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Yeni uygulayıcı adı..."
                        value={newApplicatorInput}
                        onChange={(e) => setNewApplicatorInput(e.target.value)}
                        style={{ flex: 1, margin: 0 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const trimmed = newApplicatorInput.trim();
                          if (trimmed && !applicatorsList.includes(trimmed)) {
                            const updated = [...applicatorsList, trimmed];
                            setApplicatorsList(updated);
                            localStorage.setItem('hasere_applicators', JSON.stringify(updated));
                            setEk1FormData(prev => ({
                              ...prev,
                              uygulayicilar: [...(prev.uygulayicilar || []), trimmed]
                            }));
                            setNewApplicatorInput('');
                          }
                        }}
                      >
                        ➕ Ekle
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                    <h4 style={{ color: 'var(--accent)', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      2. Kullanılan Biyosidal Ürüne Ait Bilgiler
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewBiocideMode(!isNewBiocideMode);
                        if (!isNewBiocideMode) {
                          setEk1FormData(prev => ({
                            ...prev,
                            biyosidal_urun: '',
                            ruhsat_tarihi: '',
                            ruhsat_sayisi: '',
                            uygulama_sekli: 'Jel Noktalama',
                            uygulama_yontemi: 'Jel Noktalama',
                            aktif_madde: '',
                            antidotu: 'Semptomatik Tedavi',
                            urun_miktari: '10 gr'
                          }));
                        }
                      }}
                      style={{
                        background: isNewBiocideMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: isNewBiocideMode ? '#F59E0B' : '#10B981',
                        border: isNewBiocideMode ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px',
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontFamily: 'var(--font-family)',
                        width: 'auto'
                      }}
                    >
                      {isNewBiocideMode ? '📋 Hazır Listeden Çoklu Seç' : '➕ Yeni İlaç Kaydet (Listeye Ekle)'}
                    </button>
                  </div>
                  
                  {!isNewBiocideMode ? (
                    <div>
                      {/* Çoklu İlaç Seçimi (Chipler) */}
                      <label className="input-label">Kütüphanedeki İlaçlar (Çoklu Seçin) *</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                        {ek1Products.map(prod => {
                          const isSelected = (ek1FormData.secili_urunler || []).some(p => p.commercialName === prod.commercialName);
                          return (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => {
                                setEk1FormData(prev => {
                                  const current = prev.secili_urunler || [];
                                  let updatedProds = [];
                                  if (isSelected) {
                                    updatedProds = current.filter(p => p.commercialName !== prod.commercialName);
                                  } else {
                                    updatedProds = [...current, { ...prod }];
                                  }
                                  
                                  // İlk seçilen ürünü eski uyumluluk için de set edelim
                                  const first = updatedProds[0] || {};
                                  const nextFormData = {
                                    ...prev,
                                    secili_urunler: updatedProds,
                                    biyosidal_urun: first.commercialName || '',
                                    ruhsat_tarihi: first.licenseDate || '',
                                    ruhsat_sayisi: first.licenseNo || '',
                                    uygulama_sekli: first.method || '',
                                    uygulama_yontemi: first.method || '',
                                    aktif_madde: first.activeIngredient || '',
                                    antidotu: first.antidote || '',
                                    urun_miktari: first.defaultQuantity || ''
                                  };
                                  
                                  refreshReportText(nextFormData);
                                  return nextFormData;
                                });
                              }}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '20px',
                                border: isSelected ? '2px solid #10B981' : '1px solid #475569',
                                background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(51, 65, 85, 0.4)',
                                color: isSelected ? '#10B981' : '#94A3B8',
                                fontSize: '0.78rem',
                                fontWeight: isSelected ? '700' : '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {isSelected ? '✅ ' : ''}{prod.commercialName}
                            </button>
                          );
                        })}
                      </div>

                      {/* Seçilen İlaçların Listesi ve Miktar Ayarlaması */}
                      {(ek1FormData.secili_urunler || []).length > 0 && (
                        <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '14px', marginBottom: '15px' }}>
                          <label className="input-label" style={{ marginBottom: '8px', color: '#10B981' }}>Seçili İlaçlar ve Kullanım Miktarları</label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {(ek1FormData.secili_urunler || []).map((p, idx) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '10px' }}>
                                <div style={{ fontSize: '0.82rem', color: '#F8FAFC' }}>
                                  <strong>{p.commercialName}</strong> <br/>
                                  <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{p.activeIngredient} / {p.method}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Miktar:</span>
                                  <input 
                                    type="text" 
                                    className="form-input"
                                    style={{ width: '80px', margin: 0, padding: '4px 8px', fontSize: '0.78rem', textAlign: 'center' }}
                                    value={p.defaultQuantity || ''}
                                    onChange={(e) => {
                                      const newQty = e.target.value;
                                      setEk1FormData(prev => {
                                        const updated = [...(prev.secili_urunler || [])];
                                        updated[idx] = { ...updated[idx], defaultQuantity: newQty };
                                        
                                        // Eski uyumluluk alanını da güncelle (eğer ilk elemansa)
                                        const nextFormData = {
                                          ...prev,
                                          secili_urunler: updated,
                                          urun_miktari: idx === 0 ? newQty : prev.urun_miktari
                                        };
                                        refreshReportText(nextFormData);
                                        return nextFormData;
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {/* Yeni İlaç Ekleme Form Modu */}
                      <div className="input-group">
                        <label className="input-label">Yeni Ürün Ticari Adı *</label>
                        <input 
                          type="text" 
                          required
                          className="form-input" 
                          placeholder="Yeni ürünün ticari adını yazın..."
                          value={ek1FormData.biyosidal_urun}
                          onChange={(e) => setEk1FormData({ ...ek1FormData, biyosidal_urun: e.target.value })}
                        />
                      </div>

                      <div className="form-grid-2col">
                        <div>
                          <label className="input-label">Ruhsat Tarihi *</label>
                          <input 
                            type="text" 
                            required
                            className="form-input" 
                            placeholder="Örn: 12.04.2016"
                            value={ek1FormData.ruhsat_tarihi}
                            onChange={(e) => setEk1FormData({ ...ek1FormData, ruhsat_tarihi: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="input-label">Ruhsat Sayısı *</label>
                          <input 
                            type="text" 
                            required
                            className="form-input" 
                            placeholder="Örn: 2016/98"
                            value={ek1FormData.ruhsat_sayisi}
                            onChange={(e) => setEk1FormData({ ...ek1FormData, ruhsat_sayisi: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-grid-2col">
                        <div>
                          <label className="input-label">Ürün Aktif Maddesi *</label>
                          <input 
                            type="text" 
                            required
                            className="form-input" 
                            placeholder="Örn: Imidacloprid"
                            value={ek1FormData.aktif_madde}
                            onChange={(e) => setEk1FormData({ ...ek1FormData, aktif_madde: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="input-label">Antidotu *</label>
                          <input 
                            type="text" 
                            required
                            className="form-input" 
                            placeholder="Örn: Semptomatik Tedavi"
                            value={ek1FormData.antidotu}
                            onChange={(e) => setEk1FormData({ ...ek1FormData, antidotu: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-grid-2col">
                        <div>
                          <label className="input-label">Uygulama Şekli *</label>
                          <select 
                            className="form-input"
                            value={ek1FormData.uygulama_sekli}
                            onChange={(e) => setEk1FormData({ ...ek1FormData, uygulama_sekli: e.target.value, uygulama_yontemi: e.target.value })}
                          >
                            <option value="Jel Noktalama">Jel Noktalama Yöntemi</option>
                            <option value="U.L.V. Püskürtme">U.L.V. Soğuk Sisleme Püskürtme</option>
                            <option value="Sırt Pompası (Rezidüel)">Rezidüel Bariyer Püskürtme</option>
                            <option value="Yem İstasyonu Yerleşimi">Kilitli Yem İstasyonu Kurulumu</option>
                          </select>
                        </div>
                        <div>
                          <label className="input-label">Birim Kullanım Miktarı *</label>
                          <input 
                            type="text" 
                            required
                            className="form-input" 
                            placeholder="Örn: 10 gr / 100 ml"
                            value={ek1FormData.urun_miktari}
                            onChange={(e) => setEk1FormData({ ...ek1FormData, urun_miktari: e.target.value })}
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={handleAddNewProductInline}
                          style={{
                            background: '#10B981',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 15px',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            fontWeight: '700',
                            fontFamily: 'var(--font-family)',
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Kütüphaneye ve Rapora Ekle
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. UYGULAMA YAPILAN YER HAKKINDA BİLGİLER */}
                <div style={{ borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '15px' }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 10px 0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    3. Uygulama Yapılan Yer Hakkında Bilgiler
                  </h4>

                  <div className="input-group">
                    <label className="input-label">Uygulama Yapılan Açık Adres</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ background: 'rgba(0,0,0,0.15)', cursor: 'not-allowed' }}
                      readOnly
                      value={`${customer.unvan} - ${customer.adres}`}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Hedef Zararlı Türü (Çoklu Seçmeli) *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginTop: '5px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#E2E8F0', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={ek1FormData.hedef_hasere_yuruyen || false} 
                          onChange={(e) => {
                            const updated = { ...ek1FormData, hedef_hasere_yuruyen: e.target.checked };
                            setEk1FormData(updated);
                            refreshReportText(updated);
                          }} 
                        /> Yürüyen Haşere
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#E2E8F0', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={ek1FormData.hedef_hasere_ucan || false} 
                          onChange={(e) => {
                            const updated = { ...ek1FormData, hedef_hasere_ucan: e.target.checked };
                            setEk1FormData(updated);
                            refreshReportText(updated);
                          }} 
                        /> Uçan Haşere
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#E2E8F0', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={ek1FormData.hedef_hasere_fare || false} 
                          onChange={(e) => {
                            const updated = { ...ek1FormData, hedef_hasere_fare: e.target.checked };
                            setEk1FormData(updated);
                            refreshReportText(updated);
                          }} 
                        /> Fare
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#E2E8F0', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={ek1FormData.hedef_hasere_sican || false} 
                          onChange={(e) => {
                            const updated = { ...ek1FormData, hedef_hasere_sican: e.target.checked };
                            setEk1FormData(updated);
                            refreshReportText(updated);
                          }} 
                        /> Sıçan
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#E2E8F0', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={ek1FormData.hedef_hasere_diger || false} 
                          onChange={(e) => {
                            const updated = { ...ek1FormData, hedef_hasere_diger: e.target.checked };
                            setEk1FormData(updated);
                            refreshReportText(updated);
                          }} 
                        /> Diğer
                      </label>
                    </div>
                    {ek1FormData.hedef_hasere_diger && (
                      <input 
                        type="text" 
                        className="form-input" 
                        style={{ marginTop: '10px' }}
                        placeholder="Zararlı adını yazın (örn: Karasinek, Kene)"
                        value={ek1FormData.hedef_hasere_diger_detay || ''}
                        onChange={(e) => setEk1FormData({ ...ek1FormData, hedef_hasere_diger_detay: e.target.value })}
                      />
                    )}
                  </div>

                  <div className="form-grid-2col">
                    <div>
                      <label className="input-label">Uygulama Saat Başlangıç *</label>
                      <input 
                        type="time" 
                        required 
                        className="form-input" 
                        value={ek1FormData.saat_baslangic}
                        onChange={(e) => setEk1FormData({ ...ek1FormData, saat_baslangic: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="input-label">Uygulama Saat Bitiş *</label>
                      <input 
                        type="time" 
                        required 
                        className="form-input" 
                        value={ek1FormData.saat_bitis}
                        onChange={(e) => setEk1FormData({ ...ek1FormData, saat_bitis: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2col">
                    <div>
                      <label className="input-label">Yerin Türü *</label>
                      <select 
                        className="form-input"
                        value={ek1FormData.yerin_turu}
                        onChange={(e) => setEk1FormData({ ...ek1FormData, yerin_turu: e.target.value })}
                      >
                        <option value="İşyeri">İşyeri / Ticari Alan</option>
                        <option value="Mesken">Mesken / Konut</option>
                        <option value="Diğer">Diğer Tür Araziler</option>
                      </select>
                    </div>
                    {(ek1FormData.yerin_turu === 'Mesken' || ek1FormData.yerin_turu === 'Diğer') && (
                      <div>
                        <label className="input-label">Daire Sayısı</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="Örn: 4"
                          value={ek1FormData.yerin_turu_daire}
                          onChange={(e) => setEk1FormData({ ...ek1FormData, yerin_turu_daire: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-grid-2col">
                    <div>
                      <label className="input-label">Uygulama Alanı (M²)</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Örn: 120"
                        value={ek1FormData.uygulama_alani}
                        onChange={(e) => setEk1FormData({ ...ek1FormData, uygulama_alani: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="input-label">Yem İstasyonu Adedi</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Örn: 4 istasyon"
                        value={ek1FormData.yem_istasyonu_sayisi}
                        onChange={(e) => setEk1FormData({ ...ek1FormData, yem_istasyonu_sayisi: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="input-group" style={{ marginTop: '15px' }}>
                    <label className="input-label" style={{ color: '#F59E0B', fontWeight: 'bold' }}>Müşteri E-posta Adresi (EK-1 Belgesi Buraya Gönderilecek) *</label>
                    <input 
                      type="email" 
                      required 
                      className="form-input" 
                      style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}
                      placeholder="Müşteri e-posta adresini yazın (Örn: musteri@mail.com)"
                      value={ek1FormData.customer_email || ''}
                      onChange={(e) => setEk1FormData({ ...ek1FormData, customer_email: e.target.value })}
                    />
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '4px' }}>
                      * Müşterinin e-postası boşsa buraya girin. Girilen e-posta müşterinin kartına da otomatik kaydedilecektir.
                    </div>
                  </div>
                </div>

                {/* 4. YAPILAN UYGULAMA DETAYLARI VE GÖRÜŞLER */}
                <div style={{ borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ color: 'var(--accent)', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      4. Yapılan Uygulamalar ve Görüşler
                    </h4>
                    <button 
                      type="button" 
                      onClick={refreshReportText}
                      style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '8px', padding: '3px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      ⚙️ Raporu Otomatik Doldur
                    </button>
                  </div>
                  <textarea 
                    className="form-input" 
                    required 
                    rows="4" 
                    placeholder="Uygulama detayları ve teknik açıklamalar..."
                    value={ek1FormData.uygulamalar_ve_gorusler}
                    onChange={(e) => setEk1FormData({ ...ek1FormData, uygulamalar_ve_gorusler: e.target.value })}
                    style={{ fontSize: '0.8rem', resize: 'none', lineHeight: '1.4' }}
                  />
                </div>

                {/* 5. GÜVENLİİK ÖNLEMLERİ VE YAPILAN ÖNERİLER */}
                <div style={{ borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '15px' }}>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 10px 0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    5. Güvenlik Önlemleri ve Öneriler *
                  </h4>
                  <textarea 
                    className="form-input" 
                    required 
                    rows="3" 
                    placeholder="Güvenlik tedbirleri ve ek ööneriler (manuel veri girilebilir)..."
                    value={ek1FormData.oneriler}
                    onChange={(e) => setEk1FormData({ ...ek1FormData, oneriler: e.target.value })}
                    style={{ fontSize: '0.8rem', resize: 'none' }}
                  />
                </div>

                {/* 6. İMZALAR (EKİP VE MÜŞTERİ) */}
                <div>
                  <h4 style={{ color: 'var(--accent)', margin: '0 0 15px 0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    6. Islak İmzalar
                  </h4>
                  
                  {/* Ekip Sorumlusu İmzası (Sisteme 1 kez kaydedilir) */}
                  <div className="input-group" style={{ marginBottom: '20px' }}>
                    <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Ekip Sorumlusu İmzası (Teknisyen) *</span>
                      {savedEkipSignature && !changeEkipSignature && (
                        <button 
                          type="button" 
                          onClick={() => setChangeEkipSignature(true)}
                          style={{ background: 'transparent', color: '#F59E0B', border: 'none', padding: 0, textDecoration: 'underline', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          İmzayı Değiştir
                        </button>
                      )}
                    </label>
                    {savedEkipSignature && !changeEkipSignature ? (
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1.5px solid var(--border-color)', borderRadius: '16px', padding: '10px', textAlign: 'center' }}>
                        <img 
                          src={savedEkipSignature} 
                          style={{ maxHeight: '70px', background: 'rgba(255,255,255,0.07)', padding: '5px', borderRadius: '8px' }} 
                          alt="Ekip İmza" 
                        />
                        <div style={{ fontSize: '0.7rem', color: 'var(--accent)', marginTop: '5px', fontWeight: 'bold' }}>✅ Kayıtlı Ekip İmzası Hazır</div>
                      </div>
                    ) : (
                      <div className="signature-canvas-container">
                        <button type="button" className="canvas-clear-btn" onClick={clearEkipCanvas}>Temizle</button>
                        <canvas 
                          ref={ekipCanvasRef}
                          className="signature-canvas"
                          width={380}
                          height={140}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                        />
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '5px' }}>
                          * Teknisyen olarak buraya imzanızı atın. Bir defa kaydettiğinizde sonraki evraklarda otomatik yüklenecektir.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Müşteri İmzası (Dokunmatik Çizim Alanı) */}
                  <div className="input-group" style={{ marginBottom: '10px' }}>
                    <label className="input-label">Uygulama Yapılan Yer Sorumlusu (Müşteri Islak İmzası) *</label>
                    <div className="signature-canvas-container">
                      <button type="button" className="canvas-clear-btn" onClick={clearCanvas}>Temizle</button>
                      <canvas 
                        ref={canvasRef}
                        className="signature-canvas"
                        width={380}
                        height={140}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                      />
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '5px' }}>
                        * Müşterinin tabletten veya telefondan parmağıyla imza atmasını sağlayın.
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowEk1Modal(false); setSelectedAppForEk1(null); clearCanvas(); }}>
                    Vazgeç
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ width: 'auto', marginLeft: 'auto' }}>
                    Evrağı Kaydet & Gönder
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* POPUP 6: HIZLI RANDEVU EKLEME MODALI (Günlük Plandan) */}
      {showQuickAppModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Yeni Randevu Planla 📅</h2>
              <button className="close-btn" onClick={() => setShowQuickAppModal(false)}>
                <IconClose />
              </button>
            </div>

            <form onSubmit={handleQuickAppSubmit}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '0.85rem', color: 'var(--accent)', marginBottom: '20px' }}>
                ️ Seçtiğiniz <strong>{new Date(quickAppDate).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</strong> tarihine yeni bir ilaçlama görevi eklemektesiniz.
              </div>

              <div className="input-group">
                <label className="input-label">Müşteri Seçin *</label>
                {customers.length === 0 ? (
                  <div style={{ color: '#F59E0B', fontSize: '0.85rem', marginTop: '5px' }}>
                    Sistemde kayıtlı müşteri bulunamadı. Lütfen önce "Müşteriler" sekmesinden yeni bir müşteri ekleyin.
                  </div>
                ) : (
                  <select 
                    required
                    className="form-input"
                    value={quickAppCustomerId}
                    onChange={(e) => setQuickAppCustomerId(e.target.value)}
                  >
                    <option value="" disabled>-- Lütfen Bir Müşteri Seçin --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.unvan} ({c.adres.substring(0, 25)}...)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="form-grid-2col">
                <div>
                  <label className="input-label">Uygulama Tarihi *</label>
                  <input 
                    type="date" 
                    required 
                    className="form-input" 
                    value={quickAppDate}
                    onChange={(e) => setQuickAppDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Uygulama Saati *</label>
                  <input 
                    type="time" 
                    required 
                    className="form-input" 
                    value={quickAppTime}
                    onChange={(e) => setQuickAppTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Ziyaret / Uygulama Notları</label>
                <textarea 
                  className="form-input" 
                  rows="3"
                  style={{ resize: 'none' }}
                  placeholder="İlaçlama öncesi veya alanla ilgili özel notlar..."
                  value={quickAppNotes}
                  onChange={(e) => setQuickAppNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowQuickAppModal(false)}>
                  Vazgeç
                </button>
                <button type="submit" className="btn btn-primary" style={{ width: 'auto', marginLeft: 'auto' }} disabled={customers.length === 0}>
                  Randevuyu Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP 7: YENİ İLAÇ EKLEME MODALI */}
      {showAddBiocideModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2 className="modal-title">🏢 İlaç Kütüphanesine Yeni İlaç Ekle</h2>
              <button className="close-btn" onClick={() => setShowAddBiocideModal(false)}>
                <IconClose />
              </button>
            </div>

            <form onSubmit={handleAddBiocide}>
              <div className="input-group">
                <label className="input-label">Ürün Ticari Adı *</label>
                <input 
                  type="text" 
                  required
                  className="form-input" 
                  placeholder="Örn: Solfac WP 10"
                  value={newBiocide.commercialName}
                  onChange={(e) => setNewBiocide({ ...newBiocide, commercialName: e.target.value })}
                />
              </div>

              <div className="form-grid-2col">
                <div>
                  <label className="input-label">Ruhsat Tarihi</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Örn: 20.11.2014"
                    value={newBiocide.licenseDate}
                    onChange={(e) => setNewBiocide({ ...newBiocide, licenseDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label">Ruhsat Sayısı</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Örn: 2014/312"
                    value={newBiocide.licenseNo}
                    onChange={(e) => setNewBiocide({ ...newBiocide, licenseNo: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Varsayılan Uygulama Şekli *</label>
                <select 
                  className="form-input"
                  value={newBiocide.method}
                  onChange={(e) => setNewBiocide({ ...newBiocide, method: e.target.value })}
                >
                  <option value="Jel Noktalama">Jel Noktalama Yöntemi</option>
                  <option value="U.L.V. Püskürtme">U.L.V. Soğuk Sisleme Püskürtme</option>
                  <option value="Sırt Pompası (Rezidüel)">Rezidüel Bariyer Püskürtme (Sırt Pompası)</option>
                  <option value="Yem İstasyonu Yerleşimi">Kilitli Yem İstasyonu Kurulumu</option>
                </select>
              </div>

              <div className="form-grid-2col">
                <div>
                  <label className="input-label">Ürün Aktif Maddesi *</label>
                  <input 
                    type="text" 
                    required
                    className="form-input" 
                    placeholder="Örn: Deltamethrin"
                    value={newBiocide.activeIngredient}
                    onChange={(e) => setNewBiocide({ ...newBiocide, activeIngredient: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label">Varsayılan Antidotu</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Örn: Semptomatik Tedavi / K1"
                    value={newBiocide.antidote}
                    onChange={(e) => setNewBiocide({ ...newBiocide, antidote: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Varsayılan Birim Miktar *</label>
                <input 
                  type="text" 
                  required
                  className="form-input" 
                  placeholder="Örn: 10 gr / 50 ml"
                  value={newBiocide.defaultQuantity}
                  onChange={(e) => setNewBiocide({ ...newBiocide, defaultQuantity: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddBiocideModal(false)}>
                  Vazgeç
                </button>
                <button type="submit" className="btn btn-primary" style={{ width: 'auto', marginLeft: 'auto' }}>
                  Kütüphaneye Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP 5: EK-1 BELGESİ GÖRÜNTÜLEME MODALI */}
      {viewingEk1Doc && (() => {
        // Çoklu ilaç verisini parse edelim
        let docProducts = [];
        if (viewingEk1Doc.secili_urunler) {
          if (Array.isArray(viewingEk1Doc.secili_urunler)) {
            docProducts = viewingEk1Doc.secili_urunler;
          } else {
            try {
              docProducts = JSON.parse(viewingEk1Doc.secili_urunler);
            } catch (e) {
              docProducts = [];
            }
          }
        }
        if (docProducts.length === 0) {
          // Geriye dönük uyumluluk
          docProducts = [{
            commercialName: viewingEk1Doc.biyosidal_urun || '-',
            licenseDate: viewingEk1Doc.ruhsat_tarihi || '-',
            licenseNo: viewingEk1Doc.ruhsat_sayisi || '-',
            method: viewingEk1Doc.uygulama_sekli || viewingEk1Doc.uygulama_yontemi || '-',
            activeIngredient: viewingEk1Doc.aktif_madde || '-',
            antidote: viewingEk1Doc.antidotu || '-',
            defaultQuantity: viewingEk1Doc.urun_miktari || '-'
          }];
        }

        // Compile the target pests as string
        const pests = [];
        if (viewingEk1Doc.hedef_hasere_yuruyen) pests.push('Yürüyen Haşere');
        if (viewingEk1Doc.hedef_hasere_ucan) pests.push('Uçan Haşere');
        if (viewingEk1Doc.hedef_hasere_fare) pests.push('Fare');
        if (viewingEk1Doc.hedef_hasere_sican) pests.push('Sıçan');
        if (viewingEk1Doc.hedef_hasere_diger) pests.push(viewingEk1Doc.hedef_hasere_diger_detay || 'Diğer');
        const pestsStr = pests.join(', ') || viewingEk1Doc.hedef_hasere || 'Belirtilmedi';

        const urunlerStr = docProducts.map(p => p.commercialName).join(', ');

        // Compiling WhatsApp share message
        const shareMessage = `Körfez İlaçlama - EK-1 Biyosidal Ürün Uygulama Belgesi\n` +
          `Belge No: #EK1-${viewingEk1Doc.id}\n` +
          `Uygulama Tarihi: ${new Date(viewingEk1Doc.created_at).toLocaleDateString('tr-TR')}\n` +
          `Teknisyen: ${viewingEk1Doc.teknisyen_adi || 'Ömür Karabacak'}\n` +
          `Kullanılan Ürün/ler: ${urunlerStr}\n` +
          `Hedef Zararlı: ${pestsStr}\n` +
          `Uygulama Alanı: ${viewingEk1Doc.uygulama_alani || '-'} M²\n` +
          `İşlem Başarılı Bir Şekilde Tamamlanmıştır. Evrağınız e-posta adresinize gönderilmiştir.`;

        const waUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(viewingEk1Doc.customer_phone || '')}&text=${encodeURIComponent(shareMessage)}`;

        return (
          <div className="modal-overlay" style={{ overflowY: 'auto' }}>
            <div className="modal-content" style={{ maxWidth: '850px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '20px' }}>
              <div className="modal-header" style={{ marginBottom: '15px' }}>
                <h2 className="modal-title" style={{ fontSize: '1.2rem' }}>📄 Resmi EK-1 Raporu Detayı (#EK1-{viewingEk1Doc.id})</h2>
                <button className="close-btn" onClick={() => setViewingEk1Doc(null)}>
                  <IconClose />
                </button>
              </div>

              {/* Rapor İşlem Butonları */}
              <div className="ek1-print-actions" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => window.print()}
                  style={{ width: 'auto', padding: '10px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  🖨️ Yazdır / PDF Olarak Kaydet
                </button>
                <a 
                  href={`${API_URL}/api/ek1/${viewingEk1Doc.id}/pdf?download=true`}
                  download={`EK1_${viewingEk1Doc.id}.pdf`}
                  className="btn btn-secondary" 
                  style={{ width: 'auto', padding: '10px 20px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  PDF İndir
                </a>
                <a 
                  href={waUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: 'auto', padding: '10px 20px', fontSize: '0.85rem', background: '#25D366', color: '#fff', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  Müşteriye WhatsApp'tan Gönder
                </a>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setViewingEk1Doc(null)}
                  style={{ width: 'auto', padding: '10px 20px', fontSize: '0.85rem' }}
                >
                  Kapat
                </button>
              </div>

              {/* A4 Kağıt Görünümü */}
              <div className="ek1-print-sheet ek1-a4-sheet" style={{ margin: '0 auto' }}>
                
                {/* Logo & Resmi Başlık */}
                <div className="ek1-header">
                  <h2>T.C. SAĞLIK BAKANLIĞI</h2>
                  <h3>BİYOSİDAL ÜRÜN UYGULAMA İŞLEM FORMU (EK-1)</h3>
                  <div style={{ fontSize: '0.75rem', marginTop: '6px', color: '#000', display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                    <span>Form No: #EK1-00{viewingEk1Doc.id}</span>
                    <span>Tarih: {new Date(viewingEk1Doc.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* 1. UYGULAMAYI YAPANA AİT BİLGİLER */}
                <div className="ek1-section">
                  <div className="ek1-section-title">
                    1. UYGULAMAYI YAPANA AİT BİLGİLER
                  </div>
                  <div className="ek1-grid-2col">
                    <div className="ek1-grid-cell">
                      Firma Ticari Unvanı:<br/><strong>Körfez Danışmanlık İlaçlama Hizmetleri Ltd. Şti.</strong>
                    </div>
                    <div className="ek1-grid-cell">
                      Mesul Müdür:<br/><strong>{viewingEk1Doc.mesul_mudur || 'Sadun Güneş'}</strong>
                    </div>
                    <div className="ek1-grid-cell">
                      Firma İzin Tarih / No:<br/><strong>0061 / 21.09.2018</strong>
                    </div>
                    <div className="ek1-grid-cell">
                      Firma Telefon / İrtibat:<br/><strong>0266 373 4 333 / 0 505 825 00 11</strong>
                    </div>
                    <div className="ek1-grid-cell">
                      Ekip Sorumlusu:<br/><strong>{viewingEk1Doc.teknisyen_adi}</strong>
                    </div>
                    <div className="ek1-grid-cell">
                      Uygulayıcılar:<br/><strong>{viewingEk1Doc.uygulayicilar || viewingEk1Doc.teknisyen_adi}</strong>
                    </div>
                    <div className="ek1-grid-cell">
                      Firma Adresi:<br/><strong>Hamidiye Mahallesi 15034 Sokak No:4 F Edremit/Balıkesir</strong>
                    </div>
                  </div>
                </div>

                {/* 2. KULLANILAN BİYOSİDAL ÜRÜNE AİT BİLGİLER */}
                <div className="ek1-section">
                  <div className="ek1-section-title">
                    2. KULLANILAN BİYOSİDAL ÜRÜNE AİT BİLGİLER
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem', marginTop: '5px', border: '1px solid #000' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', color: '#000', border: '1px solid #000', fontWeight: 'bold' }}>
                        <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>Ürünün Ticari Adı</th>
                        <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>Ruhsat Tarih / No</th>
                        <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>Aktif Madde</th>
                        <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>Uygulama Yöntemi</th>
                        <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>Antidotu</th>
                        <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>Miktarı</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docProducts.map((p, idx) => (
                        <tr key={idx} style={{ border: '1px solid #000', color: '#000', textAlign: 'center' }}>
                          <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>{p.commercialName}</td>
                          <td style={{ border: '1px solid #000', padding: '5px' }}>{p.licenseDate} <br/> {p.licenseNo}</td>
                          <td style={{ border: '1px solid #000', padding: '5px' }}>{p.activeIngredient}</td>
                          <td style={{ border: '1px solid #000', padding: '5px' }}>{p.method}</td>
                          <td style={{ border: '1px solid #000', padding: '5px' }}>{p.antidote}</td>
                          <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 'bold' }}>{p.defaultQuantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 3. UYGULAMA YAPILAN YER HAKKINDA BİLGİLER */}
                <div className="ek1-section">
                  <div className="ek1-section-title">
                    3. UYGULAMA YAPILAN YER HAKKINDA BİLGİLER
                  </div>
                  <div className="ek1-grid-2col">
                    <div className="ek1-grid-cell">
                      Uygulama Yapılan Yer Adresi:<br/><strong>{viewingEk1Doc.customer_address || viewingEk1Doc.uygulama_adresi || 'Belirtilmedi'}</strong>
                    </div>
                    <div className="ek1-grid-cell">
                      Hedef Zararlı Türü:<br/><strong>{pestsStr}</strong>
                    </div>
                    <div className="ek1-grid-cell">
                      İşlem Saatleri:<br/><strong>{viewingEk1Doc.saat_baslangic || '12:00'} - {viewingEk1Doc.saat_bitis || '13:00'}</strong>
                    </div>
                    <div className="ek1-grid-cell">
                      Yerin Türü:<br/><strong>{viewingEk1Doc.yerin_turu || 'İşyeri'} {viewingEk1Doc.yerin_turu_daire ? `(${viewingEk1Doc.yerin_turu_daire} Daire)` : ''}</strong>
                    </div>
                    <div className="ek1-grid-cell">
                      Uygulama Alanı (M²):<br/><strong>{viewingEk1Doc.uygulama_alani || '-'} M²</strong>
                    </div>
                    <div className="ek1-grid-cell">
                      Yem İstasyonu Sayısı:<br/><strong>{viewingEk1Doc.yem_istasyonu_sayisi || '-'} Adet</strong>
                    </div>
                  </div>
                </div>

                {/* 4. YAPILAN UYGULAMALAR VE GÖRÜŞLER */}
                <div className="ek1-section">
                  <div className="ek1-section-title">
                    4. YAPILAN UYGULAMALAR VE GÖRÜŞLER (RAPOR METNİ)
                  </div>
                  <div className="ek1-full-text">
                    {viewingEk1Doc.uygulamalar_ve_gorusler || '-'}
                  </div>
                </div>

                {/* 5. ÖNERİLER VE GÜVENLİİK ÖNLEMLERİ */}
                <div className="ek1-section">
                  <div className="ek1-section-title">
                    5. GÜVENLİİK TEDBİRLERİ VE ÖNERİLER
                  </div>
                  <div className="ek1-full-text">
                    {viewingEk1Doc.oneriler || 'Uygulama alanına 2 saat boyunca girilmemeli, sonrasında 30 dakika havalandırılmalıdır.'}
                  </div>
                </div>

                {/* 6. ISLAK İMZALAR */}
                <div className="ek1-section">
                  <div className="ek1-section-title">
                    6. YETKİLİ VE MÜŞTERİ ISLAK İMZALARI
                  </div>
                  <div className="ek1-signatures">
                    <div className="ek1-signature-box">
                      <strong>Ekip Sorumlusu (Teknisyen)</strong><br/>
                      <span style={{ fontSize: '0.75rem', color: '#555' }}>{viewingEk1Doc.teknisyen_adi}</span>
                      <div className="ek1-signature-img-container">
                        {viewingEk1Doc.signature_ekip ? (
                          <img src={viewingEk1Doc.signature_ekip} alt="Teknisyen İmza" />
                        ) : (
                          <span style={{ color: '#999', fontSize: '0.75rem', fontStyle: 'italic' }}>İmza Kaydı Bulunamadı</span>
                        )}
                      </div>
                    </div>
                    <div className="ek1-signature-box">
                      <strong>Uygulama Yapılan Yer Sorumlusu</strong><br/>
                      <span style={{ fontSize: '0.75rem', color: '#555' }}>Müşteri Temsilcisi</span>
                      <div className="ek1-signature-img-container">
                        {viewingEk1Doc.signature_image ? (
                          <img src={viewingEk1Doc.signature_image} alt="Müşteri İmza" />
                        ) : (
                          <span style={{ color: '#999', fontSize: '0.75rem', fontStyle: 'italic' }}>Islak İmza Alınmadı</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer warning */}
                <div className="ek1-footer-warning">
                  ☣️ ZEHİRLENME DURUMLARINDA ULUSAL ZEHİR DANIŞMA MERKEZİ (UZEM) 114 NO'LU TELEFONU ARAYINIZ.
                </div>

              </div>
            </div>
          </div>
        );
      })()}
      {/* POPUP 8: YENİ GİDER EKLEME MODALI */}
      {showAddExpenseModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2 className="modal-title">➕ Yeni Gider Ekle</h2>
              <button className="close-btn" onClick={() => setShowAddExpenseModal(false)}>
                <IconClose />
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit}>
              <div className="input-group">
                <label className="input-label">Harcama Tarihi *</label>
                <input 
                  type="date" 
                  required
                  className="form-input" 
                  value={newExpenseData.date}
                  onChange={(e) => setNewExpenseData({ ...newExpenseData, date: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Kategori *</label>
                <select 
                  className="form-input"
                  value={newExpenseData.category}
                  onChange={(e) => setNewExpenseData({ ...newExpenseData, category: e.target.value })}
                >
                  <option value="🚗 Araç Yakıt / Benzin">🚗 Araç Yakıt / Benzin</option>
                  <option value="📄 Ekipman / Cihaz ve Malzeme">📄 Ekipman / Cihaz ve Malzeme</option>
                  <option value="Araç Bakım / Yedek Parça">Araç Bakım / Yedek Parça</option>
                  <option value="a Muhasebe / Resmi ÖÖdemeler ve Vergiler">a Muhasebe / Resmi ÖÖdemeler ve Vergiler</option>
                  <option value="Ofis Giderleri ve Genel İhtiyaçlar">Ofis Giderleri ve Genel İhtiyaçlar</option>
                  <option value="Diğer (Dinamik Açıklamalı)">➕ Diğer (Dinamik Açıklamalı)</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Açıklama / Detay *</label>
                <input 
                  type="text" 
                  required
                  className="form-input" 
                  placeholder="Örn: Plaka 10ŞŞ123 Yakıt Alımı"
                  value={newExpenseData.explanation}
                  onChange={(e) => setNewExpenseData({ ...newExpenseData, explanation: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Tutar (TRY) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  className="form-input" 
                  placeholder="Örn: 1450.50"
                  value={newExpenseData.amount}
                  onChange={(e) => setNewExpenseData({ ...newExpenseData, amount: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddExpenseModal(false)}>
                  Vazgeç
                </button>
                <button type="submit" className="btn btn-primary" style={{ width: 'auto', marginLeft: 'auto' }}>
                  Gideri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}


