import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchAllProjects, deleteProject, type ProjectDB } from '../../lib/api';

export function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchAllProjects();
      setProjects(data);
    } catch {
      setError('Error al cargar proyectos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(`¿Seguro que quieres eliminar el proyecto "${id}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(id);
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Error al eliminar el proyecto.');
    } finally {
      setDeleting(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
      
      {/* Barra superior del Admin */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-color)',
        padding: '0 32px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div>
            <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>Z_DESIGN96</span>
            <h1 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em', margin: 0, textTransform: 'none' }}>
              Studio Admin
            </h1>
          </div>
          <div style={{ width: '1px', height: '32px', background: 'var(--border-color)' }} />
          <nav style={{ display: 'flex', gap: '4px' }}>
            {[
              { label: 'Proyectos', path: '/admin', active: true },
              { label: 'Contenido Web', path: '/admin/contenido', active: false },
            ].map(item => (
              <Link key={item.path} to={item.path} style={{
                padding: '6px 14px', borderRadius: '4px', textDecoration: 'none',
                fontSize: '0.85rem', fontWeight: 500,
                background: item.active ? 'var(--accent-cyan-glow)' : 'transparent',
                color: item.active ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: item.active ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                transition: 'all 0.2s',
              }}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
            {user?.email}
          </span>
          <button
            id="admin-signout"
            onClick={handleSignOut}
            style={{
              padding: '6px 14px', background: 'transparent',
              border: '1px solid var(--border-color)', borderRadius: '4px',
              color: 'var(--text-secondary)', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = 'hsl(0,80%,60%)'; (e.target as HTMLButtonElement).style.color = 'hsl(0,80%,70%)'; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = 'var(--border-color)'; (e.target as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
          >
            CERRAR SESIÓN
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main style={{ padding: '48px 32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Encabezado de sección */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <div className="mono" style={{ marginBottom: '8px', fontSize: '0.65rem' }}>GESTIÓN DE CONTENIDO</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Proyectos</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.9rem', fontWeight: 300, textTransform: 'none' }}>
              {loading ? '...' : `${projects.length} proyecto${projects.length !== 1 ? 's' : ''} en la base de datos`}
            </p>
          </div>
          <Link to="/admin/proyectos/nuevo" style={{
            padding: '12px 24px', background: 'var(--accent-cyan)',
            color: 'var(--bg-dark)', borderRadius: '4px', textDecoration: 'none',
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.15em', fontWeight: 700,
            transition: 'opacity 0.2s',
          }}>
            + NUEVO PROYECTO
          </Link>
        </div>

        {error && (
          <div style={{
            padding: '16px', marginBottom: '24px',
            background: 'hsla(0,70%,50%,0.1)', border: '1px solid hsla(0,70%,50%,0.3)',
            borderRadius: '4px', color: 'hsl(0,80%,70%)', fontSize: '0.9rem',
          }}>{error}</div>
        )}

        {/* Tabla de proyectos */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-secondary)' }}>
            <div className="mono">CARGANDO PROYECTOS...</div>
          </div>
        ) : projects.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px',
            border: '1px dashed var(--border-focus)', borderRadius: '8px',
          }}>
            <div className="mono" style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
              BASE DE DATOS VACÍA
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', textTransform: 'none', fontWeight: 300 }}>
              No hay proyectos aún. Crea el primero para comenzar.
            </p>
            <Link to="/admin/proyectos/nuevo" style={{
              padding: '10px 20px', border: '1px solid var(--accent-cyan)',
              color: 'var(--accent-cyan)', textDecoration: 'none',
              borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
            }}>
              CREAR PRIMER PROYECTO
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {/* Cabecera de tabla */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 200px 80px 120px 160px',
              gap: '16px', padding: '12px 20px',
              borderBottom: '1px solid var(--border-color)',
            }}>
              {['ID', 'TÍTULO', 'CATEGORÍA', 'AÑO', 'HERO', 'ACCIONES'].map(h => (
                <span key={h} className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{h}</span>
              ))}
            </div>

            {/* Filas */}
            {projects.map(p => (
              <div key={p.id} style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 200px 80px 120px 160px',
                gap: '16px', padding: '16px 20px',
                background: 'var(--bg-panel)', borderRadius: '4px',
                border: '1px solid var(--border-color)',
                alignItems: 'center',
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-focus)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
              >
                <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>{p.id}</span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {p.img && (
                    <img src={p.img} alt={p.title}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '3px', border: '1px solid var(--border-color)' }} 
                    />
                  )}
                  <span style={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.title}
                  </span>
                </div>

                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 300 }}>{p.category}</span>
                <span className="mono" style={{ fontSize: '0.75rem' }}>{p.year}</span>
                
                <span style={{
                  display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                  fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
                  background: p.is_hero ? 'var(--accent-cyan-glow)' : 'transparent',
                  color: p.is_hero ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  border: p.is_hero ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                }}>
                  {p.is_hero ? 'HERO' : 'NORMAL'}
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/admin/proyectos/${p.id}`} style={{
                    flex: 1, padding: '6px', textAlign: 'center',
                    border: '1px solid var(--border-color)', borderRadius: '3px',
                    color: 'var(--text-primary)', textDecoration: 'none',
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em',
                    transition: 'all 0.2s',
                  }}>EDITAR</Link>
                  <button
                    id={`delete-${p.id}`}
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                    style={{
                      flex: 1, padding: '6px',
                      background: 'transparent', border: '1px solid var(--border-color)',
                      borderRadius: '3px', color: 'hsl(0,70%,60%)',
                      cursor: 'pointer', fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem', letterSpacing: '0.1em',
                      transition: 'all 0.2s',
                    }}
                  >
                    {deleting === p.id ? '...' : 'BORRAR'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
