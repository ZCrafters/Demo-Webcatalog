# Migrasi Nigoo

Website ini adalah katalog dan prototype alur belanja. React 19, React Router, dan Vite dari proyek lama dipertahankan. CSS storefront menggunakan satu keluarga sans-serif sistem, off-white #F9F6F0, cream #E8E0D5, taupe #C4B49F, dan espresso #3D2D23 dengan aksen camel #A67C52, sudut tajam, tanpa gradien atau animasi dekoratif. Arah desain: quiet luxury; variance 5, motion 2, density 3. Placeholder foto mengikuti permintaan dalam workflow.

## Data

Sumber: `data/nigoo-data-produk-shopee.xlsx`, sheet `Product Data`. File asli Downloads tidak diubah.

35 baris diimpor menjadi 30 produk. Duplikat Cami, Mimi, Lily, Choco, Lolly digabung tanpa menjumlahkan rating atau angka terjual. Nomor baris asal disimpan pada `sourceRows`; catatan import tersedia di `catalog-import-report.json`.

Angka harga sumber dipakai persis tanpa mengurangi diskon lagi. Header “Harga Asli Setelah Diskon” ambigu; pemilik perlu mengonfirmasi harga final. Harga sebelum diskon tidak tersedia, sehingga `originalPrice` bernilai null dan harga coret tidak ditampilkan. Persentase diskon sumber tetap tersimpan dan tersedia di informasi harga PDP. Rating dan terjual merupakan snapshot sumber, bukan data real-time. Label “10RB+” dipertahankan; sort terlaris memakai batas bawah 10000.

Kategori diturunkan dari nama: half-zip didahulukan, kemudian cardigan, sweater, atasan. Nama tampilan dipangkas pada tipe produk; nama sumber tetap tersimpan. Tidak ada stok, ukuran, warna, alamat toko, nomor WhatsApp, Instagram, atau promo gratis ongkir yang dikarang.

## Implementasi

- `/`: landing, kategori, banner koleksi, 12 produk, brand statement, sosial media.
- `/catalog`, `/kategori/:category`: 30 produk, pencarian, kategori, sort harga/terlaris, empty state. Filter tersimpan di URL.
- `/produk/:slug`: detail, placeholder foto, deskripsi, informasi sumber, rekomendasi kategori, CTA toko resmi. `/product/:slug` kompatibel dengan pola route lama.
- `/about`, `/contact`: profil singkat, sosial media, panduan belanja.
- `/cart`: kuantitas, hapus, total; persist hanya ID dan kuantitas di localStorage.
- `/checkout`: validasi form, ringkasan, hasil simulasi; tidak ada pengiriman data, penyimpanan alamat, pembayaran, atau pesanan nyata.
- Rute tak dikenal: halaman tidak ditemukan.
- Build membuat HTML entry point untuk direct URL; ini bukan SSR. Prototype memakai noindex sampai konten dan harga disetujui.

Kode lama, foto, katalog PDF/XLSX lama, dan endpoint Telegram lama dipindahkan ke `.cache/nigoo-legacy` agar tidak ikut deploy. File ini merupakan arsip lokal, bukan sumber data aplikasi. Scripts lama lain di root masih ada untuk referensi dan tidak digunakan oleh alur Nigoo.

## Prioritas sebelum menerima transaksi nyata

1. Foto asli resolusi tinggi per produk, hero, kategori; isi `images` dengan path publik aset. Placeholder tidak cukup untuk menilai produk fashion.
2. Konfirmasi harga, SKU, stok, ukuran, warna, komposisi bahan, dan status 5 duplikat. Export seller lebih kuat daripada snapshot.
3. Identitas resmi: logo, copy brand, akun tambahan bila ada. Wordmark sekarang tipografi sementara.
4. Kebijakan kirim/retur dan keputusan checkout: tetap marketplace atau backend pesanan, stok, ongkir, dan payment gateway.
5. Domain, hosting, metadata produksi, foto share, SEO/SSR bila diperlukan. Hapus noindex hanya sesudah data siap.

Tautan Shopee dan TikTok memakai URL pengguna. Pembacaan otomatis kedua platform tidak berhasil; data produk bersumber pada XLSX, bukan scraping baru. Referensi Cartiera hanya struktur, tidak ada foto/copy/logo yang disalin.

## Penyesuaian theme brand

Palet hangat diterapkan mengikuti arahan pemilik: heading #2C221E, body #5C524B, kartu putih dengan shadow tipis. Hover CTA memakai turunan camel #896442 agar teks putih tetap terbaca. Sage, dusty rose, dan butter disimpan sebagai opsi seasonal, tidak dicampur sebagai aksen UI sekaligus. Font sans-serif tunggal dan struktur halaman tetap konsisten.

## Sidebar dan banner editorial

Navigasi diperbarui mengikuti nigoo-sidebar-dan-section-foto-besar.md: sidebar tetap 260px pada viewport >=1024px; drawer native dialog dengan overlay, focus trap Tab/Shift+Tab, Escape, dan scroll lock pada layar lebih kecil. Kategori menggunakan accordion. Ikon navigasi memakai lucide-react. Tidak ada Instagram yang dikarang; kanal yang tersedia tetap Shopee dan TikTok.

Homepage: hero besar, 8 pilihan produk, banner sweater, 8 favorit berdasarkan data terjual Shopee, banner cardigan, 4 cardigan, brand statement, sosial, footer. Tidak menggunakan klaim New Arrival karena tanggal rilis tidak tersedia. Banner seluruhnya clickable dan memiliki ruang gambar tetap (16:9 desktop, 4:5 mobile; hero menyesuaikan viewport). Isi src/alt/position pada src/storefront/banners.json setelah foto asli tersedia. Hero memakai eager/high priority, banner lainnya lazy. Kegagalan gambar kembali ke placeholder.

Animasi: drawer masuk 240ms, section muncul ketika memasuki viewport, zoom halus pada foto saat hover. prefers-reduced-motion menonaktifkan gerakan. Filter ukuran/warna belum ditampilkan karena XLSX tidak menyediakan data varian.
