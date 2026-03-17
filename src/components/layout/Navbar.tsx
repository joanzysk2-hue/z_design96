import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="glass-panel" style={{ position: 'fixed', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', zIndex: 100 }}>
      <Link to="/" style={{ fontWeight: '800', letterSpacing: '4px', fontSize: '1.2rem', textDecoration: 'none', color: 'inherit' }}>
        <span className="text-gradient">Z DESIGN</span>
      </Link>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <div className="mono hidden md:block" style={{ opacity: 0.8 }}>EST. 2014</div>
        <Link to="/proyectos" className="mono" style={{ textDecoration: 'none', color: 'var(--text-primary)', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
          PORTAFOLIO
        </Link>
        <button onClick={() => {
            const footer = document.getElementById('contact-simple');
            if(footer) footer.scrollIntoView({ behavior: 'smooth' });
            else window.location.href = '/#contact-simple';
          }} 
          style={{ background: 'var(--accent-cyan)', color: 'black', border: 'none', padding: '10px 20px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase' }}>
          CONTACTO
        </button>
      </div>
    </nav>
  );
};
