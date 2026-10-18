import fs from 'fs';
import path from 'path';

const projectsDir = path.resolve(process.cwd(), 'public/assets/projects');
const dirs = fs.readdirSync(projectsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort();

console.log(`Encontrados ${dirs.length} directorios`);

function parseTxtFile(filePath, dirName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  let year = '2024';
  let title = dirName.replace(/^\d+_/, '').replace(/_/g, ' ');
  let category = 'DISEÑO';
  let description = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const refMatch = line.match(/REF:.*?(\d{4})/i) || line.match(/(\d{4})/);
    if (refMatch && !year) {
      year = refMatch[1];
    } else if (line.startsWith('REF:')) {
      const y = line.match(/\b(20\d\d)\b/);
      if (y) year = y[1];
    }

    if (line.match(/^CATEGOR[ÍI]A:\s*(.*)/i)) {
      const match = line.match(/^CATEGOR[ÍI]A:\s*(.*)/i);
      category = match[1].trim();
      const rest = lines.slice(i + 1).join(' ');
      if (rest) description = rest;
      break;
    }
  }

  if (!description) {
    description = lines.slice(2).join(' ') || lines.join(' ');
  }

  // Limpiar título
  if (lines.length > 1 && !lines[0].startsWith('CATEGOR') && !lines[0].startsWith('REF:')) {
    title = lines[0].replace(/^\d+_/, '').replace(/_/g, ' ');
  } else if (lines.length > 1 && lines[1] && !lines[1].startsWith('CATEGOR')) {
    title = lines[1].replace(/^\d+_/, '').replace(/_/g, ' ');
  }

  // Capitalización amigable del título
  title = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

  // Normalizar categoría
  category = category.split(/[\/\n\.]/)[0].trim();
  if (!category || category.length > 40) {
    category = 'DISEÑO';
  }

  // Recortar descripción principal antes de RESUMEN DE CARPETA o SOFTWARE si es muy larga
  const cleanDesc = description
    .replace(/RESUMEN DE CARPETA.*/i, '')
    .replace(/SOFTWARE Y HERRAMIENTAS.*/i, '')
    .replace(/ESPECIFICACIONES T[ÉE]CNICAS.*/i, '')
    .trim();

  return {
    title,
    category: category.toUpperCase(),
    year,
    description: cleanDesc || description.slice(0, 200)
  };
}

const allProjects = [];

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

  if (imgFiles.length === 0) {
    console.warn(`Saltando ${dir}: sin imágenes`);
    continue;
  }

  const idMatch = dir.match(/^(\d+)/);
  const id = idMatch ? idMatch[1] : dir;

  let parsed = {
    title: dir.replace(/^\d+_/, '').replace(/_/g, ' '),
    category: 'DISEÑO',
    year: '2024',
    description: 'Proyecto de diseño y desarrollo técnico.'
  };

  if (txtFile) {
    try {
      parsed = parseTxtFile(path.join(dirPath, txtFile), dir);
    } catch (e) {
      console.error(`Error leyendo ${txtFile}:`, e);
    }
  }

  const mainImg = `assets/projects/${dir}/${imgFiles[0]}`;
  const gallery = imgFiles.map(img => `assets/projects/${dir}/${img}`);

  // Proyectos destacados en Hero (los primeros o principales)
  const heroIds = ['01', '02', '04', '08', '14', '20', '22'];

  allProjects.push({
    id,
    folder: dir,
    txtFile: txtFile || null,
    title: parsed.title,
    category: parsed.category,
    year: parsed.year,
    img: mainImg,
    description: parsed.description,
    isHero: heroIds.includes(id),
    gallery
  });
}

console.log(`Procesados ${allProjects.length} proyectos con éxito`);
console.log('Categorías únicas encontradas:', Array.from(new Set(allProjects.map(p => p.category))));
fs.writeFileSync('temp_projects.json', JSON.stringify(allProjects, null, 2), 'utf-8');
