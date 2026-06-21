const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. Change pestOptionsList to be dynamic state
if (!code.includes('const [pests, setPests] = useState([]);')) {
    code = code.replace(
        "const pestOptionsList = ['Karınca', 'Karafatma', 'Hamam Böceği', 'Fare', 'Pire', 'Tahta Kurusu', 'Yılan', 'Akrep'];",
        "const [pests, setPests] = useState([]);\n  const pestOptionsList = pests.map(p => p.name);\n  const [showEditProductModal, setShowEditProductModal] = useState(false);\n  const [editingProduct, setEditingProduct] = useState(null);\n  const [showAddPestModal, setShowAddPestModal] = useState(false);\n  const [showEditPestModal, setShowEditPestModal] = useState(false);\n  const [editingPest, setEditingPest] = useState(null);\n  const [newPestNameInput, setNewPestNameInput] = useState('');"
    );
}

// 2. Add fetchPests
if (!code.includes('const fetchPests = async () => {')) {
    code = code.replace(
        "// İlaç kütüphanesini çek",
        "// Haşere Kütüphanesini Çek\n  const fetchPests = async () => {\n    try {\n      const response = await fetch(`${API_URL}/api/pests`, {\n        headers: { 'Authorization': `Bearer ${token}` }\n      });\n      const data = await response.json();\n      if (!response.ok) throw new Error(data.error || 'Haşereler yüklenemedi.');\n      setPests(data);\n    } catch (err) {\n      setError(err.message);\n    }\n  };\n\n  // İlaç kütüphanesini çek"
    );
}

// 3. Call fetchPests in useEffect
if (code.includes('fetchEk1Products();') && !code.includes('fetchPests();')) {
    code = code.replace('fetchEk1Products();', 'fetchEk1Products();\n      fetchPests();');
}

// 4. Add handlers for Pests and Edit Product
if (!code.includes('const handleAddPestSubmit = async (e) => {')) {
    code = code.replace(
        "const handleAddBiocideSubmit = async (e) => {",
        `const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const response = await fetch(\`\${API_URL}/api/ek1/products/\${editingProduct.id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
        body: JSON.stringify(editingProduct)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'İlaç güncellenemedi.');
      setSuccess('İlaç başarıyla güncellendi.');
      setShowEditProductModal(false);
      fetchEk1Products();
    } catch (err) { setError(err.message); }
  };

  const handleAddPestSubmit = async (e) => {
    e.preventDefault();
    if (!newPestNameInput) return;
    try {
      const response = await fetch(\`\${API_URL}/api/pests\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
        body: JSON.stringify({ name: newPestNameInput })
      });
      if (!response.ok) throw new Error('Haşere eklenemedi.');
      setSuccess('Haşere başarıyla eklendi.');
      setShowAddPestModal(false);
      setNewPestNameInput('');
      fetchPests();
    } catch (err) { setError(err.message); }
  };

  const handleEditPestSubmit = async (e) => {
    e.preventDefault();
    if (!editingPest || !editingPest.name) return;
    try {
      const response = await fetch(\`\${API_URL}/api/pests/\${editingPest.id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
        body: JSON.stringify({ name: editingPest.name })
      });
      if (!response.ok) throw new Error('Haşere güncellenemedi.');
      setSuccess('Haşere güncellendi.');
      setShowEditPestModal(false);
      fetchPests();
    } catch (err) { setError(err.message); }
  };

  const handleDeletePest = async (id) => {
    if (!window.confirm('Bu haşereyi kütüphaneden silmek istediğinize emin misiniz?')) return;
    try {
      const response = await fetch(\`\${API_URL}/api/pests/\${id}\`, {
        method: 'DELETE',
        headers: { 'Authorization': \`Bearer \${token}\` }
      });
      if (!response.ok) throw new Error('Haşere silinemedi.');
      setSuccess('Haşere başarıyla silindi.');
      fetchPests();
    } catch (err) { setError(err.message); }
  };

  const handleAddBiocideSubmit = async (e) => {`
    );
}

fs.writeFileSync('frontend/src/App.jsx', code, 'utf8');
console.log('App.jsx states and handlers patched');
