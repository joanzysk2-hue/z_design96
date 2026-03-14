import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';

export const AllProjects = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh', background: 'var(--bg-primary)', paddingLeft: '5%', paddingRight: '5%' }}>
      <div className="mono" style={{ marginBottom: '20px', color: 'var(--accent-cyan)' }}>03 // FULL ARCHIVE</div>
      <h1 className="text-gradient" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', marginBottom: '60px' }}>TODOS LOS PROYECTOS</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
        {projects.map((project) => (
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
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'var(--text-primary)' }}>{project.title.toUpperCase()}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>{project.description}</p>
            <div className="mono" style={{ fontSize: '0.7rem', opacity: 0.5 }}>CATEGORÍA: {project.category.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
