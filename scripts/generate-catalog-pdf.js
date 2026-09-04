import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';

// CONFIG
const DATA_PATH = path.join(process.cwd(), 'public', 'data', 'products.json');
const BRAND_DIR = path.join(process.cwd(), 'public', 'brand');
const CACHE_DIR = path.join(process.cwd(), '.cache', 'catalog-images');
const OUTPUT_STD = path.join(process.cwd(), 'public', 'catalogo-salem-store.pdf');
const OUTPUT_LITE = path.join(process.cwd(), 'public', 'catalogo-salem-store-lite.pdf');

// BRAND COLORS
const COLORS = {
  midnight: '#0B1320',
  ivory: '#F7F2E8',
  gold: '#B99645',
  goldLight: '#D8BC73',
  text: '#333333',
  white: '#FFFFFF',
  danger: '#e63946',
  success: '#2d6a4f'
};

// FONTS (Standard PDF fonts)
const FONT_SERIF = 'Times-Roman';
const FONT_SERIF_BOLD = 'Times-Bold';
const FONT_SANS = 'Helvetica';
const FONT_SANS_BOLD = 'Helvetica-Bold';

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function getOptimizedImage(url, sku, lite = false) {
  const hash = sku.replace(/[^a-z0-9]/gi, '_');
  const filename = `${hash}${lite ? '_lite' : ''}.jpg`;
  const localPath = path.join(CACHE_DIR, filename);

  if (fs.existsSync(localPath)) return localPath;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Fetch failed');
    const buffer = Buffer.from(await res.arrayBuffer());

    const pipeline = sharp(buffer)
      .resize(500, 500, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .jpeg({ quality: lite ? 40 : 80 });

    await pipeline.toFile(localPath);
    return localPath;
  } catch (e) {
    return null;
  }
}

function drawBadge(doc, x, y, text, color) {
  doc.save();
  const width = doc.widthOfString(text, { size: 7 }) + 10;
  doc.roundedRect(x, y, width, 12, 2).fill(color);
  doc.fillColor(COLORS.white).fontSize(7).text(text, x + 5, y + 3);
  doc.restore();
}

