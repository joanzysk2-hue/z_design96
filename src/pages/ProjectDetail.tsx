import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <div style={{ padding: '200px 5%', textAlign: 'center', color: 'var(--text-primary)' }}>
        <h1 className="text-gradient">PROYECTO NO ENCONTRADO</h1>
        <button className="btn-outline" onClick={() => navigate('/proyectos')}>VOLVER AL CATÁLOGO</button>
      </div>
    );
  }

  return (
    <section style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh', background: 'var(--bg-primary)', paddingLeft: '5%', paddingRight: '5%' }}>
      <div className="mono" style={{ marginBottom: '20px', color: 'var(--accent-cyan)', display: 'flex', justifyContent: 'space-between' }}>
        <span>REF: {project.id} // {project.year}</span>
        <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontFamily: 'inherit' }} onClick={() => navigate(-1)}>← VOLVER</button>
      </div>
      
      <div style={{ marginBottom: '60px' }}>
        <h1 className="text-gradient" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', marginBottom: '30px' }}>{project.title.toUpperCase()}</h1>
        <div className="mono" style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '40px' }}>CATEGORÍA: {project.category.toUpperCase()}</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'start' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
              {project.description}
            </p>
            <div style={{ borderLeft: '2px solid var(--accent-cyan)', paddingLeft: '20px', marginTop: '40px' }}>
              <div className="mono" style={{ fontSize: '0.8rem', opacity: 0.5 }}>RESUMEN DE CARPETA</div>
              <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '10px' }}>
                Este contenedor incluye la documentación técnica, planos de fabricación y registros fotográficos originales del proceso de diseño.
              </p>
            </div>
          </div>
          
          <div style={{ position: 'relative' }}>
            <img src={project.img} alt={project.title} style={{ width: '100%', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
        </div>
      </div>

      {/* Galería Visual */}
      {(project.gallery && project.gallery.length > 0) ? (
        <div style={{ marginTop: '100px' }}>
          <div className="mono" style={{ marginBottom: '40px', fontSize: '0.8rem' }}>ARCHIVOS RELACIONADOS // GALERÍA</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {project.gallery.map((imgUrl, i) => (
              <div key={i} className="glass-panel" style={{ 
                aspectRatio: '1', 
                background: '#1a1a1c', 
                borderRadius: '4px', 
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.9,
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <img src={imgUrl} alt={`Galería ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Documentos */}
      {(project.documents && project.documents.length > 0) ? (
        <div style={{ marginTop: '60px' }}>
          <div className="mono" style={{ marginBottom: '30px', fontSize: '0.8rem' }}>DOCUMENTACIÓN TÉCNICA</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {project.documents.map((doc, i) => (
              <a 
                key={i} 
                href={doc.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="glass-panel" 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '20px',
                  textDecoration: 'none',
                  color: 'inherit',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  transition: 'background 0.3s'
                }}
              >
                <span className="mono" style={{ fontSize: '0.9rem' }}>{doc.name.toUpperCase()}</span>
                <span className="mono" style={{ opacity: 0.5 }}>→</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};
