import { useNavigate, Link, Outlet } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, FolderKanban, FileText, LogOut, ExternalLink } from 'lucide-react';

export const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0b', color: 'white' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '280px', 
        borderRight: '1px solid rgba(255,255,255,0.05)', 
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh'
      }}>
        <div className="mono" style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', marginBottom: '40px' }}>
          Z_STUDIO // CMS v1.0
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/admin" style={navItemStyle}>
            <LayoutDashboard size={20} />
            DASHBOARD
          </Link>
          <Link to="/admin/projects" style={navItemStyle}>
            <FolderKanban size={20} />
            PROYECTOS
          </Link>
          <Link to="/admin/content" style={navItemStyle}>
            <FileText size={20} />
            CONTENIDO WEB
          </Link>
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/" target="_blank" style={{ ...navItemStyle, color: 'var(--accent-cyan)', opacity: 0.8 }}>
            <ExternalLink size={20} />
            VER WEB PÚBLICA
          </Link>
          <button onClick={handleLogout} style={{ ...navItemStyle, background: 'none', border: 'none', cursor: 'pointer', color: '#ff4b4b' }}>
            <LogOut size={20} />
            CERRAR SESIÓN
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ marginLeft: '280px', flex: 1, padding: '60px' }}>
        <Outlet />
      </main>
    </div>
  );
};

const navItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 15px',
  borderRadius: '4px',
  textDecoration: 'none',
  color: 'white',
  fontSize: '0.9rem',
  fontFamily: 'var(--font-mono)',
  transition: 'background 0.3s, opacity 0.3s',
  opacity: 0.6
};
