const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

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

code = code.replace(/}\s*\)\s*}\s*<\/div>\s*\)\s*;\s*}\s*$/m, "      )}\n" + modalsUI + "\n    </div>\n  );\n}\n");

fs.writeFileSync('frontend/src/App.jsx', code, 'utf8');
console.log('App.jsx modal UI patched via regex');
