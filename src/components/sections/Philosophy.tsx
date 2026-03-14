import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { philosophyCards } from '../../data/philosophy';

export const Philosophy = () => {
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

  return (
    <section ref={containerRef} id="philosophy" style={{ padding: '60px 5% 150px 5%' }}>
      <div className="mono reveal">02 // MATERIAL INTELLIGENCE</div>
      <h2 className="reveal text-gradient" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', margin: '20px 0 60px 0' }}>FILOSOFÍA TÉCNICA</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
        {philosophyCards.map((item, index) => (
          <div key={index} className="reveal" style={{ 
            position: 'relative', 
            padding: '40px', 
            borderRadius: '4px 20px 4px 4px', 
            border: '1px solid rgba(255,255,255,0.1)', 
            cursor: 'pointer',
            overflow: 'hidden',
            transition: 'transform 0.3s, border-color 0.3s',
            minHeight: '280px'
          }}
          onClick={() => item.link && navigate(item.link)}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'var(--accent-cyan)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }}>
            {/* Fondo simulando el contenido de la carpeta (Preview Proyecto / Blueprint) */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 10px)',
              zIndex: 0,
              opacity: 0.5
            }} />
            
            {/* Carátula Translúcida */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(15, 15, 16, 0.45)', // Más translúcido
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              zIndex: 1
            }} />

            {/* Contenido (Textos sobre la carátula) */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '20px', fontSize: '1.5rem' }}>{item.number} {item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.1rem' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