async function createPDF(isLite = false) {
  const outputPath = isLite ? OUTPUT_LITE : OUTPUT_STD;
  const products = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
    .filter(p => p.status !== 'oculto');

  // Sort: Category > Subcategory > Name
  products.sort((a, b) => {
    const cat = (a.category || '').localeCompare(b.category || '');
    if (cat !== 0) return cat;
    const sub = (a.subcategory || '').localeCompare(b.subcategory || '');
    if (sub !== 0) return sub;
    return a.name.localeCompare(b.name);
  });

  const categories = [...new Set(products.map(p => p.category || 'Varios'))];
  
  const doc = new PDFDocument({
    size: 'A4',
    margin: 0, // Manual margins
    bufferPages: true
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // --- PORTADA ---
  doc.addPage().rect(0, 0, 595.28, 841.89).fill(COLORS.midnight);
  
  // Logo placeholder or real
  const logoPath = path.join(BRAND_DIR, 'logo-square-light.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 595.28 / 2 - 75, 200, { width: 150 });
  } else {
    doc.fillColor(COLORS.gold).font(FONT_SERIF_BOLD).fontSize(60).text('SS', 0, 240, { align: 'center' });
  }

  doc.fillColor(COLORS.white).font(FONT_SERIF).fontSize(24).text('CATÁLOGO SALEM STORE', 0, 420, { align: 'center', characterSpacing: 2 });
  doc.fillColor(COLORS.gold).font(FONT_SANS).fontSize(14).text('Detalles que marcan la diferencia', 0, 455, { align: 'center' });
  
  doc.moveTo(200, 480).lineTo(395, 480).lineWidth(1).strokeColor(COLORS.gold).stroke();
  doc.fillColor(COLORS.goldLight).fontSize(10).text(new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase(), 0, 500, { align: 'center' });

  // --- BIENVENIDA ---
  doc.addPage().rect(0, 0, 595.28, 841.89).fill(COLORS.ivory);
  doc.fillColor(COLORS.midnight).font(FONT_SERIF_BOLD).fontSize(30).text('Bienvenidos', 50, 200);
  doc.moveTo(50, 240).lineTo(150, 240).lineWidth(2).strokeColor(COLORS.gold).stroke();
  doc.font(FONT_SANS).fontSize(14).fillColor(COLORS.text)
    .text('Nuestra colección ha sido cuidadosamente seleccionada para quienes buscan exclusividad y elegancia en cada detalle.', 50, 270, { width: 400, lineGap: 5 });
  doc.text('Descubre piezas únicas diseñadas para resaltar tu estilo personal.', 50, 330, { width: 400 });

  // --- INDICE ---
  doc.addPage().rect(0, 0, 595.28, 841.89).fill(COLORS.white);
  doc.fillColor(COLORS.midnight).font(FONT_SERIF_BOLD).fontSize(24).text('Índice por Categorías', 50, 50);
  doc.moveDown();
  categories.forEach((cat, i) => {
    doc.fillColor(COLORS.text).font(FONT_SANS).fontSize(14).text(`${i + 1}. ${cat}`, 70, doc.y, { continued: true });
    doc.text(' .....................................................................', { align: 'left' });
  });

  // --- CATEGORIES & PRODUCTS ---
  let totalProcessed = 0;
  for (const cat of categories) {
    // Separator
    const isEven = categories.indexOf(cat) % 2 === 0;
    doc.addPage().rect(0, 0, 595.28, 841.89).fill(isEven ? COLORS.midnight : COLORS.ivory);
    doc.fillColor(isEven ? COLORS.white : COLORS.midnight).font(FONT_SERIF_BOLD).fontSize(40).text(cat.toUpperCase(), 0, 400, { align: 'center' });
    doc.moveTo(250, 450).lineTo(345, 450).lineWidth(2).strokeColor(COLORS.gold).stroke();
    doc.fontSize(10).text('SALEM STORE', 0, 470, { align: 'center' });

    const catProds = products.filter(p => p.category === cat);
    
    for (let i = 0; i < catProds.length; i += 4) {
      doc.addPage().rect(0, 0, 595.28, 841.89).fill(COLORS.white);
      
      // Header
      doc.fillColor(COLORS.midnight).font(FONT_SERIF_BOLD).fontSize(10).text('SALEM STORE', 50, 20);
      doc.fillColor(COLORS.gold).font(FONT_SANS).fontSize(8).text(cat.toUpperCase(), 50, 32);
      doc.moveTo(50, 45).lineTo(545, 45).lineWidth(0.5).strokeColor(COLORS.goldLight).stroke();

      const pageProds = catProds.slice(i, i + 4);
      for (let j = 0; j < pageProds.length; j++) {
        const p = pageProds[j];
        const col = j % 2;
        const row = Math.floor(j / 2);
        const x = 50 + (col * 255);
        const y = 60 + (row * 370);
        const cardW = 240;
        const cardH = 350;

        // Card Shadow/Border
        doc.roundedRect(x, y, cardW, cardH, 5).lineWidth(0.5).strokeColor(COLORS.goldLight).stroke();
        
        // Image
        const imgX = x + 10;
        const imgY = y + 10;
        const imgW = cardW - 20;
        const imgH = 200;

        const imgPath = p.image ? await getOptimizedImage(p.image, p.sku, isLite) : null;
        if (imgPath) {
          try { doc.image(imgPath, imgX, imgY, { fit: [imgW, imgH], align: 'center', valign: 'center' }); } 
          catch { doc.rect(imgX, imgY, imgW, imgH).fill(COLORS.ivory); }
        } else {
          doc.rect(imgX, imgY, imgW, imgH).fill(COLORS.ivory);
          doc.fillColor(COLORS.gold).font(FONT_SERIF_BOLD).fontSize(20).text('SS', imgX, imgY + 80, { width: imgW, align: 'center' });
        }

        // Badges
        if (p.isOffer || (p.salePrice && p.salePrice < p.price)) {
          drawBadge(doc, imgX + 5, imgY + 5, 'OFERTA', COLORS.gold);
        }
        if (p.stock <= 0 || p.status !== 'disponible') {
          drawBadge(doc, imgX + 5, imgY + 180, 'AGOTADO', COLORS.danger);
        } else {
          drawBadge(doc, imgX + 5, imgY + 180, 'DISPONIBLE', COLORS.success);
        }

        // Details
        const textY = imgY + imgH + 10;
        doc.fillColor(COLORS.text).font(FONT_SANS_BOLD).fontSize(11).text(p.name, x + 10, textY, { width: cardW - 20, height: 28, ellipsis: true });
        doc.fillColor('#888888').font(FONT_SANS).fontSize(8).text(`SKU: ${p.sku}`, x + 10, textY + 30);
        
        if (p.salePrice && p.salePrice > 0) {
          doc.fillColor(COLORS.gold).font(FONT_SANS_BOLD).fontSize(14).text(`$${p.salePrice.toLocaleString()}`, x + 10, textY + 45);
          doc.fillColor('#999999').font(FONT_SANS).fontSize(9).text(`$${p.price.toLocaleString()}`, x + 10, textY + 60, { strike: true });
        } else {
          doc.fillColor(COLORS.midnight).font(FONT_SANS_BOLD).fontSize(14).text(`$${p.price.toLocaleString()}`, x + 10, textY + 45);
        }

        doc.fillColor(COLORS.text).font(FONT_SANS).fontSize(8).text(p.description || '', x + 10, textY + 75, { width: cardW - 20, height: 35, ellipsis: true });
      }

      // Footer
      doc.moveTo(50, 810).lineTo(545, 810).lineWidth(0.5).strokeColor(COLORS.gold).stroke();
      doc.fillColor(COLORS.gold).font(FONT_SANS).fontSize(8).text('Detalles que marcan la diferencia', 50, 815);
      
      totalProcessed += pageProds.length;
      process.stdout.write(`\rProcesando ${isLite ? 'Lite' : 'Std'}: ${totalProcessed}/${products.length}...`);
    }
  }

  // Paginación
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    if (i > 0) { // No en portada
      doc.fillColor(COLORS.text).fontSize(8).text(`${i + 1}`, 545, 815, { align: 'right' });
    }
  }

  doc.end();
  return new Promise((resolve) => {
    stream.on('finish', () => {
      console.log(`\nGenerado: ${outputPath}`);
      resolve({
        path: outputPath,
        pages: pages.count,
        products: products.length,
        categories: categories.length,
        size: fs.statSync(outputPath).size
      });
    });
  });
}

async function run() {
  console.log('--- GENERADOR DE CATÁLOGO PREMIUM ---');
  await ensureDir(CACHE_DIR);
  await ensureDir(BRAND_DIR);

  const std = await createPDF(false);
  const lite = await createPDF(true);

  console.log('\n--- ESTADÍSTICAS ---');
  console.log(`Productos: ${std.products}`);
  console.log(`Categorías: ${std.categories}`);
  console.log(`Versión Estándar: ${std.pages} páginas, ${(std.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Versión Lite: ${lite.pages} páginas, ${(lite.size / 1024 / 1024).toFixed(2)} MB`);
}

run().catch(console.error);
