const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

if (!code.includes('title="İlacı Düzenle"')) {
    code = code.replace(
        '<td style={{ padding: \'10px\', textAlign: \'right\' }}>',
        `<td style={{ padding: '10px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => { setEditingProduct(p); setShowEditProductModal(true); }}
                                style={{ background: '#3B82F6', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                title="İlacı Düzenle"
                              >
                                Düzenle
                              </button>`
    );
}

if (!code.includes('🐛 Aktif Haşere Kütüphanesi')) {
    const pestLibraryUI = `
              {/* Haşere Kütüphanesi Paneli */}
              <div style={{ background: '#1E293B', border: '1px solid #334155', padding: '25px', borderRadius: '24px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🐛 Aktif Haşere Kütüphanesi
                  </h2>
                  {user.role === 'admin' && (
                    <button 
                      onClick={() => setShowAddPestModal(true)}
                      className="btn"
                      style={{ width: 'auto', padding: '8px 16px', fontSize: '0.82rem', background: '#3B82F6', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                      ➕ Yeni Haşere Ekle
                    </button>
                  )}
                </div>

                <div className="table-responsive">
                  {pests.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem', border: '1px dashed #334155', borderRadius: '12px' }}>
                      Henüz sisteme kayıtlı bir haşere bulunmuyor.
                    </div>
                  ) : (
                    <table className="data-table" style={{ width: '100%', fontSize: '0.85rem' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #334155' }}>Haşere Adı</th>
                          {user.role === 'admin' && <th style={{ padding: '10px', textAlign: 'right', borderBottom: '2px solid #334155' }}>İşlemler</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {pests.map(p => (
                          <tr key={p.id} style={{ borderBottom: '1px solid #334155', transition: 'background 0.2s' }}>
                            <td style={{ padding: '10px', fontWeight: 'bold', color: '#F8FAFC' }}>{p.name}</td>
                            {user.role === 'admin' && (
                              <td style={{ padding: '10px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button 
                                  onClick={() => { setEditingPest(p); setShowEditPestModal(true); }}
                                  style={{ background: '#3B82F6', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                  title="Haşereyi Düzenle"
                                >
                                  Düzenle
                                </button>
                                <button 
                                  onClick={() => handleDeletePest(p.id)}
                                  style={{ background: '#EF4444', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                  title="Haşereyi Sil"
                                >
                                  Sil
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
`;
    code = code.replace(
        '{/* Raporlama Paneli */}',
        pestLibraryUI + '\n              {/* Raporlama Paneli */}'
    );
}

if (!code.includes('showAddPestModal &&')) {
    const modalsUI = `
      {/* POPUP: YENİ HAŞERE EKLEME MODALI */}
      {showAddPestModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2 className="modal-title">🐛 Yeni Haşere Ekle</h2>
              <button className="close-btn" onClick={() => setShowAddPestModal(false)}><IconClose /></button>
            </div>
            <form onSubmit={handleAddPestSubmit}>
              <div className="input-group">
                <label className="input-label">Haşere Adı *</label>
                <input 
                  type="text" required className="form-input" 
                  value={newPestNameInput} onChange={(e) => setNewPestNameInput(e.target.value)} 
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
                Kaydet
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POPUP: HAŞERE DÜZENLEME MODALI */}
      {showEditPestModal && editingPest && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2 className="modal-title">✏️ Haşere Düzenle</h2>
              <button className="close-btn" onClick={() => setShowEditPestModal(false)}><IconClose /></button>
            </div>
            <form onSubmit={handleEditPestSubmit}>
              <div className="input-group">
                <label className="input-label">Haşere Adı *</label>
                <input 
                  type="text" required className="form-input" 
                  value={editingPest.name} onChange={(e) => setEditingPest({...editingPest, name: e.target.value})} 
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
                Güncelle
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POPUP: İLAÇ DÜZENLEME MODALI */}
      {showEditProductModal && editingProduct && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2 className="modal-title">✏️ İlaç Düzenle</h2>
              <button className="close-btn" onClick={() => setShowEditProductModal(false)}><IconClose /></button>
            </div>
            <form onSubmit={handleEditProductSubmit}>
              <div className="input-group">
                <label className="input-label">Ticari Adı *</label>
                <input type="text" required className="form-input" value={editingProduct.commercialName} onChange={(e) => setEditingProduct({...editingProduct, commercialName: e.target.value})} />
              </div>
              <div className="form-grid-2col">
                <div>
                  <label className="input-label">Ruhsat Tarihi</label>
                  <input type="text" className="form-input" value={editingProduct.licenseDate} onChange={(e) => setEditingProduct({...editingProduct, licenseDate: e.target.value})} />
                </div>
                <div>
                  <label className="input-label">Ruhsat Numarası</label>
                  <input type="text" className="form-input" value={editingProduct.licenseNo} onChange={(e) => setEditingProduct({...editingProduct, licenseNo: e.target.value})} />
                </div>
              </div>
              <div className="form-grid-2col">
                <div>
                  <label className="input-label">Aktif Madde</label>
                  <input type="text" className="form-input" value={editingProduct.activeIngredient} onChange={(e) => setEditingProduct({...editingProduct, activeIngredient: e.target.value})} />
                </div>
                <div>
                  <label className="input-label">Uygulama Yöntemi</label>
                  <input type="text" className="form-input" value={editingProduct.method} onChange={(e) => setEditingProduct({...editingProduct, method: e.target.value})} />
                </div>
              </div>
              <div className="form-grid-2col">
                <div>
                  <label className="input-label">Antidotu</label>
                  <input type="text" className="form-input" value={editingProduct.antidote} onChange={(e) => setEditingProduct({...editingProduct, antidote: e.target.value})} />
                </div>
                <div>
                  <label className="input-label">Standart Miktar</label>
                  <input type="text" className="form-input" value={editingProduct.defaultQuantity} onChange={(e) => setEditingProduct({...editingProduct, defaultQuantity: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
                Güncelle
              </button>
            </form>
          </div>
        </div>
      )}
`;
    code = code.replace(
        '    </div>\n  );\n}',
        modalsUI + '\n    </div>\n  );\n}'
    );
}

fs.writeFileSync('frontend/src/App.jsx', code, 'utf8');
console.log('App.jsx UI patched');
