import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar.jsx";

const DEFAULT_GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbia",
  "Ismailia",
  "Menofia",
  "Minya",
  "Qalyubia",
  "New Valley",
  "North Sinai",
  "Port Said",
  "Damietta",
  "Sharqia",
  "South Sinai",
  "Suez",
  "Luxor",
  "Matrouh",
  "Qena",
  "Sohag",
  "Aswan",
  "Assiut",
  "Beni Suef",
].sort();

export default function AdminDelivery() {
  const [fees, setFees] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadFees = async () => {
    try {
      const res = await fetch("/api/delivery_fees");
      const data = await res.json();

      const feesMap = {};
      // Initialize all to 100 first as requested
      DEFAULT_GOVERNORATES.forEach((gov) => {
        feesMap[gov] = 100;
      });

      // Override with DB values if any exist
      if (Array.isArray(data)) {
        data.forEach((item) => {
          feesMap[item.governorate] = item.fee;
        });
      }

      setFees(feesMap);
    } catch (err) {
      setError("Failed to load delivery fees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const governoratesArray = Object.keys(fees).map((gov) => ({
      governorate: gov,
      fee: Number(fees[gov]),
    }));

    try {
      const res = await fetch("/api/delivery_fees", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ governorates: governoratesArray }),
      });

      if (!res.ok) throw new Error("Failed to update fees");

      setSuccess("Delivery fees updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const setAllToValue = (val) => {
    const newFees = { ...fees };
    Object.keys(newFees).forEach((gov) => {
      newFees[gov] = val;
    });
    setFees(newFees);
  };

  if (loading)
    return (
      <div className="admin-page">
        <div className="spinner" />
      </div>
    );

  return (
    <div className="admin-page">
     
      <div className="admin-content">
        <div className="admin-header">
          <h2>Delivery Fees</h2>
          <div className="header-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setAllToValue(100)}
            >
              Set All to 100
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="admin-card">
          <form className="fees-grid" onSubmit={handleSave}>
            {Object.keys(fees).map((gov) => (
              <div key={gov} className="form-group fee-group">
                <label>{gov}</label>
                <div className="input-group">
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={fees[gov]}
                    onChange={(e) =>
                      setFees({ ...fees, [gov]: e.target.value })
                    }
                  />
                  <span className="input-addon">EGP</span>
                </div>
              </div>
            ))}
          </form>
        </div>
      </div>

      <style>{`
        .fees-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        .fee-group {
          margin-bottom: 0;
          display: flex;
          flex-direction: column;
        }
        .fee-group label {
          margin-bottom: 0.5rem;
          font-weight: 600;
          font-size: 0.95rem;
        }
        .header-actions {
          display: flex;
          gap: 1rem;
        }
        .input-group {
          display: flex;
          align-items: center;
          width: 100%;
        }
        .input-addon {
          background: var(--bg);
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-left: none;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          color: var(--text-muted);
          font-weight: 500;
        }
        .input-group input {
          border-radius: var(--radius-sm) 0 0 var(--radius-sm);
          width: 100%;
        }
        
        @media (max-width: 600px) {
          .fees-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          .header-actions {
            flex-direction: column;
            width: 100%;
          }
          .header-actions button {
            width: 100%;
          }
          .admin-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
