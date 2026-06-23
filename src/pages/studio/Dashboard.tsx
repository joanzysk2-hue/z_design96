import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FolderKanban, Image as ImageIcon, FileText } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState({ projects: 0, images: 0, content: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: prjCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
      const { count: imgCount } = await supabase.from('project_gallery').select('*', { count: 'exact', head: true });

      setStats({
        projects: prjCount || 0,
        images: imgCount || 0,
        content: 0 // Próximamente
      });
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="mono" style={{ color: 'var(--accent-cyan)', marginBottom: '10px' }}>PANEL DE CONTROL</div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>ESTADO DEL PORTFOLIO</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <StatCard 
          icon={<FolderKanban size={30} />} 
          label="PROYECTOS PUBLICADOS" 
          value={stats.projects} 
        />
        <StatCard 
          icon={<ImageIcon size={30} />} 
          label="IMÁGENES EN GALERÍA" 
          value={stats.images} 
        />
        <StatCard 
          icon={<FileText size={30} />} 
          label="SECCIONES DINÁMICAS" 
          value={stats.content} 
        />
      </div>

      <div className="glass-panel" style={{ marginTop: '40px', padding: '30px', borderRadius: '8px' }}>
        <h3 className="mono" style={{ fontSize: '0.9rem', marginBottom: '20px', opacity: 0.5 }}>NOTAS DE ANDY</h3>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          Bienvenido, Andy. El sistema está conectado correctamente a Supabase. 
          Puedes empezar a cargar nuevos proyectos o editar los existentes desde la barra lateral.
          Recuerda que los cambios se reflejan en tiempo real en la web pública.
        </p>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => (
  <div className="glass-panel" style={{ padding: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '20px' }}>
    <div style={{ color: 'var(--accent-cyan)', background: 'rgba(0,255,255,0.05)', padding: '15px', borderRadius: '4px' }}>
      {icon}
    </div>
    <div>
      <div className="mono" style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '5px' }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 600 }}>{value}</div>
    </div>
  </div>
);
