const fs = require('fs');

const appPath = 'frontend/src/App.jsx';
let code = fs.readFileSync(appPath, 'utf8');

// 1. State ekle
const stateTarget = "const [showEditProductModal, setShowEditProductModal] = useState(false);\n  const [editingProduct, setEditingProduct] = useState(null);";
const stateReplacement = `const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Stok Modal State
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState({ product: null, amount: '' });`;
code = code.replace(stateTarget, stateReplacement);

// 2. newBiocide update
const biocideTarget = `defaultQuantity: '10 gr'
  });`;
const biocideReplacement = `defaultQuantity: '10 gr',
    stock: 0,
    unit: 'Litre',
    criticalStock: 10
  });`;
code = code.replace(biocideTarget, biocideReplacement);

// 3. handleAdjustStock fonksiyonu
const funcsTarget = `  const handleDeleteProduct = async (id) => {`;
const funcsReplacement = `  const handleAdjustStock = async (e) => {
    e.preventDefault();
    if (!stockAdjustment.product || !stockAdjustment.amount) return;
    try {
      const res = await fetch(\`\${API_URL}/api/ek1/products/\${stockAdjustment.product.id}/adjust-stock\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
        body: JSON.stringify({ amount: parseFloat(stockAdjustment.amount) })
      });
      if (res.ok) {
        alert('Stok başarıyla güncellendi.');
        setShowStockModal(false);
        setStockAdjustment({ product: null, amount: '' });
        fetchEk1Products();
      } else {
        const d = await res.json();
        alert('Hata: ' + d.error);
      }
    } catch(err) {
      console.error(err);
      alert('Ağ hatası oluştu.');
    }
  };

  const handleDeleteProduct = async (id) => {`;
code = code.replace(funcsTarget, funcsReplacement);

// 4. "Depo ve Stok Yönetimi" paneli (İlaç Kütüphanesi önüne)
const panelTarget = `              {/* İlaç Kütüphanesi Paneli */}`;
const panelReplacement = `              {/* DEPO VE STOK YONETIMI PANELI */}
              <div style={{ background: '#1E293B', border: '1px solid #334155', padding: '25px', borderRadius: '24px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📦 Depo ve Stok Yönetimi
                  </h2>
                </div>
                <div style={{ overflow: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: '#CBD5E1', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #334155', color: '#94A3B8' }}>
                        <th style={{ padding: '12px' }}>İlaç Adı</th>
                        <th style={{ padding: '12px' }}>Mevcut Stok</th>
                        <th style={{ padding: '12px' }}>Uyarı Sınırı</th>
                        <th style={{ padding: '12px' }}>Durum</th>
                        {user.role === 'admin' && <th style={{ padding: '12px', textAlign: 'right' }}>İşlemler</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {ek1Products.length === 0 ? (
                        <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>Henüz ürün eklenmemiş.</td></tr>
                      ) : (
                        ek1Products.map((p) => {
                          const stock = p.stock || 0;
                          const crit = p.criticalStock || 10;
                          const isCritical = stock <= crit;
                          return (
                            <tr key={p.id} style={{ borderBottom: '1px solid #334155' }}>
                              <td style={{ padding: '12px', fontWeight: 'bold', color: '#F8FAFC' }}>{p.commercialName}</td>
                              <td style={{ padding: '12px', color: isCritical ? '#EF4444' : '#10B981', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                {stock} <span style={{fontSize:'0.8rem', color:'#94A3B8'}}>{p.unit || 'Birim'}</span>
                              </td>
                              <td style={{ padding: '12px' }}>{crit} {p.unit || 'Birim'}</td>
                              <td style={{ padding: '12px' }}>
                                {isCritical ? (
                                  <span style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>🔴 Kritik Stok</span>
                                ) : (
                                  <span style={{ background: 'rgba(16,185,129,0.2)', color: '#10B981', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>🟢 Yeterli</span>
                                )}
                              </td>
                              {user.role === 'admin' && (
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                  <button 
                                    onClick={() => { setStockAdjustment({ product: p, amount: '' }); setShowStockModal(true); }}
                                    style={{ background: '#3B82F6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                                  >
                                    📦 Stok Güncelle (+/-)
                                  </button>
                                </td>
                              )}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* İlaç Kütüphanesi Paneli */}`;
code = code.replace(panelTarget, panelReplacement);

// 5. Stock Güncelle Modal
const modalTarget = `      {showEditProductModal && editingProduct && (`;
const modalReplacement = `      {/* STOK GUNCELLE MODALI */}
      {showStockModal && stockAdjustment.product && (
        <div className="modal-overlay" onClick={() => setShowStockModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2 className="modal-title">📦 Stok Güncelle</h2>
              <button className="close-btn" onClick={() => setShowStockModal(false)}><IconClose /></button>
            </div>
            <form onSubmit={handleAdjustStock}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '15px', borderRadius: '12px', marginBottom: '20px', color: '#94A3B8', fontSize: '0.9rem' }}>
                <strong style={{ color: '#F8FAFC', fontSize: '1.1rem', display: 'block', marginBottom: '5px' }}>{stockAdjustment.product.commercialName}</strong>
                Mevcut Stok: <strong style={{ color: '#10B981' }}>{stockAdjustment.product.stock || 0} {stockAdjustment.product.unit || ''}</strong><br/>
                <span style={{ fontSize: '0.8rem' }}>Elden satış, zayi veya yeni mal alımı durumunda stoku manuel güncelleyebilirsiniz.</span>
              </div>
              
              <div className="input-group">
                <label className="input-label">Eklenecek / Çıkarılacak Miktar</label>
                <input 
                  type="number" 
                  required
                  step="0.01"
                  className="form-input" 
                  placeholder="Örn: 50 veya -20"
                  value={stockAdjustment.amount}
                  onChange={(e) => setStockAdjustment({ ...stockAdjustment, amount: e.target.value })}
                />
                <small style={{ color: '#94A3B8', marginTop: '5px', display: 'block' }}>Artırmak için pozitif (örn: 50), düşmek için negatif (örn: -20) değer giriniz.</small>
              </div>

              <div className="form-actions" style={{ marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowStockModal(false)}>İptal</button>
                <button type="submit" className="btn btn-primary">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditProductModal && editingProduct && (`;
code = code.replace(modalTarget, modalReplacement);

fs.writeFileSync(appPath, code, 'utf8');
console.log('Frontend patched.');
