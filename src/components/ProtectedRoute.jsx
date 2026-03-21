import { Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('myou_admin_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        {children}
      </div>

      <style>{`
        .admin-layout {
          display: flex;
          min-height: calc(100vh - 80px); /* Adjust based on navbar height */
        }
        .admin-content {
          flex: 1;
          padding: 2rem;
          background: var(--bg-body);
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .admin-layout {
            flex-direction: column;
          }
          .admin-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
