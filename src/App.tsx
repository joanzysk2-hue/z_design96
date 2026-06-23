import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { AllProjects } from './pages/AllProjects';
import { ProjectDetail } from './pages/ProjectDetail';
import { PhilosophyDetail } from './pages/PhilosophyDetail';
import { AdminLogin } from './pages/Admin/Login';
import { AdminDashboard } from './pages/Admin/Dashboard';
import { ProjectEditor } from './pages/Admin/ProjectEditor';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Escucha cambios sutiles para refrescar ScrollTrigger (útil post-navegación SPA)
    const handleScrollRefresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleScrollRefresh);
    return () => window.removeEventListener('resize', handleScrollRefresh);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter basename="/z_design96">
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
                </Routes>
              </main>
              <Footer />
            </div>
          } path="/*" />

          {/* ── Rutas de Admin (sin Navbar/Footer) ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/proyectos/:id" element={
            <ProtectedRoute><ProjectEditor /></ProtectedRoute>
          } />
          <Route path="/admin/proyectos/nuevo" element={
            <ProtectedRoute><ProjectEditor /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
