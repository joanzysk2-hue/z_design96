import { useEffect, useRef, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Instagram, Linkedin, Mail, Upload, Send } from 'lucide-react';
import gsap from 'gsap';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const Footer = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.reveal'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:tu_correo@ejemplo.com?subject=Nuevo Proyecto de ${formData.name}&body=Teléfono: ${formData.phone}%0ACorreo: ${formData.email}%0A%0A${formData.message}`;
    window.location.href = mailtoLink;
  };

  return (
    <footer ref={containerRef} id="contact-simple" style={{ position: 'relative', overflow: 'hidden', borderTop: '1px solid var(--border-color)', background: 'var(--bg-panel)' }}>
      {/* Background World Map */}
      {/* Ajustado: scale reducido a 190, manteniendo top a 40px */}
      <div style={{ position: 'absolute', top: '40px', left: 0, width: '100%', height: 'calc(100% - 40px)', opacity: 0.08, pointerEvents: 'none', zIndex: 0 }}>
        <ComposableMap projectionConfig={{ scale: 190 }}>
          <Geographies geography={geoUrl}>
            {({ geographies }: any) =>
              geographies.map((geo: any) => (
                <Geography key={geo.rsmKey} geography={geo} fill="var(--text-primary)" stroke="var(--bg-dark)" strokeWidth={0.5} />
              ))
            }
          </Geographies>
          {/* Marcador Argentina */}
          <Marker coordinates={[-63.6167, -38.4161]}>
            <circle r={8} fill="var(--accent-cyan)" />
            <circle r={16} fill="var(--accent-cyan-glow)" />
          </Marker>
          {/* Marcador España */}
          <Marker coordinates={[-3.7038, 40.4168]}>
            <circle r={8} fill="var(--accent-cyan)" />
            <circle r={16} fill="var(--accent-cyan-glow)" />
          </Marker>
        </ComposableMap>
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px', padding: '100px 5%' }}>
        {/* Lado Izquierdo: Info & Call to Action */}
        <div className="reveal">
          <div className="mono" style={{ marginBottom: '20px' }}>04 // START A PROJECT</div>
          <h2 className="text-gradient" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '20px 0 40px 0' }}>MATERIALIZA <br/> TUS IDEAS</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '40px', maxWidth: '400px' }}>
            Operando a nivel internacional desde España y Argentina. Ingeniería de diseño para proyectos de la más alta exigencia.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
            <div className="mono" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '15px' }}>
               <span style={{ height: '1px', width: '30px', background: 'var(--accent-cyan)' }}></span> MADRID, ESPAÑA
            </div>
            <div className="mono" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '15px' }}>
               <span style={{ height: '1px', width: '30px', background: 'var(--accent-cyan)' }}></span> BUENOS AIRES, ARGENTINA
            </div>
          </div>
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="reveal glass-panel" style={{ padding: '40px', borderRadius: '4px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <input type="text" name="name" placeholder="Nombre completo" required value={formData.name} onChange={handleChange} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', color: 'white', padding: '15px 0', outline: 'none', fontFamily: 'inherit' }} />
              <input type="tel" name="phone" placeholder="Teléfono" required value={formData.phone} onChange={handleChange} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', color: 'white', padding: '15px 0', outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <input type="email" name="email" placeholder="Correo Electrónico" required value={formData.email} onChange={handleChange} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', color: 'white', padding: '15px 0', outline: 'none', fontFamily: 'inherit' }} />
            <textarea name="message" placeholder="Detalles o petición del proyecto..." required rows={4} value={formData.message} onChange={handleChange} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', color: 'white', padding: '15px 0', outline: 'none', resize: 'none', fontFamily: 'inherit' }}></textarea>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Upload size={18} /> Adjuntar archivos
                <input type="file" style={{ display: 'none' }} multiple />
              </label>
              <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                ENVIAR <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div style={{ padding: '40px 5%', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ fontWeight: '800', fontSize: '1.2rem', letterSpacing: '2px' }}>
            <span className="text-gradient">Z_DESIGN</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>© 2026 DESIGNED BY ANDY IA / JOAN Z.</p>
        </div>
        <div style={{ display: 'flex', gap: '25px' }}>
          <a href="#" target="_blank" rel="noreferrer" title="Instagram" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}><Instagram size={20} /></a>
          <a href="#" target="_blank" rel="noreferrer" title="LinkedIn" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}><Linkedin size={20} /></a>
          <a href="mailto:tu_correo@ejemplo.com" title="Email" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}><Mail size={20} /></a>
        </div>
      </div>
    </footer>
  );
};
