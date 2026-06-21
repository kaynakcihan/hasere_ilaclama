const fs = require('fs');

let dbCode = fs.readFileSync('backend/database.js', 'utf8');

// Update default pests
dbCode = dbCode.replace(
    "{ id: 1, name: 'Karınca' }", "{ id: 1, name: 'Karınca', type: 'Yürüyen Haşere' }"
).replace(
    "{ id: 2, name: 'Karafatma' }", "{ id: 2, name: 'Karafatma', type: 'Yürüyen Haşere' }"
).replace(
    "{ id: 3, name: 'Hamam Böceği' }", "{ id: 3, name: 'Hamam Böceği', type: 'Yürüyen Haşere' }"
).replace(
    "{ id: 4, name: 'Fare' }", "{ id: 4, name: 'Fare', type: 'Kemirgen' }"
).replace(
    "{ id: 5, name: 'Pire' }", "{ id: 5, name: 'Pire', type: 'Yürüyen Haşere' }"
).replace(
    "{ id: 6, name: 'Tahta Kurusu' }", "{ id: 6, name: 'Tahta Kurusu', type: 'Yürüyen Haşere' }"
).replace(
    "{ id: 7, name: 'Yılan' }", "{ id: 7, name: 'Yılan', type: 'Sürüngen' }"
).replace(
    "{ id: 8, name: 'Akrep' }", "{ id: 8, name: 'Akrep', type: 'Yürüyen Haşere' }"
);

// Update addPest and updatePest
dbCode = dbCode.replace(
    "addPest: async (name) => {",
    "addPest: async (name, type) => {"
).replace(
    "const p = { id: newId, name };",
    "const p = { id: newId, name, type: type || '' };"
);

dbCode = dbCode.replace(
    "updatePest: async (id, name) => {",
    "updatePest: async (id, name, type) => {"
).replace(
    "d.pests[idx].name = name;",
    "d.pests[idx].name = name;\n    d.pests[idx].type = type || '';"
);

fs.writeFileSync('backend/database.js', dbCode, 'utf8');


let serverCode = fs.readFileSync('backend/server.js', 'utf8');

serverCode = serverCode.replace(
    "const { name } = req.body;\n  if (!name) return res.status(400).json({ error: 'Haşere adı gereklidir.' });\n  try {\n    const p = await db.addPest(name);",
    "const { name, type } = req.body;\n  if (!name) return res.status(400).json({ error: 'Haşere adı gereklidir.' });\n  try {\n    const p = await db.addPest(name, type);"
);

serverCode = serverCode.replace(
    "const { name } = req.body;\n  if (!name) return res.status(400).json({ error: 'Haşere adı gereklidir.' });\n  try {\n    const updated = await db.updatePest(req.params.id, name);",
    "const { name, type } = req.body;\n  if (!name) return res.status(400).json({ error: 'Haşere adı gereklidir.' });\n  try {\n    const updated = await db.updatePest(req.params.id, name, type);"
);

fs.writeFileSync('backend/server.js', serverCode, 'utf8');


let appCode = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// State
if (!appCode.includes('newPestTypeInput')) {
    appCode = appCode.replace(
        "const [newPestNameInput, setNewPestNameInput] = useState('');",
        "const [newPestNameInput, setNewPestNameInput] = useState('');\n  const [newPestTypeInput, setNewPestTypeInput] = useState('');"
    );
}

// Handlers
appCode = appCode.replace(
    "body: JSON.stringify({ name: newPestNameInput })",
    "body: JSON.stringify({ name: newPestNameInput, type: newPestTypeInput })"
).replace(
    "setNewPestNameInput('');\n      fetchPests();",
    "setNewPestNameInput('');\n      setNewPestTypeInput('');\n      fetchPests();"
);

appCode = appCode.replace(
    "body: JSON.stringify({ name: editingPest.name })",
    "body: JSON.stringify({ name: editingPest.name, type: editingPest.type })"
);

// Table Header
appCode = appCode.replace(
    "<th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #334155' }}>Haşere Adı</th>",
    "<th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #334155' }}>Haşere Adı</th>\n                          <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #334155' }}>Türü</th>"
);

// Table Row
appCode = appCode.replace(
    "<td style={{ padding: '10px', fontWeight: 'bold', color: '#F8FAFC' }}>{p.name}</td>",
    "<td style={{ padding: '10px', fontWeight: 'bold', color: '#F8FAFC' }}>{p.name}</td>\n                            <td style={{ padding: '10px', color: '#94A3B8' }}>{p.type || '-'}</td>"
);

// Add Modal
appCode = appCode.replace(
    `              <div className="input-group">\n                <label className="input-label">Haşere Adı *</label>\n                <input \n                  type="text" required className="form-input" \n                  value={newPestNameInput} onChange={(e) => setNewPestNameInput(e.target.value)} \n                />\n              </div>\n              <button type="submit"`,
    `              <div className="input-group">
                <label className="input-label">Haşere Adı *</label>
                <input 
                  type="text" required className="form-input" 
                  value={newPestNameInput} onChange={(e) => setNewPestNameInput(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label className="input-label">Haşere Türü (Örn: Kemirgen)</label>
                <input 
                  type="text" className="form-input" 
                  value={newPestTypeInput} onChange={(e) => setNewPestTypeInput(e.target.value)} 
                />
              </div>
              <button type="submit"`
);

// Edit Modal
appCode = appCode.replace(
    `              <div className="input-group">\n                <label className="input-label">Haşere Adı *</label>\n                <input \n                  type="text" required className="form-input" \n                  value={editingPest.name} onChange={(e) => setEditingPest({...editingPest, name: e.target.value})} \n                />\n              </div>\n              <button type="submit"`,
    `              <div className="input-group">
                <label className="input-label">Haşere Adı *</label>
                <input 
                  type="text" required className="form-input" 
                  value={editingPest.name} onChange={(e) => setEditingPest({...editingPest, name: e.target.value})} 
                />
              </div>
              <div className="input-group">
                <label className="input-label">Haşere Türü</label>
                <input 
                  type="text" className="form-input" 
                  value={editingPest.type || ''} onChange={(e) => setEditingPest({...editingPest, type: e.target.value})} 
                />
              </div>
              <button type="submit"`
);

fs.writeFileSync('frontend/src/App.jsx', appCode, 'utf8');

console.log('Successfully patched pest type fields in db, server, and frontend');
