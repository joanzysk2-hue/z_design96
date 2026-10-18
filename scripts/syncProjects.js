import fs from 'fs';
import path from 'path';

export function syncProjects() {
  const projectsDir = path.resolve(process.cwd(), 'public/assets/projects');
  if (!fs.existsSync(projectsDir)) {
    console.error(`No existe el directorio ${projectsDir}`);
    return;
  }

  const dirs = fs.readdirSync(projectsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  function parseTxt(filePath, dirName) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    let year = '2024';
    let title = dirName.replace(/^\d+_/, '').replace(/_/g, ' ');
    let category = 'DISEÑO';
    let description = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^REF:/i.test(line)) {
        const yMatch = line.match(/\b(20\d\d)\b/);
        if (yMatch) year = yMatch[1];
      }
      if (/^CATEGOR[ÍI]A:\s*(.*)/i.test(line)) {
        const catMatch = line.match(/^CATEGOR[ÍI]A:\s*(.*)/i);
        if (catMatch && catMatch[1]) {
          category = catMatch[1].trim().split(/[\/\n\.]/)[0].trim();
        }
        const remaining = lines.slice(i + 1).join(' ');
        if (remaining) description = remaining;
        break;
      }
    }

    if (!description) {
      description = lines.slice(2).join(' ') || lines.join(' ');
    }

    const titleCandidate = lines.find(l => !/^REF:/i.test(l) && !/^CATEGOR/i.test(l));
    if (titleCandidate) {
      title = titleCandidate.replace(/^\d+_/, '').replace(/_/g, ' ');
    }

    title = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

    if (!category || category.length > 35) category = 'DISEÑO';

    const cleanDesc = description
      .replace(/RESUMEN DE CARPETA.*/i, '')
      .replace(/SOFTWARE Y HERRAMIENTAS.*/i, '')
      .replace(/ESPECIFICACIONES T[ÉE]CNICAS.*/i, '')
      .replace(/CONCEPTO Y MORFOLOG[ÍI]A.*/i, '')
      .trim();

    return {
      title,
      category: category.toUpperCase(),
      year,
      description: cleanDesc || description.slice(0, 220)
    };
  }

  const heroIds = ['01', '02', '04', '08', '14', '20', '22', '24'];
  const projects = [];

  for (const dir of dirs) {
    const dirPath = path.join(projectsDir, dir);
    const files = fs.readdirSync(dirPath);

    const txtFile = files.find(f => f.toLowerCase().endsWith('.txt'));
    const imgFiles = files
      .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '999', 10);
        const numB = parseInt(b.match(/\d+/)?.[0] || '999', 10);
        return numA - numB;
      });

    if (imgFiles.length === 0) continue;

    const idMatch = dir.match(/^(\d+)/);
    const id = idMatch ? idMatch[1] : dir;

    let meta = {
      title: dir.replace(/^\d+_/, '').replace(/_/g, ' '),
      category: 'DISEÑO',
      year: '2024',
      description: 'Proyecto de desarrollo y diseño técnico de mobiliario u objeto.'
    };

    if (txtFile) {
      try {
        meta = parseTxt(path.join(dirPath, txtFile), dir);
      } catch (err) {
        console.error(`Error procesando txt de ${dir}:`, err);
      }
    }

    projects.push({
      id,
      title: meta.title,
      category: meta.category,
      year: meta.year,
      img: `assets/projects/${dir}/${imgFiles[0]}`,
      description: meta.description,
      isHero: heroIds.includes(id),
      gallery: imgFiles.map(img => `assets/projects/${dir}/${img}`)
    });
  }

  const fileContent = `// ARCHIVO GENERADO AUTOMÁTICAMENTE A PARTIR DE LOS .TXT DE CADA CARPETA
// Para agregar o editar proyectos:
// 1. Coloca o edita el archivo .txt dentro de public/assets/projects/<nombre_carpeta>/
// 2. Ejecuta el archivo "ACTUALIZAR_WEB.bat" en la raíz del proyecto.

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  img: string;
  description: string;
  isHero?: boolean;
  gallery?: string[];
  documents?: { name: string; url: string }[];
}

export const projects: Project[] = ${JSON.stringify(projects, null, 2)};
`;

  const outputPath = path.resolve(process.cwd(), 'src/data/projects.ts');
  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`✓ Sincronizados ${projects.length} proyectos en ${outputPath}`);
}

syncProjects();
