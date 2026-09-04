const fs = require('fs');
const path = './public/data/products.json';

const cleanDescription = (product) => {
  const category = product.category || '';
  const name = product.name || '';
  
  // Determinamos el tipo basado en categoría o nombre
  const lowerName = name.toLowerCase();
  const lowerCat = category.toLowerCase();
  
  let type = 'Accesorio';
  if (lowerCat.includes('arete') || lowerName.includes('arete') || lowerName.includes('topo') || lowerName.includes('argolla') || lowerName.includes('candonga')) {
    type = 'Aretes';
  } else if (lowerCat.includes('anillo') || lowerName.includes('anillo')) {
    type = 'Anillos';
  } else if (lowerCat.includes('collar') || lowerCat.includes('cadena') || lowerCat.includes('gargantilla') || lowerName.includes('collar') || lowerName.includes('cadena') || lowerName.includes('gargantilla')) {
    type = 'Collares';
  } else if (lowerCat.includes('pulsera') || lowerName.includes('pulsera')) {
    type = 'Pulseras';
  } else if (lowerCat.includes('tobillera') || lowerName.includes('tobillera')) {
    type = 'Tobilleras';
  } else if (lowerCat.includes('dije') || lowerName.includes('dije')) {
    type = 'Dijes';
  } else if (lowerCat.includes('juego') || lowerCat.includes('set') || lowerName.includes('juego') || lowerName.includes('set')) {
    type = 'Sets';
  } else if (lowerName.includes('cuff')) {
    type = 'Ear Cuff';
  }

  const templates = {
    'Aretes': 'Aretes delicados para iluminar el rostro y complementar looks diarios o especiales.',
    'Anillos': 'Anillo femenino y versátil, ideal para combinar con otras piezas o llevar como detalle protagonista.',
    'Collares': 'Collar delicado para elevar el escote y acompañar looks casuales o elegantes.',
    'Pulseras': 'Pulsera sutil y versátil para combinar en capas o usar como detalle diario.',
    'Tobilleras': 'Tobillera delicada para dar un toque femenino y fresco a tus looks.',
    'Dijes': 'Dije especial para personalizar cadenas y llevar un detalle con significado.',
    'Sets': 'Set coordinado de accesorios, ideal para regalar o lucir una combinación lista para usar.',
    'Ear Cuff': 'Accesorio moderno para darle un toque diferente y luminoso a tu look sin esfuerzo.',
    'Accesorio': 'Pieza delicada diseñada para resaltar tu estilo en cualquier ocasión.'
  };

  return templates[type] || templates['Accesorio'];
};

try {
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log(`Procesando ${data.length} productos...`);
  
  let count = 0;
  data.forEach(p => {
    const oldDesc = p.description || '';
    // Solo limpiamos si contiene palabras prohibidas o si queremos resetear todas
    if (oldDesc.includes('Precio') || oldDesc.includes('$') || oldDesc.includes('COP') || oldDesc.includes('http') || oldDesc.includes('categoría')) {
      p.description = cleanDescription(p);
      count++;
    } else if (!oldDesc || oldDesc.length < 10) {
        // También llenamos si está vacía
        p.description = cleanDescription(p);
        count++;
    }
  });

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  console.log(`¡Éxito! Se limpiaron ${count} descripciones.`);
} catch (error) {
  console.error('Error:', error);
}
