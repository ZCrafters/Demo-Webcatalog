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
  if (cat.includes('pulsera') || cat.includes('pulso') || cat.includes('esclava') || nameLower.includes('pulsera') || nameLower.includes('tobillera')) type = "Pulsera";
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
    return `Aretes con un diseño ${adj}, ideales para dar luz al rostro y complementar looks casuales o formales. Una pieza ligera para usar todos los días o regalar en una ocasión especial.`;
  }
  if (type === 'Collar') {
    return `Collar de estilo ${adj}, perfecto para llevar solo o combinar con otras cadenas delicadas. Su diseño aporta un toque especial sin sobrecargar el look.`;
  }
  if (type === 'Pulsera') {
    return `Esta pieza está pensada para complementar tus accesorios favoritos con un acabado suave y ${adj}. Ideal para usar a diario, combinar en capas o regalar como detalle especial.`;
  }
  if (type === 'Set') {
    return `Este set de diseño ${adj} es ideal para crear un look completo y armonioso. Perfecto para regalo, eventos especiales o para quienes buscan accesorios fáciles de combinar.`;
  }
  if (type === 'Reloj') {
    return `Un reloj con estilo ${adj} que combina funcionalidad y diseño. El complemento perfecto para mantenerte a tiempo con mucha personalidad.`;
  }
  if (type === 'Anillo') {
    return `Un anillo ${adj} de nuestra colección. Diseñado para destacar y acompañarte en tus mejores momentos, combinando a la perfección con otros accesorios sutiles.`;
  }
  
  return `Una pieza ${adj} de nuestra colección, diseñada para destacar y acompañarte en tus mejores momentos de forma natural.`;
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
  let name = capitalize(rawName.replace(/-/g, ' ').trim());
  if (name.length <= 8) {
    if (type === 'Anillo') name += " Delicado";
    else if (type === 'Aretes') name += " Elegantes";
    else if (type === 'Pulsera') name += " Minimalista";
    else if (type === 'Collar') name += " Clásico";
  }
  return name;
};

const enhancedProducts = products.map(p => {
  const type = getCategoryDetails(p.category, p.name);
  const newName = refineName(p.name, type);
  
  return {
    ...p,
    name: newName,
    originalName: p.name,
    categoryType: type,
    shortDescription: generateShortDesc(type),
    description: generateSafeDescription(type, newName),
    material: p.material || "Acabado de bisutería fina", // Seguro
    idealFor: p.idealFor || "Uso diario o regalo especial" // Seguro
  };
});

fs.writeFileSync(dataPath, JSON.stringify(enhancedProducts, null, 2));
console.log("¡Catálogo enriquecido con éxito y guardado!");
