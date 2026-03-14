import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

export const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.reveal'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power4.out" }
      );
    }
  }, []);

  const handleContactClick = () => {
    const footer = document.getElementById('contact-simple');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={containerRef} id="hero">
      <div className="mono reveal" style={{ marginBottom: '20px' }}>00 // Joan Zyskindowicz</div>
      <h1 className="reveal" style={{ fontSize: 'clamp(4rem, 10vw, 5rem)', lineHeight: '0.85', margin: '10px 0', marginLeft: '-5px' }}>
         <br /> <span className="text-gradient" style={{ color: 'transparent', WebkitTextStroke: '1px var(--text-primary)' }}>ESTUDIO DEL DISEÑO INDUSTRIAL</span>
      </h1>
      <p className="reveal" style={{ maxWidth: '600px', fontSize: '1.25rem', opacity: '0.7', marginTop: '30px', lineHeight: '1.6' }}>
        Diseño industrial aplicado a espacios y objetos. Precisión técnica de grado ingeniería para proyectos que exigen excelencia.
      </p>
      <div className="reveal" style={{ marginTop: '50px', display: 'flex', gap: '20px' }}>
        <button className="btn-primary" onClick={handleContactClick}>
          INICIAR PROYECTO
        </button>
        <button className="btn-outline" onClick={() => navigate('/proyectos')}>
          VER OBRAS
        </button>
      </div>
    </section>
  );
};
