const fs = require('fs');

let code = fs.readFileSync('backend/server.js', 'utf8');

if (!code.includes('app.put(\'/api/ek1/products/:id\'')) {
    const editProductCode = `
app.put('/api/ek1/products/:id', auth, adminOnly, async (req, res) => {
  try {
    const updated = await db.updateEk1Product(req.params.id, req.body);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'İlaç güncellenemedi.' });
  }
});

`;
    code = code.replace(
        `app.delete('/api/ek1/products/:id', auth, adminOnly, async (req, res) => {`,
        editProductCode + `app.delete('/api/ek1/products/:id', auth, adminOnly, async (req, res) => {`
    );
}

if (!code.includes('/api/pests')) {
    const pestsRoutes = `
// === HAŞERE KÜTÜPHANESİ ===
app.get('/api/pests', auth, async (req, res) => {
  try {
    const pests = await db.getAllPests();
    res.json(pests);
  } catch (e) {
    res.status(500).json({ error: 'Haşereler getirilemedi.' });
  }
});

app.post('/api/pests', auth, adminOnly, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Haşere adı gereklidir.' });
  try {
    const p = await db.addPest(name);
    res.status(201).json(p);
  } catch (e) {
    res.status(500).json({ error: 'Haşere eklenemedi.' });
  }
});

app.put('/api/pests/:id', auth, adminOnly, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Haşere adı gereklidir.' });
  try {
    const updated = await db.updatePest(req.params.id, name);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Haşere güncellenemedi.' });
  }
});

app.delete('/api/pests/:id', auth, adminOnly, async (req, res) => {
  try {
    const success = await db.deletePest(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Haşere bulunamadı.' });
    }
    res.json({ message: 'Haşere başarıyla silindi.' });
  } catch (e) {
    res.status(500).json({ error: 'Haşere silinemedi.' });
  }
});

`;
    code = code.replace(
        `// 5) Aylık Raporlama Verilerini Getir`,
        pestsRoutes + `// 5) Aylık Raporlama Verilerini Getir`
    );
}

fs.writeFileSync('backend/server.js', code, 'utf8');
console.log('Server patch applied successfully');
