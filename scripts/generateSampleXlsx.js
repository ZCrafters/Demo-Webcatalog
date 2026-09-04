import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sampleData = [
  {
    sku: 'AUR-001',
    nombre: 'Auriculares Inalámbricos Premium',
    descripcion: 'Sonido de alta definición, cancelación de ruido y 30h de batería.',
    precio: 120,
    precio_oferta: 99,
    categoria: 'Electrónica',
    subcategoria: 'Audio',
    marca: 'SoundMax',
    stock: 50,
    estado: 'disponible',
    imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    imagenes_extra: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    destacado: 'sí',
    nuevo: 'sí',
    oferta: 'sí'
  },
  {
    sku: 'REL-001',
    nombre: 'Reloj Minimalista Negro',
    descripcion: 'Diseño elegante y correa de cuero genuino.',
    precio: 85,
    precio_oferta: '',
    categoria: 'Accesorios',
    subcategoria: 'Relojes',
    marca: 'TimeLess',
    stock: 15,
    estado: 'disponible',
    imagen: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    imagenes_extra: '',
    destacado: 'no',
    nuevo: 'no',
    oferta: 'no'
  },
  {
    sku: 'CAM-001',
    nombre: 'Cámara Fotográfica Vintage',
    descripcion: 'Captura momentos con estilo retro y tecnología moderna.',
    precio: 250,
    precio_oferta: '',
    categoria: 'Fotografía',
    subcategoria: 'Cámaras',
    marca: 'RetroCam',
    stock: 0,
    estado: 'agotado',
    imagen: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
    imagenes_extra: '',
    destacado: 'sí',
    nuevo: 'no',
    oferta: 'no'
  }
];

const outputPath = path.join(__dirname, '../public/data/catalogo.xlsx');

const ws = XLSX.utils.json_to_sheet(sampleData);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Productos");

XLSX.writeFile(wb, outputPath);
console.log(`Archivo de ejemplo generado en: ${outputPath}`);
