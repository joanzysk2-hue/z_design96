import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';

// Extraer categorías únicas de todos los proyectos
const allCategories = ['TODOS', ...Array.from(new Set(projects.map(p => p.category.toUpperCase())))];

export const AllProjects = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('TODOS');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = activeCategory === 'TODOS'
    ? projects
    : projects.filter(p => p.category.toUpperCase() === activeCategory);

  return (
    <section style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh', background: 'var(--bg-primary)', paddingLeft: '5%', paddingRight: '5%' }}>
      <div className="mono" style={{ marginBottom: '20px', color: 'var(--accent-cyan)' }}>03 // FULL ARCHIVE</div>
      <h1 className="text-gradient" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', marginBottom: '40px' }}>TODOS LOS PROYECTOS</h1>

      {/* ── Filtros de Categoría ── */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '60px' }}>
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="mono"
            style={{
              padding: '8px 20px',
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              background: activeCategory === cat ? 'var(--accent-cyan)' : 'transparent',
              color: activeCategory === cat ? 'var(--bg-dark)' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: activeCategory === cat ? 'var(--accent-cyan)' : 'var(--border-color)',
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'all 0.25s',
              fontWeight: activeCategory === cat ? 700 : 400,
            }}
            onMouseOver={(e) => {
              if (activeCategory !== cat) {
                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseOut={(e) => {
              if (activeCategory !== cat) {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Grilla de Proyectos ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
        {filtered.map((project) => (
          <div key={project.id} className="glass-panel" style={{
            padding: '30px',
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.05)',
            transition: 'transform 0.3s',
            cursor: 'pointer'
          }}
          onClick={() => navigate(`/proyectos/${project.id}`)}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ height: '200px', background: '#1a1a1c', borderRadius: '2px', marginBottom: '25px', overflow: 'hidden', backgroundImage: `url('${project.img}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="mono" style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', marginBottom: '10px' }}>{project.id} // {project.year}</div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '15px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.title.toUpperCase()}</h3>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              lineHeight: '1.6',
              marginBottom: '20px',
              minHeight: '4.2em',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {project.description.length > 130
                ? `${project.description.slice(0, 130).trim()}...`
                : project.description}
            </p>
            <div className="mono" style={{ fontSize: '0.7rem', opacity: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>CATEGORÍA: {project.category.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mono" style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '80px' }}>
          No hay proyectos en esta categoría.
        </div>
      )}
    </section>
  );
};
