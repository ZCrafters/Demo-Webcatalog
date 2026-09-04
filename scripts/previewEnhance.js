import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../public/data/products.json');

if (!fs.existsSync(dataPath)) {
  console.error("products.json no encontrado");
  process.exit(1);
}

const rawData = fs.readFileSync(dataPath, 'utf-8');
const products = JSON.parse(rawData);

// Helpers para limpieza y elegancia
const capitalize = (str) => {
  if (!str) return '';
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const getCategoryDetails = (category, originalName) => {
  const cat = (category || '').toLowerCase();
  const nameLower = originalName.toLowerCase();
  
  let type = "Accesorio";
  if (cat.includes('arete') || cat.includes('topo') || nameLower.includes('arete') || nameLower.includes('topo')) type = "Aretes";
  if (cat.includes('collar') || nameLower.includes('collar')) type = "Collar";
  if (cat.includes('pulsera') || cat.includes('pulso') || cat.includes('esclava') || nameLower.includes('pulsera')) type = "Pulsera";
  if (cat.includes('anillo') || nameLower.includes('anillo')) type = "Anillo";
  if (cat.includes('juego') || cat.includes('set') || nameLower.includes('juego')) type = "Set";
  if (cat.includes('reloj') || nameLower.includes('reloj')) type = "Reloj";
  
  return type;
};

// Generadores únicos y seguros
const generateSafeDescription = (type, name) => {
  const adjs = ['delicado', 'elegante', 'versátil', 'femenino', 'sofisticado'];
  const adj = adjs[Math.floor(Math.random() * adjs.length)];
  
  if (type === 'Aretes') {
    return `${name} con un diseño ${adj}, ideales para dar luz al rostro y complementar looks casuales o formales. Una pieza ligera para usar todos los días o regalar en una ocasión especial.`;
  }
  if (type === 'Collar') {
    return `${name} de estilo ${adj}, perfecto para llevar solo o combinar con otras cadenas delicadas. Su diseño aporta un toque especial sin sobrecargar el look.`;
  }
  if (type === 'Pulsera') {
    return `Esta ${name.toLowerCase()} está pensada para complementar tus accesorios favoritos con un acabado suave. Ideal para usar a diario, combinar en capas o regalar como detalle especial.`;
  }
  if (type === 'Set') {
    return `Este ${name.toLowerCase()} es ideal para crear un look completo y armonioso. Perfecto para regalo, eventos especiales o para quienes buscan accesorios fáciles de combinar.`;
  }
  if (type === 'Reloj') {
    return `Un ${name.toLowerCase()} con estilo ${adj} que combina funcionalidad y diseño. El complemento perfecto para mantenerte a tiempo con mucho estilo.`;
  }
  
  return `Una pieza ${adj} de nuestra colección. ${name} está diseñado para destacar y acompañarte en tus mejores momentos.`;
};

const generateShortDesc = (type) => {
  const shorts = [
    "Un detalle delicado para elevar tus looks diarios.",
    "Ideal para regalar o combinar con piezas similares.",
    "Ligero, femenino y perfecto para ocasiones especiales.",
    "Una pieza versátil para usar de día o de noche."
  ];
  return shorts[Math.floor(Math.random() * shorts.length)];
};

const refineName = (rawName, type) => {
  // Limpiar guiones y capitalizar
  let name = capitalize(rawName.replace(/-/g, ' '));
  // Añadir adjetivo elegante sin alterar la esencia
  if (name.length < 15 && !name.toLowerCase().includes('elegante')) {
    if (type === 'Set') name = name.replace('Juego', 'Set Elegante de');
  }
  return name;
};

// Procesar muestra
console.log("=== PREVIEW: ENRIQUECIMIENTO BOUTIQUE (15 PRODUCTOS) ===\n");

const sample = products.slice(0, 15).map(p => {
  const type = getCategoryDetails(p.category, p.name);
  const newName = refineName(p.name, type);
  
  const enhanced = {
    ...p,
    name: newName,
    originalName: p.name,
    categoryType: type,
    shortDescription: generateShortDesc(type),
    description: generateSafeDescription(type, newName),
    material: "Acabado de bisutería", // Seguro
    idealFor: "Uso diario o regalo especial" // Seguro
  };
  
  return enhanced;
});

sample.forEach((p, i) => {
  console.log(`[${i+1}] ANTES: ${p.originalName}`);
  console.log(`    NUEVO: ${p.name}`);
  console.log(`    CORTA: ${p.shortDescription}`);
  console.log(`    LARGA: ${p.description}`);
  console.log(`    ATTRS: Material: ${p.material} | Ideal para: ${p.idealFor}`);
  console.log('--------------------------------------------------');
});

console.log("\nEjecutado en modo Preview. No se han sobrescrito los datos.");
