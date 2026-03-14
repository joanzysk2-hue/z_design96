import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { projects } from '../../data/projects';

export const ProjectsGrid = () => {
  const containerRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.reveal'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }
  }, []);

  const heroProjects = projects.filter(p => p.isHero);

  return (
    <section ref={containerRef} id="projects">
      <div className="mono reveal" style={{ marginBottom: '20px' }}>03 // SELECTED WORKS</div>
      <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '60px' }}>
        <h2 className="text-gradient" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', margin: 0 }}>PROYECTOS</h2>
        <button className="btn-outline" style={{ padding: '12px 30px', fontSize: '0.8rem' }} onClick={() => window.location.href = '/proyectos'}>VER TODOS</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
        {heroProjects.map((project) => (
          <div key={project.id} className="reveal project-card" style={{ height: '600px', background: '#222', position: 'relative', overflow: 'hidden', backgroundImage: `url('${project.img}')`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px', cursor: 'pointer' }}
          onClick={() => navigate(`/proyectos/${project.id}`)}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(15,15,16,0.95) 0%, rgba(15,15,16,0.2) 50%, rgba(15,15,16,0) 100%)', transition: 'background 0.4s ease' }} className="card-overlay" />
            <div style={{ position: 'absolute', bottom: '30px', left: '30px', right: '30px', zIndex: 2 }}>
              <span className="mono" style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>{project.id} // {project.year} // {project.category.toUpperCase()}</span>
              <h3 style={{ fontSize: '2rem', marginTop: '10px', color: 'var(--text-primary)' }}>{project.title.toUpperCase()}</h3>
            </div>
          </div>
        ))}
      </div>
      
      {/* Botón de Cargar Más para la vista expandible */}
      <div className="reveal" style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
        <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 40px' }} onClick={() => navigate('/proyectos')}>
          DESPLEGAR MÁS PROYECTOS
        </button>
      </div>
    </section>
  );
};
