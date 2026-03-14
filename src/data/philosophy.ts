export interface PhilosophyCard {
  number: string;
  title: string;
  desc: string;
  link?: string; // Futura redirección a proyecto o PDF
}

export const philosophyCards: PhilosophyCard[] = [
  {
    number: "01.",
    title: "Lógica Material",
    desc: "No diseñamos formas, optimizamos estructuras. Cada milímetro responde a una función técnica y estética, fusionando procesos industriales con acabados de taller.",
    link: "/filosofia/01"
  },
  {
    number: "02.",
    title: "Equipamiento Espacial",
    desc: "Especialistas en equipamiento comercial B2B y espacios residenciales de alta gama donde convergen la durabilidad máxima y el diseño de autor.",
    link: "/filosofia/02"
  },
  {
    number: "03.",
    title: "Precisión Paramétrica",
    desc: "Modelado 3D avanzado y fabricación de precisión para prever y controlar cada interacción entre el objeto diseñado, el usuario final y su entorno.",
    link: "/filosofia/03"
  }
];
