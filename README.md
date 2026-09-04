# Nigoo Catalog

Website katalog knitwear wanita Nigoo, dibangun ulang dari proyek React/Vite yang ada. Desain monokrom dengan satu font sans-serif, navigasi responsif, landing page, katalog, detail produk, About Us, kontak sosial, keranjang, dan checkout simulasi.

## Menjalankan

Gunakan Node.js 22.13+ dan npm.

```sh
npm ci
npm run dev
```

Di komputer Windows ini, launcher otomatis menggunakan Node bawaan Codex bila Node sistem terlalu lama. Untuk instalasi baru di komputer lain, gunakan Node 22.13+ sebelum menjalankan npm ci.

```sh
npm run import-catalog
npm test
npm run lint
npm run build
npm run preview
```

`dist/` adalah output deploy. Build membuat entry point HTML untuk halaman dan produk, dengan konten dirender oleh React. Website belum dipublikasikan dan masih memakai noindex untuk tahap review.

## Data produk

- Sumber: `data/nigoo-data-produk-shopee.xlsx`, sheet Product Data.
- Hasil: `public/data/products.json` (30 produk unik dari 35 baris).
- Audit: `docs/catalog-import-report.json`.
- Harga dalam IDR sesuai sumber, tanpa mengurangi diskon dua kali atau mengarang harga coret.
- Kategori diturunkan dari nama produk. Rating dan terjual adalah snapshot sumber.

Untuk menambahkan foto asli, simpan aset ke `public/images/` dan isi `data/product-overrides.json`, menggunakan slug produk sebagai key:

```json
{
  "alinea-cardigan": {
    "images": ["/images/alinea-cardigan.jpg"],
    "description": "Deskripsi produk yang telah dikonfirmasi pemilik."
  }
}
```

Jalankan import dan build ulang. Override foto/deskripsi tidak ditimpa saat import. Foto pertama ditampilkan pada kartu dan detail produk. Banner hero/kategori masih placeholder sesuai workflow dan perlu diganti dengan aset pemilik.

## Pembelian

Keranjang disimpan lokal (ID dan kuantitas saja), harga diambil dari katalog. Checkout hanya demonstrasi: data alamat tidak dikirim/disimpan, tidak ada payment gateway atau pesanan nyata. Pembelian diarahkan ke toko Shopee Nigoo; URL SKU belum tersedia. TikTok mengikuti akun knitgoods.id yang diberikan pengguna.

## Struktur

- `src/storefront/`: komponen, halaman, state keranjang, gaya.
- `scripts/import-nigoo.js`: importer dan deduplikasi.
- `scripts/validate-catalog.js`: rekonsiliasi semua baris sumber.
- `docs/nigoo-migration.md`: keputusan, batasan, dan prioritas sebelum launch.
- `.cache/nigoo-legacy/`: arsip lokal kode/aset toko lama; tidak ikut deploy.

Belum siap untuk menerima pembayaran nyata. Foto asli, harga, SKU, stok/varian, ketentuan pengiriman/retur, serta domain perlu dikonfirmasi pemilik.
