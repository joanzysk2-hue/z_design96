import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { philosophyCards } from '../data/philosophy';

export const PhilosophyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Buscamos por número (01., 02., etc) o podemos cambiar el data para tener slug
  const card = philosophyCards.find(c => c.number.includes(id || ''));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!card) {
    return (
      <div style={{ padding: '200px 5%', textAlign: 'center', color: 'var(--text-primary)' }}>
        <h1 className="text-gradient">CONTENIDO NO ENCONTRADO</h1>
        <button className="btn-outline" onClick={() => navigate('/')}>VOLVER AL INICIO</button>
      </div>
    );
  }

  return (
    <section style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh', background: 'var(--bg-primary)', paddingLeft: '5%', paddingRight: '5%' }}>
      <div className="mono" style={{ marginBottom: '20px', color: 'var(--accent-cyan)', display: 'flex', justifyContent: 'space-between' }}>
        <span>INFO_BLOCK // {card.number}</span>
        <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontFamily: 'inherit' }} onClick={() => navigate(-1)}>← VOLVER</button>
      </div>
      
      <div style={{ marginBottom: '60px' }}>
        <h1 className="text-gradient" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', marginBottom: '30px' }}>{card.title.toUpperCase()}</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'start' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
              {card.desc}
            </p>
            <div style={{ borderLeft: '2px solid var(--accent-cyan)', paddingLeft: '20px', marginTop: '40px' }}>
              <div className="mono" style={{ fontSize: '0.8rem', opacity: 0.5 }}>MISIÓN Y VISIÓN</div>
              <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '10px' }}>
                Este pilar define mi metodología de trabajo y la búsqueda constante de la excelencia técnica en cada desafío de ingeniería de diseño.
              </p>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '40px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="mono" style={{ fontSize: '0.7rem', opacity: 0.4, marginBottom: '20px' }}>METRIC_LOG_ACTIVE</div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="mono" style={{ fontSize: '0.7rem' }}>PRECISIÓN TÉCNICA</span>
                <span className="mono" style={{ fontSize: '0.7rem' }}>100%</span>
              </div>
              <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--accent-cyan)' }} />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="mono" style={{ fontSize: '0.7rem' }}>FACTIBILIDAD</span>
                <span className="mono" style={{ fontSize: '0.7rem' }}>95%</span>
              </div>
              <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)' }}>
                <div style={{ width: '95%', height: '100%', background: 'var(--accent-cyan)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
