import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [parent, setParent] = useState("");
  const [active, setActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // By using ?all=true we can see active and inactive, and no parent=true to see subcategories
      const res = await fetch("/api/categories?all=true");
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const token = localStorage.getItem("myou_admin_token");
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: reader.result }),
        });
        const data = await res.json();
        if (data.url) setImage(data.url);
      } catch (err) {
        alert("Upload failed");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditId(null);
    setName("");
    setDescription("");
    setImage("");
    setParent("");
    setActive(true);
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditId(cat._id);
    setName(cat.name);
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setParent(cat.parent ? cat.parent._id || cat.parent : "");
    setActive(cat.active);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    const token = localStorage.getItem("myou_admin_token");
    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleActive = async (cat) => {
    const token = localStorage.getItem("myou_admin_token");
    try {
      await fetch(`/api/categories?id=${cat._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: !cat.active }),
      });
      setCategories((prev) =>
        prev.map((c) =>
          c._id === cat._id ? { ...c, active: !cat.active } : c,
        ),
      );
    } catch (err) {
      alert("Failed to toggle active state");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("myou_admin_token");

    const url = editId ? `/api/categories?id=${editId}` : "/api/categories";
    const method = editId ? "PUT" : "POST";

    // Only send parent ID if we selected one
    const payload = {
      name,
      description,
      image,
      active,
      parent: parent || null,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowModal(false);
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const generatedSlug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  if (loading)
    return (
      <div className="page-loader">
        <div className="spinner" />
      </div>
    );

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <div>
          <h1 className="section-title">Manage Categories</h1>
          <Link to="/admin/dashboard" className="nav-link">
            ← Back to Dashboard
          </Link>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Category
        </button>
      </div>

      <div className="admin-section">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Parent</th>
              <th>Slug</th>
              <th>Active</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td>
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <strong>{c.name}</strong>
                </td>
                <td>
                  {c.parent ? (
                    <span className="mono-id">
                      {c.parent.name || c.parent.slug || "Unknown"}
                    </span>
                  ) : (
                    <em
                      style={{
                        color: "var(--text-subtle)",
                        fontSize: "0.85rem",
                      }}
                    >
                      Main
                    </em>
                  )}
                </td>
                <td>
                  <span className="mono-id">{c.slug}</span>
                </td>
                <td>
                  <button
                    onClick={() => toggleActive(c)}
                    style={{
                      background: c.active
                        ? "var(--color-success)"
                        : "var(--color-sold-out)",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "11px",
                    }}
                  >
                    {c.active ? "YES" : "NO"}
                  </button>
                </td>
                <td style={{ textAlign: "right" }}>
                  <button
                    onClick={() => openEditModal(c)}
                    className="btn btn-outline btn-sm"
                    style={{ marginRight: "8px" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2
              style={{ marginBottom: "1.5rem", fontFamily: "Playfair Display" }}
            >
              {editId ? "Edit Category" : "Add Category"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-subtle)",
                  marginBottom: "1rem",
                  marginTop: "-0.5rem",
                }}
              >
                Preview Slug: {generatedSlug || "..."}
              </div>

              <div className="form-group">
                <label className="form-label">Parent Category</label>
                <select
                  className="form-input"
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                >
                  <option value="">None (Main Category)</option>
                  {categories.map((c) =>
                    c._id !== editId ? (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ) : null,
                  )}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {uploading && (
                  <span
                    style={{ fontSize: "12px", color: "var(--color-accent)" }}
                  >
                    Uploading...
                  </span>
                )}
                {image && (
                  <img
                    src={image}
                    alt="preview"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      marginTop: "10px",
                      borderRadius: "8px",
                    }}
                  />
                )}
              </div>

              <div
                className="form-group"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  id="activeCheckbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                <label
                  htmlFor="activeCheckbox"
                  style={{
                    fontWeight: 500,
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Active Category
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "2rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploading}
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-page { padding-top: 3rem; padding-bottom: 6rem; }
        .admin-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; }
        .admin-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; overflow-x: auto; }
        .mono-id { font-family: monospace; font-size: 0.85rem; color: var(--text-subtle); }
      `}</style>
    </div>
  );
}
