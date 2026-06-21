const fs = require('fs');
const appPath = 'frontend/src/App.jsx';
let code = fs.readFileSync(appPath, 'utf8');

// Update Add Biocide Form
const addTarget = `                <div>
                  <label className="input-label">Standart Doz</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Örn: 10 gr"
                    value={newBiocide.defaultQuantity}
                    onChange={(e) => setNewBiocide({ ...newBiocide, defaultQuantity: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '20px' }}>`;

const addReplacement = `                <div>
                  <label className="input-label">Standart Doz</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Örn: 10 gr"
                    value={newBiocide.defaultQuantity}
                    onChange={(e) => setNewBiocide({ ...newBiocide, defaultQuantity: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-3col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '15px' }}>
                <div>
                  <label className="input-label">Stok Miktarı</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-input" 
                    placeholder="0"
                    value={newBiocide.stock}
                    onChange={(e) => setNewBiocide({ ...newBiocide, stock: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label">Birim</label>
                  <select 
                    className="form-input" 
                    value={newBiocide.unit}
                    onChange={(e) => setNewBiocide({ ...newBiocide, unit: e.target.value })}
                  >
                    <option value="Litre">Litre</option>
                    <option value="ml">ml</option>
                    <option value="Kg">Kg</option>
                    <option value="gr">gr</option>
                    <option value="Adet">Adet</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Kritik Uyarı Sınırı</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-input" 
                    placeholder="10"
                    value={newBiocide.criticalStock}
                    onChange={(e) => setNewBiocide({ ...newBiocide, criticalStock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '20px' }}>`;

code = code.replace(addTarget, addReplacement);

// Update Edit Biocide Form
const editTarget = `                <div>
                  <label className="input-label">Standart Doz</label>
                  <input type="text" className="form-input" value={editingProduct.defaultQuantity} onChange={(e) => setEditingProduct({...editingProduct, defaultQuantity: e.target.value})} />
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '20px' }}>`;

const editReplacement = `                <div>
                  <label className="input-label">Standart Doz</label>
                  <input type="text" className="form-input" value={editingProduct.defaultQuantity} onChange={(e) => setEditingProduct({...editingProduct, defaultQuantity: e.target.value})} />
                </div>
              </div>

              <div className="form-grid-3col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '15px' }}>
                <div>
                  <label className="input-label">Stok Miktarı</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-input" 
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                  />
                </div>
                <div>
                  <label className="input-label">Birim</label>
                  <select 
                    className="form-input" 
                    value={editingProduct.unit || 'Litre'}
                    onChange={(e) => setEditingProduct({...editingProduct, unit: e.target.value})}
                  >
                    <option value="Litre">Litre</option>
                    <option value="ml">ml</option>
                    <option value="Kg">Kg</option>
                    <option value="gr">gr</option>
                    <option value="Adet">Adet</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Kritik Uyarı Sınırı</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-input" 
                    value={editingProduct.criticalStock || 10}
                    onChange={(e) => setEditingProduct({...editingProduct, criticalStock: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '20px' }}>`;

code = code.replace(editTarget, editReplacement);

fs.writeFileSync(appPath, code, 'utf8');
console.log('Frontend Modals patched.');
