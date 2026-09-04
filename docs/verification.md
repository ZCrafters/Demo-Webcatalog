# Verifikasi Nigoo

Tanggal: 4 September 2026.

- Import XLSX: 35 baris menjadi 30 produk, lima duplikat digabung.
- Rekonsiliasi otomatis: semua baris sumber cocok pada harga, diskon, rating, label terjual, nama sumber, dan asal duplikat.
- Browser: screenshot desktop 1280 px, tablet 768 px, mobile 375 px telah ditinjau.
- Katalog: 30 produk; kategori Cardigan menampilkan 16; sort termurah dimulai Josie Sweater Rp139.900; sort terlaris dimulai produk dengan label 10RB+.
- Pencarian: Cami hanya satu hasil; kueri tidak ditemukan menampilkan empty state dan tombol reset.
- Header: pencarian menavigasi ke katalog; menu mobile membuka navigasi dan menutup setelah memilih About Us.
- Keranjang: tambah Alinea, naikkan kuantitas menjadi dua, total Rp399.800. Isi keranjang bertahan setelah reload.
- Checkout: form kosong tidak bisa disubmit; data contoh dapat menyelesaikan simulasi; keranjang dikosongkan.
- About dan kontak: tampil; tautan sosial menuju URL Shopee/TikTok yang diberikan pengguna. Transaksi di platform eksternal tidak diuji.
- Fallback: entry point 404 menampilkan halaman tidak ditemukan dan tautan kembali ke koleksi.
- Tidak ada error/warning JavaScript yang tercatat selama alur browser yang diuji.

Yang belum dapat divalidasi: foto asli, stok dan varian, harga/promo terkini, checkout pembayaran nyata, performa jaringan produksi. Foto sengaja placeholder sesuai workflow.
