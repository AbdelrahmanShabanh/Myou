import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [code, setCode] = useState('');
  const [image, setImage] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [active, setActive] = useState(true);
  
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const res = await fetch('/api/discounts');
      const data = await res.json();
      if (Array.isArray(data)) setDiscounts(data);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    
    const token = localStorage.getItem('myou_admin_token');
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ image: reader.result })
        });
        const data = await res.json();
        if (data.url) setImage(data.url);
      } catch (err) {
        alert('Upload failed');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditId(null);
    setTitle('');
    setDiscountPercent('');
    setCode('');
    setImage('');
    setExpiresAt('');
    setActive(true);
    setShowModal(true);
  };

  const openEditModal = (d) => {
    setEditId(d._id);
    setTitle(d.title);
    setDiscountPercent(d.discountPercent);
    setCode(d.code);
    setImage(d.image || '');
    setExpiresAt(d.expiresAt ? new Date(d.expiresAt).toISOString().slice(0, 16) : '');
    setActive(d.active !== false);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this discount?')) return;
    const token = localStorage.getItem('myou_admin_token');
    try {
      const res = await fetch(`/api/discounts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchDiscounts();
    } catch(err) {
      alert(err.message);
    }
  };

  const toggleActive = async (d) => {
    const token = localStorage.getItem('myou_admin_token');
    try {
      await fetch(`/api/discounts/${d._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ active: !d.active })
      });
      setDiscounts(prev => prev.map(c => c._id === d._id ? { ...c, active: !d.active } : c));
    } catch (err) {
      alert('Failed to toggle active state');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('myou_admin_token');
    
    const url = editId ? `/api/discounts/${editId}` : '/api/discounts';
    const method = editId ? 'PUT' : 'POST';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          title, 
          discountPercent: Number(discountPercent), 
          code: code.toUpperCase(), 
          image, 
          expiresAt: expiresAt || null, 
          active 
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setShowModal(false);
      fetchDiscounts();
    } catch(err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner"/></div>;

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <div>
          <h1 className="section-title">Manage Discounts</h1>
          <Link to="/admin/dashboard" className="nav-link">← Back to Dashboard</Link>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>+ Add Discount</button>
      </div>

      <div className="admin-section">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Code</th>
              <th>% Off</th>
              <th>Active</th>
              <th style={{textAlign: 'right'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map(d => (
              <tr key={d._id}>
                <td>
                  {d.image ? <img src={d.image} alt={d.title} style={{width: 60, height: 40, objectFit: 'cover', borderRadius: '4px'}}/> : '-'}
                </td>
                <td><strong>{d.title}</strong></td>
                <td><span className="mono-id">{d.code}</span></td>
                <td><span className="badge badge-accent">{d.discountPercent}%</span></td>
                <td>
                  <button onClick={() => toggleActive(d)} style={{
                    background: d.active ? 'var(--color-success)' : 'var(--color-sold-out)',
                    color: 'white', padding: '4px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '11px'
                  }}>
                    {d.active ? 'YES' : 'NO'}
                  </button>
                </td>
                <td style={{textAlign: 'right'}}>
                  <button onClick={() => openEditModal(d)} className="btn btn-outline btn-sm" style={{marginRight: '8px'}}>Edit</button>
                  <button onClick={() => handleDelete(d._id)} className="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
            ))}
            {discounts.length === 0 && (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No discounts found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{marginBottom: '1.5rem', fontFamily: 'Playfair Display'}}>{editId ? 'Edit Discount' : 'Add Discount'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              
              <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label className="form-label">Discount % *</label>
                  <input type="number" className="form-input" min="1" max="100" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} required />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label className="form-label">Coupon Code *</label>
                  <input type="text" className="form-input" value={code} onChange={e => setCode(e.target.value)} style={{textTransform: 'uppercase'}} required />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Banner Image *</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {uploading && <span style={{fontSize: '12px', color: 'var(--color-accent)'}}>Uploading...</span>}
                {image && <img src={image} alt="preview" style={{width: '120px', height: '60px', objectFit: 'cover', marginTop: '10px', borderRadius: '8px'}}/>}
              </div>

              <div className="form-group">
                <label className="form-label">Expires At (Optional)</label>
                <input type="datetime-local" className="form-input" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
              </div>
              
              <div className="form-group" style={{flexDirection: 'row', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                <input type="checkbox" id="activeCheckbox" checked={active} onChange={e => setActive(e.target.checked)} />
                <label htmlFor="activeCheckbox" style={{fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>Active Discount</label>
              </div>
              
              <div style={{display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end'}}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>Save Discount</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-page { padding-top: 3rem; padding-bottom: 6rem; }
        .admin-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; }
        .admin-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; overflow-x: auto; }
        .mono-id { font-family: monospace; font-size: 0.85rem; color: var(--text-subtle); background: var(--bg-elevated); padding: 2px 6px; border-radius: 4px; }
      `}</style>
    </div>
  );
}
