const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

const handlers = `
  const handleEditProductSubmit = async (e) => {
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
        body: JSON.stringify({ name: newPestNameInput, type: newPestTypeInput })
      });
      if (!response.ok) throw new Error('Haşere eklenemedi.');
      setSuccess('Haşere başarıyla eklendi.');
      setShowAddPestModal(false);
      setNewPestNameInput('');
      setNewPestTypeInput('');
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
        body: JSON.stringify({ name: editingPest.name, type: editingPest.type })
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

`;

if (!code.includes('const handleAddPestSubmit')) {
    code = code.replace(
        '  // Giriş Yapıldıysa ANA UYGULAMAYI göster',
        handlers + '  // Giriş Yapıldıysa ANA UYGULAMAYI göster'
    );
    fs.writeFileSync('frontend/src/App.jsx', code, 'utf8');
    console.log('Successfully injected handlers!');
} else {
    console.log('Handlers already exist.');
}
