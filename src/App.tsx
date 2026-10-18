import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { AllProjects } from './pages/AllProjects';
import { ProjectDetail } from './pages/ProjectDetail';
import { PhilosophyDetail } from './pages/PhilosophyDetail';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Escucha cambios sutiles para refrescar ScrollTrigger (útil post-navegación SPA)
    const handleScrollRefresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleScrollRefresh);
    return () => window.removeEventListener('resize', handleScrollRefresh);
  }, []);

  return (
    <HashRouter>
      <Routes>
        {/* ── Rutas públicas (con Navbar y Footer) ── */}
        <Route element={
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/proyectos" element={<AllProjects />} />
                <Route path="/proyectos/:id" element={<ProjectDetail />} />
                <Route path="/filosofia/:id" element={<PhilosophyDetail />} />
                {/* Cualquier ruta residual o intento de entrar a /admin redirige al Home */}
                <Route path="/admin/*" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } path="/*" />
      </Routes>
    </HashRouter>
  );
}

export default App;
