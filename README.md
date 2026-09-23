# 🎮 PERENCANAAN STARTUP: OMNIPLAY
### *The Ultimate Unified Gaming Ecosystem & Cloud Play Arena*

Portal web interaktif lengkap dan modern untuk perencanaan startup **OMNIPLAY**, dirancang khusus untuk memikat investor, mitra strategis, pengembang game, dan komunitas esports. Platform ini dilengkapi dengan kalkulator finansial dinamis, Business Model Canvas (BMC 9 Blok) interaktif, mode presentasi Pitch Deck investor, serta **demo game arcade playable (Cyber Strike Arena)** yang mendemonstrasikan keunggulan teknologi cloud gaming.

---

## 🌟 Fitur Utama Platform

1. **Cyber-Sleek Gaming UI / Dark Mode**:
   - Desain visual gaming-grade modern dengan aksen neon cyan (`#00f0ff`), electric violet (`#8a2be2`), dan neon emerald (`#00ff9d`).
   - Latar belakang animasi partikel interaktif ditenagai HTML5 Canvas.
   - Glassmorphism, tipografi premium (*Outfit*, *Plus Jakarta Sans*, *JetBrains Mono*).

2. **Business Model Canvas (BMC) 9 Blok Interaktif**:
   - 9 blok strategi terstruktur: *Key Partners, Key Activities, Key Resources, Value Propositions, Customer Relationships, Channels, Customer Segments, Cost Structure, Revenue Streams*.
   - Setiap kartu BMC dapat diklik untuk membuka modal rincian inisiatif taktis dan Key Performance Indicators (KPI).

3. **4 Pilar Teknologi Ekosistem Produk**:
   - **OmniHub**: Universal game launcher, cross-platform friend list, dan cloud save sync.
   - **OmniCloud Stream**: Edge streaming latency ultra-rendah (<25ms di Indonesia) berbasis WebRTC adaptif.
   - **OmniArena Esports**: Pembuatan turnamen otomatis, server-side anticheat, dan smart-escrow prize pool cair instan.
   - **OmniPass**: Model mikro-langganan terjangkau (mulai Rp 49.000/bln) dengan pembayaran e-wallet/pulsa lokal.

4. **🎮 Demo Game Interaktif Playable (Cyber Strike: Omni Arena)**:
   - Game aksi tembak-menembak luar angkasa 60 FPS langsung di browser.
   - **Synthesizer Suara Web Audio API**: Efek suara tembakan laser, ledakan bass drop, dan EMP shockwave tanpa file audio eksternal.
   - **Sistem Power-ups**: Upgrade senjata (Twin Laser, Triple Plasma), Quantum Shield, Nano Repair, dan EMP Shockwave.
   - **Wave Boss Fight**: Menghadapi musuh drone hingga boss raksasa *Cyber Dreadnought*.
   - **Kontrol Fleksibel**: Keyboard (WASD / Panah / Spasi / E), Mouse tracking, dan Tombol Sentuh On-Screen untuk ponsel/tablet.
   - **Simulasi Telemetri Cloud**: Indikator real-time 60 FPS, Edge Latency 14ms (Node JKT-01), dan papan peringkat turnamen OmniArena.

5. **Kalkulator Finansial & Proyeksi 5 Tahun Dinamis (Chart.js)**:
   - Slider variabel interaktif: Target MAU, Tingkat Konversi Langganan, Harga OmniPass, Biaya Server Edge, dan Belanja Turnamen.
   - Output real-time: Pelanggan berbayar, Annual Recurring Revenue (ARR), Pendapatan Bulanan, Margin Kotor, LTV/CAC ratio, dan CAC Payback period.
   - Dua visualisasi grafik interaktif: Bar/Line Chart Proyeksi 5 Tahun dan Doughnut Chart Komposisi Pendapatan.

6. **Analisis Pasar & Matriks Kompetitif**:
   - Segmentasi TAM ($187.7B), SAM ($15.2B), dan SOM ($2.4B Indonesia & SEA).
   - Wawasan demografi gamer mobile-first.
   - Tabel perbandingan komparatif OmniPlay vs Steam, Xbox Cloud, Discord, dan FaceIt.

7. **Roadmap Strategis & Alokasi Pendanaan**:
   - 4 Fase eksekusi terukur dari Q1 2026 hingga 2029.
   - Rincian penggunaan dana putaran Seed **$1.500.000 (Rp 23,2 Miliar)** untuk 18 bulan operasional.

8. **Mode Presentasi Pitch Deck Investor (8 Slides)**:
   - Mode layar penuh slide-per-slide dengan transisi halus.
   - Dilengkapi **Pitch Timer** (start, pause, reset) untuk melatih elevator pitch.
   - Drawer **Catatan Pembicara (Presenter Notes)** dengan tombol pintas `N`.
   - Navigasi keyboard: Panah Kiri/Kanan, Spasi, `F` (Fullscreen), `Esc` (Keluar).

9. **Ekspor Laporan Eksekutif (Print-to-PDF)**:
   - Tombol "Cetak Memo" dengan stylesheet cetak otomatis yang bersih tanpa latar gelap untuk kebutuhan lampiran investor.

---

## 📁 Struktur Direktori Proyek

```
c:/tugas rafly/Tugas cloud computing/
├── index.html            # Halaman utama aplikasi web
├── server.py             # Server Python lokal otomatis
├── run.bat               # Shortcut klik 2x untuk Windows
├── README.md             # Dokumentasi proyek
├── css/
│   └── style.css         # Desain sistem Cyber-Sleek CSS
└── js/
    ├── app.js            # Controller utama & event listeners
    ├── data.js           # Database model startup & pitch deck
    ├── calculator.js     # Engine finansial & grafik Chart.js
    ├── pitchdeck.js      # Controller presentasi slide deck
    └── game.js           # Engine game Canvas & Web Audio API
```

---

## 🚀 Cara Menjalankan Aplikasi

### Metode 1: Menggunakan file `run.bat` (Termudah di Windows)
Cukup klik dua kali pada file **`run.bat`** di folder proyek. Browser akan terbuka otomatis di alamat `http://localhost:8080`.

### Metode 2: Menggunakan Python
Buka terminal / PowerShell di direktori proyek ini, lalu jalankan:
```bash
python server.py
```
atau
```bash
python -m http.server 8080
```
Buka browser dan akses: `http://localhost:8080`

### Metode 3: Buka Langsung `index.html`
Anda juga dapat langsung membuka file `index.html` menggunakan browser Google Chrome, Microsoft Edge, atau Mozilla Firefox.

---

## 🎯 Kontrol Demo Game (Cyber Strike Arena)

| Aksi | Keyboard | Mouse / Sentuh |
| :--- | :--- | :--- |
| **Gerak Pesawat** | `W`, `A`, `S`, `D` atau `Tombol Panah` | Geser Kursor / Sentuh Layar |
| **Tembak Senjata** | `Spasi` / Otomatis | Klik Kiri / Tombol On-screen FIRE |
| **EMP Shockwave** | Tombol `E` | Tombol On-screen EMP |
| **Jeda (Pause)** | Tombol `P` | Tombol Pause di Toolbar |

---

*Dibuat untuk Tugas Cloud Computing — Platform Perencanaan Startup: OMNIPLAY*
