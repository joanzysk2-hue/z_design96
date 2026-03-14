import { useEffect } from 'react';
import { Hero } from '../components/sections/Hero';
import { Philosophy } from '../components/sections/Philosophy';
import { ProjectsGrid } from '../components/sections/ProjectsGrid';

export const Home = () => {
  // Aseguramos que al entrar al index siempre estemos arriba
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Hero />
      <Philosophy />
      {/* El grid en home muestra solo unos destacados */}
      <ProjectsGrid />
    </>
  );
};
