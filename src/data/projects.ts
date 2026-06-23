export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  img: string;
  description: string;
  isHero?: boolean;
  gallery?: string[];
  documents?: { name: string, url: string }[];
}

export const projects: Project[] = [
  {
    id: 'P-01',
    title: '01_Puf_Huevos',
    category: 'Morfología Orgánica',
    year: '2016',
    img: 'assets/projects/puf_huevos.jpg',
    description: 'Proyecto de mobiliario experimental basado en la biomimesis de formas ovoides. Estructura interna de acero con recubrimiento textil tensado.',
    isHero: true
  },
  {
    id: 'P-02',
    title: '02_DP4_Producto',
    category: 'Diseño de Producto',
    year: '2021',
    img: 'assets/projects/dp4.jpg',
    description: 'Sistema de filtrado y purificación de aire integral. Ganador del premio de diseño industrial UP.',
    isHero: true
  },
  {
    id: 'P-03',
    title: '04_Rack_TV_Cube',
    category: 'Mobiliario Minimalista',
    year: '2020',
    img: 'assets/projects/rack_cube.jpg',
    description: 'Módulo de entretenimiento basado en geometrías puras y ensambles ocultos. Acabado en laca satinada negra.',
    isHero: true
  },
  {
    id: 'P-04',
    title: '03_Lampara_Mobius',
    category: 'Iluminación Especial',
    year: '2024',
    img: 'assets/images/proyecto_03.jpg',
    description: 'Luminaria de sobremesa que explora la continuidad de superficie de la cinta de Möbius mediante polímeros retroiluminados.',
    isHero: true
  },
  {
    id: 'P-05',
    title: 'Escritorio Cristina',
    category: 'Mobiliario Rebatible',
    year: '2022',
    img: 'assets/images/proyecto_01.jpg',
    description: 'Solución de home-office compacta y rebatible para espacios reducidos.',
    isHero: false
  },
  {
    id: 'P-06',
    title: 'Reloj Eclipse',
    category: 'Accesorios Técnicos',
    year: '2023',
    img: 'assets/images/proyecto_02.jpg',
    description: 'Reloj de pared analógico que utiliza sombras proyectadas para indicar el paso del tiempo.',
    isHero: false
  },
  {
    id: 'P-07',
    title: 'Mesa marquetería',
    category: 'Ebanistería',
    year: '2019',
    img: 'assets/images/proyecto_04.jpg',
    description: 'Mesa de café con patrón geométrico complejo realizado en chapas de maderas exóticas.',
    isHero: false
  }
];
