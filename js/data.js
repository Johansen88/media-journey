// data.js - Database & Model Perencanaan Startup OMNIPLAY
export const startupData = {
  profile: {
    name: "OMNIPLAY",
    tagline: "The Ultimate Unified Gaming Ecosystem & Cloud Play Arena",
    shortDescription: "Platform gaming terpadu all-in-one yang menyatukan universal game library, cloud gaming berlatensi ultra-rendah untuk gamer dengan perangkat terbatas, turnamen esports otomatis berteknologi smart-escrow, dan model langganan hemat OmniPass.",
    foundingYear: "2026",
    headquarters: "Jakarta, Indonesia (Hub Utama Asia Tenggara)",
    fundingStage: "Seed Round ($1.5M / Rp 23,2 Miliar)",
    website: "https://omniplay.gg",
    status: "Pre-Launch / Closed Beta Q2 2026",
    metricsHighlight: [
      { label: "Target TAM Global", value: "$187.7B", change: "+8.9% YoY", icon: "globe" },
      { label: "SOM Pasar Indonesia & SEA", value: "$2.4B", change: "128M Gamer Aktif", icon: "target" },
      { label: "Target MAU Tahun ke-1", value: "250,000", change: "5.0% Paid Conversion", icon: "users" },
      { label: "Proyeksi ARR Tahun ke-3", value: "$12.8M", change: "Gross Margin 68%", icon: "trending-up" }
    ]
  },

  problemSolution: [
    {
      id: "prob-1",
      icon: "layers",
      title: "Fragmentasi Ekosistem Game",
      problem: "Gamer modern harus membuka 5-7 aplikasi berbeda (Steam, Epic Games, Discord, Game Launcher lokal, FaceIt) untuk melacak game, teman, dan turnamen.",
      solution: "OmniHub: Universal Gaming Portal yang menyatukan perpustakaan game (PC, Mobile, Konsol), friend list lintas platform, dan reputasi gamer terpadu."
    },
    {
      id: "prob-2",
      icon: "cpu",
      title: "Kesenjangan Hardware (Barrier to Entry)",
      problem: "Game AAA modern menuntut PC gaming mahal ($1,000+) atau konsol terbaru, membuat 78% gamer di Asia Tenggara terjebak pada game mobile spek rendah.",
      solution: "OmniCloud: Layanan streaming game berbasis Edge Server lokal dengan kompresi WebRTC adaptif. Mainkan game AAA 1080p 60fps di ponsel Rp 1 jutaan."
    },
    {
      id: "prob-3",
      icon: "trophy",
      title: "Hambatan Kompetisi Esports Akar Rumput",
      problem: "Penyelenggara turnamen komunitas kewalahan mengelola bracket manual, kecurangan (cheat), serta keterlambatan pembayaran hadiah (prize pool).",
      solution: "OmniArena: Turnamen otomatis berbasis algoritma smart-bracket, integrasi anticheat server-side, dan smart-escrow prize pool cair instan."
    },
    {
      id: "prob-4",
      icon: "wallet",
      title: "Monetisasi Developer Indie & Kreator",
      problem: "Developer indie lokal sulit mendapatkan visibilitas di toko aplikasi global, sementara kreator konten bergantung pada sponsorship yang tidak menentu.",
      solution: "OmniPass & Creator Pool: Ekosistem revenue share 70/30, game pass khusus regional Asia Tenggara, dan royalti otomatis untuk kreator yang membawa pemain."
    }
  ],

  // 9 Blok Business Model Canvas (BMC)
  bmc: [
    {
      id: "bmc-partners",
      title: "Key Partners (Mitra Utama)",
      subtitle: "Siapa mitra strategis kunci?",
      icon: "handshake",
      color: "#8a2be2",
      items: [
        { name: "Penyedia Cloud & CDN Edge Lokal", desc: "Kerja sama dengan Telkom Indonesia, AWS Local Zones Jakarta, Equinix untuk edge server latency <25ms." },
        { name: "Publisher & Studio Game Indie", desc: "Kemitraan lisensi katalog game lokal (Asosiasi Game Indonesia / AGI) & publisher indie internasional." },
        { name: "Payment Gateways & E-Wallet", desc: "Integrasi Midtrans, Xendit, QRIS, GoPay, OVO, ShopeePay, DANA, dan potong pulsa telco (Telkomsel/Indosat)." },
        { name: "Komunitas Kampus & Warnet/iCafe", desc: "Aktivasi turnamen di 150+ warnet modern & 50 UKM esports universitas se-Indonesia." }
      ],
      kpi: "25+ Studio Game & 3 Operator CDN Terafiliasi di Tahun ke-1"
    },
    {
      id: "bmc-activities",
      title: "Key Activities (Aktivitas Utama)",
      subtitle: "Operasi harian utama bisnis",
      icon: "zap",
      color: "#00f0ff",
      items: [
        { name: "Pengembangan Software & Edge Cloud", desc: "R&D protokol streaming WebRTC ultra-low latency dan sinkronisasi cross-save API." },
        { name: "Kurasi & Lisensi Konten Game", desc: "Akuisisi hak streaming game indie populer dan game kompetitif." },
        { name: "Operasi Turnamen & Komunitas", desc: "Menjalankan liga mingguan, moderasi leaderboard, dan verifikasi anticheat." },
        { name: "Marketing & Growth Hacking", desc: "Kampanye viral TikTok, turnamen influencer, dan program referral 'Ajak 3 Teman Main Gratis'." }
      ],
      kpi: "Uptime Server 99.95%, Latensi Rata-rata < 30ms di Seluruh Jawa & Bali"
    },
    {
      id: "bmc-resources",
      title: "Key Resources (Sumber Daya Kunci)",
      subtitle: "Aset vital yang dibutuhkan",
      icon: "database",
      color: "#00ff9d",
      items: [
        { name: "Infrastruktur Server GPU Virtual", desc: "Kapasitas komputasi edge GPU berbasis NVIDIA vGPU / AMD ROCm untuk rendering cloud game." },
        { name: "Hak Cipta & Proprietary Software", desc: "Source code OmniEngine (kompresi video proprietary & algoritma smart-bracket turnamen)." },
        { name: "Tim Talenta Engineering & Esports", desc: "Senior cloud architect, WebRTC engineer, game producer, dan veteran event esports." },
        { name: "Komunitas Pengguna Awal", desc: "50,000+ anggota Discord gamer & database pemain kompetitif terverifikasi." }
      ],
      kpi: "300+ Node GPU Edge pada Fase 1 Peluncuran"
    },
    {
      id: "bmc-value",
      title: "Value Propositions (Proposisi Nilai)",
      subtitle: "Solusi bernilai tinggi bagi pengguna",
      icon: "award",
      color: "#ff007f",
      items: [
        { name: "Main Game AAA di Perangkat Apapun", desc: "Tanpa perlu PC gaming mahal; cukup smartphone Rp 1 jutaan atau laptop kantoran biasa." },
        { name: "All-in-One Gaming Hub", desc: "Satu profil, satu friend list, satu launcher untuk semua game PC, mobile, dan emulator." },
        { name: "Turnamen Esports Otomatis & Hadiah Cair Instan", desc: "Kompetisi adil dengan anticheat terintegrasi dan pencairan hadiah otomatis via e-wallet." },
        { name: "Harga Sangat Terjangkau (OmniPass)", desc: "Akses ratusan game & kuota cloud play mulai dari Rp 49.000/bulan (model mikro-langganan)." }
      ],
      kpi: "Menghemat pengeluaran hardware gamer hingga 80%"
    },
    {
      id: "bmc-relationships",
      title: "Customer Relationships (Hubungan Pelanggan)",
      subtitle: "Bagaimana menjalin relasi jangka panjang?",
      icon: "heart",
      color: "#ffaa00",
      items: [
        { name: "Sistem Gamifikasi & Battle Pass", desc: "XP harian, lencana profil reputasi, season reward, dan diskon merchandise." },
        { name: "Dukungan Komunitas 24/7", desc: "Discord VIP server, bot ticket terintegrasi, dan technical live support chat." },
        { name: "Program Creator & Guild", desc: "Revenue share untuk ketua guild/tim esports yang aktif mengadakan turnamen." },
        { name: "Loop Umpan Balik Co-Development", desc: "Voting fitur baru dan closed beta testing bersama komunitas paling loyal." }
      ],
      kpi: "Net Promoter Score (NPS) > 65 & Churn Rate < 5.5% per bulan"
    },
    {
      id: "bmc-channels",
      title: "Channels (Saluran Distribusi)",
      subtitle: "Bagaimana produk sampai ke user?",
      icon: "share-2",
      color: "#00f0ff",
      items: [
        { name: "Aplikasi Multi-Platform", desc: "Progressive Web App (PWA), Desktop Client (Windows/macOS), dan Android APK." },
        { name: "Kemitraan Provider ISP & Telco", desc: "Bundling paket data gaming bersama Telkomsel, By.U, Indosat, dan MyRepublic." },
        { name: "Influencer & Streamer Affiliate", desc: "Live streaming review gameplay cloud di TikTok Live, YouTube Gaming, dan Twitch." },
        { name: "Aktivasi On-Ground Esports", desc: "Booth demo interaktif di festival pop culture (Comic Con, DG Con) dan turnamen kampus." }
      ],
      kpi: "65% Pendaftaran Baru Organik via Referral & Kemitraan Telco"
    },
    {
      id: "bmc-segments",
      title: "Customer Segments (Segmen Pelanggan)",
      subtitle: "Siapa pengguna dan target pasar?",
      icon: "users",
      color: "#8a2be2",
      items: [
        { name: "Gamer Perangkat Terbatas (Mid-Tier Gamers)", desc: "Remaja & mahasiswa usia 16-28 tahun yang ingin main game AAA tapi terkendala harga PC." },
        { name: "Pemain Kompetitif & Pemula Esports", desc: "Tim amatir dan semi-pro yang butuh wadah turnamen teratur dengan hadiah transparan." },
        { name: "Penyelenggara Turnamen & Komunitas Kampus", desc: "Organizer yang membutuhkan sistem manajemen bracket dan prize pool otomatis." },
        { name: "Developer Game Indie Regional", desc: "Studio game Asia Tenggara yang mencari distribusi dan pengguna baru tanpa potongan 30% Steam." }
      ],
      kpi: "Fokus Awal: 18-24 Tahun, Penduduk Urban Jawa, Sumatera, & Bali"
    },
    {
      id: "bmc-cost",
      title: "Cost Structure (Struktur Biaya)",
      subtitle: "Beban pengeluaran utama operasional",
      icon: "dollar-sign",
      color: "#ef4444",
      items: [
        { name: "Sewa Infrastruktur GPU Cloud & Bandwidth", desc: "Biaya komputasi edge server vGPU, bandwidth egress, dan lisensi software streaming (42% budget)." },
        { name: "Gaji Tim R&D & Operasional", desc: "Talenta software engineer, DevOps, product manager, dan community manager (32% budget)." },
        { name: "Akuisisi Pengguna (CAC & Marketing)", desc: "Iklan berbayar, sponsorship turnamen, influencer marketing, dan event kampus (16% budget)." },
        { name: "Legalitas, Lisensi Konten, & Administrasi", desc: "Royalti game, biaya payment gateway, perizinan PSE Kominfo, dan operasional kantor (10% budget)." }
      ],
      kpi: "Efisiensi Biaya Server Target < $0.16 per Jam Streaming Pengguna"
    },
    {
      id: "bmc-revenue",
      title: "Revenue Streams (Aliran Pendapatan)",
      subtitle: "Dari mana startup menghasilkan uang?",
      icon: "trending-up",
      color: "#00ff9d",
      items: [
        { name: "Langganan OmniPass Tier Premium", desc: "Paket Rp 49.000 - Rp 99.000/bln untuk akses ratusan game + jam cloud play tak terbatas 1080p." },
        { name: "Tiket Jam Tambahan (Pay-As-You-Go Cloud)", desc: "Top up instan kuota streaming per jam (Rp 5.000/jam) untuk pengguna kasual non-langganan." },
        { name: "Biaya Platform Turnamen (Take Rate 8-12%)", desc: "Potongan biaya administrasi dari total prize pool turnamen komersial di OmniArena." },
        { name: "Iklan Brand & Sponsorship Terintegrasi", desc: "Penempatan brand sponsor pada loading screen, banner turnamen, dan trophy room." }
      ],
      kpi: "Target ARPU (Average Revenue per User) $4.20 / Bulan"
    }
  ],

  // 4 Pilar Produk Utama
  products: [
    {
      id: "omnihub",
      title: "OmniHub",
      tagline: "Universal Game Portal & Cross-Platform Social Launcher",
      icon: "grid",
      badge: "CORE ENGINE",
      features: [
        "Satu klik sinkronisasi perpustakaan game dari Steam, Epic Games, Riot, dan Mobile.",
        "Universal Social ID: Temukan teman online di semua platform dalam satu jendela.",
        "Cloud Save Synchronizer: Lanjutkan progres game di mana saja tanpa khawatir data hilang.",
        "Statistik & Achievement Showcase terintegrasi untuk portofolio gamer profesional."
      ],
      previewStats: { stat1: "30+ Platform", stat2: "Instant Sync", stat3: "1 Profil Global" }
    },
    {
      id: "omnicloud",
      title: "OmniCloud Stream",
      tagline: "Ultra-Low Latency Edge Cloud Gaming",
      icon: "cloud-lightning",
      badge: "PROPRIETARY TECH",
      features: [
        "Protokol WebRTC adaptif proprietary menghasilkan latensi secepat kilat (<25ms di Indonesia).",
        "Dukungan resolusi dinamis 1080p 60FPS dengan konsumsi kuota hemat (adaptif bit-rate).",
        "Mendukung virtual gamepad touchscreen, Bluetooth controller, dan mouse/keyboard.",
        "Zero-install: Mainkan game langsung dari browser Chrome/Edge tanpa unduh bergiga-giga."
      ],
      previewStats: { stat1: "< 25ms Ping", stat2: "1080p 60FPS", stat3: "0 GB Storage" }
    },
    {
      id: "omniarena",
      title: "OmniArena Esports",
      tagline: "Automated Tournament Engine & Smart-Escrow",
      icon: "swords",
      badge: "ESPORTS TECH",
      features: [
        "Pembuatan turnamen instan (Single/Double Elimination, Swiss System, Battle Royale points).",
        "Server-side Anticheat: Pemantauan otomatis mendeteksi cheat injeksi dan exploit memori.",
        "Smart-Escrow Prize Pool: Dana hadiah dijamin aman dan cair instan ke e-wallet pemenang.",
        "Leaderboard resmi terverifikasi yang dilirik oleh tim esports profesional (talent scouting)."
      ],
      previewStats: { stat1: "Instant Payout", stat2: "Anti-Cheat AI", stat3: "Automated Bracket" }
    },
    {
      id: "omnypass",
      title: "OmniPass Subscription",
      tagline: "The Most Affordable Gaming Pass in Southeast Asia",
      icon: "credit-card",
      badge: "HIGH MARGIN",
      features: [
        "Katalog 100+ game indie dan multiplayer premium tanpa perlu beli satu per satu.",
        "Kuota cloud play prioritas tanpa antrean server pada jam sibuk.",
        "Diskon khusus tiket turnamen berbayar dan in-game items marketplace.",
        "Mendukung pembayaran mikro harian/mingguan via pulsa dan e-wallet lokal."
      ],
      previewStats: { stat1: "Rp 49K / Bln", stat2: "100+ Game", stat3: "Priority Queue" }
    }
  ],

  // Data Analisis Pasar
  market: {
    tam: { value: "$187.7B", label: "Total Addressable Market", desc: "Nilai industri game global dengan lebih dari 3.38 miliar gamer aktif di seluruh dunia." },
    sam: { value: "$15.2B", label: "Serviceable Addressable Market", desc: "Pasar game di Asia Tenggara dengan pertumbuhan tahunan majemuk (CAGR) tertinggi di dunia (+8.9%)." },
    som: { value: "$2.4B", label: "Serviceable Obtainable Market", desc: "Segmen target gamer Indonesia dan regional SEA yang membutuhkan solusi game cloud terjangkau." },
    demographics: [
      { category: "Kelompok Usia Utama", value: "16 - 28 Tahun", note: "68% dari total pengguna aktif internet yang bermain game" },
      { category: "Dominasi Perangkat", value: "84% Mobile Phone", note: "Gamer yang ingin merasakan sensasi grafis PC/AAA" },
      { category: "Penetrasi E-Wallet", value: "91% Terbiasa Transaksi Digital", note: "Mempermudah model mikro-langganan harian dan bulanan" },
      { category: "Rata-rata Waktu Bermain", value: "3.4 Jam / Hari", note: "Keterlibatan harian sangat tinggi untuk retensi pengguna" }
    ]
  },

  // Matriks Kompetitor
  competitors: [
    { feature: "Harga Akses Cloud Terjangkau", omni: true, steam: false, xbox: false, discord: false, faceit: false },
    { feature: "Server Lokal Latensi Rendah (<30ms)", omni: true, steam: false, xbox: false, discord: false, faceit: false },
    { feature: "Turnamen Otomatis & Escrow Hadiah", omni: true, steam: false, xbox: false, discord: false, faceit: true },
    { feature: "Universal Launcher Lintas Toko", omni: true, steam: false, xbox: false, discord: false, faceit: false },
    { feature: "Pembayaran E-Wallet Lokal & Pulsa", omni: true, steam: false, xbox: false, discord: false, faceit: false },
    { feature: "Bisa Dimainkan di HP Kentang (Zero Install)", omni: true, steam: false, xbox: true, discord: false, faceit: false },
    { feature: "Ekosistem Komunitas & Suara Terintegrasi", omni: true, steam: true, xbox: false, discord: true, faceit: false }
  ],

  // Roadmap 4 Fase
  roadmap: [
    {
      phase: "Fase 1: Q1 - Q2 2026",
      title: "Infrastruktur & Peluncuran Beta Terbatas",
      badge: "CURRENT FOCUS",
      items: [
        "Pembangunan cluster Edge Server perdana di Jakarta & Surabaya (kapasitas 2.500 concurrent sessions).",
        "Rilis OmniHub Desktop Client & Progressive Web App (PWA) untuk Android/iOS.",
        "Peluncuran Closed Beta 10.000 pengguna bersama 20 komunitas esports kampus.",
        "Katalog 35 judul game indie dan free-to-play kompetitif."
      ]
    },
    {
      phase: "Fase 2: Q3 - Q4 2026",
      title: "Monetisasi OmniPass & OmniArena Esports",
      badge: "GROWTH PHASE",
      items: [
        "Aktivasi langganan berbayar OmniPass dengan bundling e-wallet & operator telekomunikasi.",
        "Peluncuran turnamen berhadiah resmi OmniArena National Championship dengan sponsor brand ternama.",
        "Integrasi anticheat server-side dan automated prize pool escrow.",
        "Pencapaian target 250.000 Monthly Active Users (MAU) dan 12.500 pelanggan berbayar."
      ]
    },
    {
      phase: "Fase 3: 2027",
      title: "Ekspansi Regional Asia Tenggara (SEA)",
      badge: "EXPANSION",
      items: [
        "Ekspansi server edge ke Filipina, Vietnam, Thailand, dan Malaysia.",
        "Peluncuran OmniPlay Developer SDK untuk studio game indie menerbitkan game secara instan.",
        "Fitur turnamen lintas negara dengan currency auto-converter (IDR, PHP, VND, MYR).",
        "Target 1.200.000 MAU dan Gross Annual Recurring Revenue (ARR) $6.5M."
      ]
    },
    {
      phase: "Fase 4: 2028 - 2029",
      title: "Ekosistem Skala Penuh & AI Game Co-pilot",
      badge: "MATURITY",
      items: [
        "Implementasi AI Game Co-pilot: Asisten taktik real-time dan analisis rekaman pertandingan pemain.",
        "Integrasi marketplace item antar game dengan teknologi tokenized digital asset yang ramah pengguna.",
        "Penjajakan Pendanaan Series A / B untuk ekspansi ke pasar Amerika Latin dan Timur Tengah.",
        "Target 4.500.000 MAU dan Profitabilitas Penuh (Operating Cashflow Positif)."
      ]
    }
  ],

  // Alokasi Pendanaan Seed ($1.5M)
  funding: {
    totalUSD: 1500000,
    totalIDR: "Rp 23,25 Miliar",
    runway: "18 Bulan Operasional Menuju Break-Even",
    breakdown: [
      { category: "Infrastruktur Cloud GPU & R&D", percentage: 42, amountUSD: 630000, desc: "Sewa GPU cluster edge lokal, lisensi software streaming, dan optimasi low latency WebRTC engine." },
      { category: "Perekrutan Tim Inti & Engineering", percentage: 30, amountUSD: 450000, desc: "Gaji 14 talenta inti: Cloud engineers, frontend/backend devs, event esports lead, dan UI/UX designer." },
      { category: "Marketing, Komunitas, & User Acquisition", percentage: 18, amountUSD: 270000, desc: "Sponsorship turnamen kampus, influencer affiliate, kampanye TikTok/YouTube, dan aktivasi offline." },
      { category: "Lisensi Konten Game, Legal, & Cadangan Kas", percentage: 10, amountUSD: 150000, desc: "Uang muka lisensi game studio indie, sertifikasi PSE Kominfo, hak paten, dan audit keamanan." }
    ],
    milestones: [
      "Mencapai 250.000 MAU dalam 12 bulan pertama dengan retensi 30 hari > 38%",
      "Menghasilkan Annual Recurring Revenue (ARR) $1.39M di tahun pertama",
      "Mencapai Unit Economics positif dengan rasio LTV/CAC > 4.5x",
      "Membangun kemitraan strategis dengan minimal 1 operator telco tier-1 dan 50 studio game"
    ]
  ],

  // Profil Tim Pendiri
  team: [
    {
      name: "Rafly Aldiansyah",
      role: "Chief Executive Officer (CEO) & Co-Founder",
      background: "Visioner ekosistem cloud & platform gaming. Berpengalaman dalam arsitektur cloud computing, strategi kemitraan industri game, dan kepemimpinan startup.",
      avatar: "👨‍💻",
      social: "linkedin.com/in/rafly-omniplay"
    },
    {
      name: "Arya Wicaksono",
      role: "Chief Technology Officer (CTO) & Co-Founder",
      background: "Eks-Senior Infrastructure Engineer di penyedia CDN regional. Spesialis WebRTC low-latency streaming dan optimasi pipeline rendering GPU.",
      avatar: "⚡",
      social: "github.com/aryaw-omni"
    },
    {
      name: "Siti Nurhaliza",
      role: "Chief Operating Officer (COO)",
      background: "Mantan Head of Operations di platform turnamen esports nasional. Mengelola 200+ event kompetitif dengan total partisipasi 50.000+ atlet.",
      avatar: "🎯",
      social: "linkedin.com/in/sitinur-esports"
    },
    {
      name: "Budi Santoso",
      role: "Head of Growth & Monetization",
      background: "Ex-Growth Lead di startup fintech unicorn. Memimpin akuisisi 2 juta pengguna aktif melalui strategi referral viral dan kemitraan telco.",
      avatar: "🚀",
      social: "linkedin.com/in/budisantoso-growth"
    }
  ],

  // Pitch Deck Slide Data (8 Slides)
  pitchDeck: [
    {
      slideNumber: 1,
      title: "OMNIPLAY: Unified Gaming & Cloud Arena",
      subtitle: "Pitch Presentasi Putaran Pendanaan Seed ($1.5M)",
      badge: "SLIDE 1 • COVER",
      content: `
        <div style="text-align: center; padding: 2rem 0;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🎮⚡</div>
          <h1 style="font-size: 2.8rem; font-weight: 800; background: linear-gradient(135deg, #00f0ff, #8a2be2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">OMNIPLAY</h1>
          <p style="font-size: 1.3rem; color: #94a3b8; max-width: 650px; margin: 1rem auto;">Mendemokratisasi akses game PC & konsol AAA untuk 128 juta gamer di pasar berkembang tanpa perlu membeli perangkat mahal.</p>
          <div style="display: inline-block; margin-top: 1.5rem; padding: 0.6rem 1.4rem; background: rgba(0, 240, 255, 0.1); border: 1px solid rgba(0, 240, 255, 0.4); border-radius: 99px; color: #00f0ff; font-weight: 600;">
            Target Pendanaan: $1.500.000 (Seed Round) • Jakarta, Indonesia
          </div>
        </div>
      `,
      notes: "Sapa investor dengan antusias. Tekankan bahwa OmniPlay bukan sekadar toko game, melainkan infrastruktur terpadu yang memecahkan hambatan terbesar gamer di Asia Tenggara: harga hardware."
    },
    {
      slideNumber: 2,
      title: "Masalah Besar Industri Gaming Regional",
      subtitle: "Kesenjangan Antara Minat Gamer dan Kemampuan Beli Hardware",
      badge: "SLIDE 2 • PROBLEM",
      content: `
        <div class="pitch-grid-cols">
          <div class="pitch-card-item">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">💻❌</div>
            <h4 style="color: #ff007f; font-size: 1.15rem; margin-bottom: 0.5rem;">Hardware Terlalu Mahal</h4>
            <p style="font-size: 0.9rem; color: #94a3b8;">PC gaming berkualitas rata-rata berharga $1,000+ (Rp 15-20 juta), sedangkan pendapatan rata-rata pemuda di SEA hanya $250-$450 per bulan.</p>
          </div>
          <div class="pitch-card-item">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔀❌</div>
            <h4 style="color: #ffaa00; font-size: 1.15rem; margin-bottom: 0.5rem;">Ekosistem Terfragmentasi</h4>
            <p style="font-size: 0.9rem; color: #94a3b8;">Gamer membuka Steam untuk game PC, Google Play untuk mobile, Discord untuk chat, dan FaceIt untuk turnamen. Tidak ada satu pintu terpadu.</p>
          </div>
          <div class="pitch-card-item">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏆❌</div>
            <h4 style="color: #00f0ff; font-size: 1.15rem; margin-bottom: 0.5rem;">Turnamen Amatir Semrawut</h4>
            <p style="font-size: 0.9rem; color: #94a3b8;">Penyelenggara turnamen esports komunitas kesulitan mengurus bracket secara manual dan pembayaran hadiah rawan keterlambatan atau penipuan.</p>
          </div>
        </div>
      `,
      notes: "Tunjukkan statistik bahwa 78% gamer di Indonesia dan SEA hanya memiliki smartphone mid-to-low tier. Mereka ingin main game AAA seperti Cyberpunk, GTA, atau Valorant tetapi tidak mampu membeli PC."
    },
    {
      slideNumber: 3,
      title: "Solusi Kami: Platform OmniPlay",
      subtitle: "The Ultimate All-in-One Cloud & Social Gaming Portal",
      badge: "SLIDE 3 • SOLUTION",
      content: `
        <div class="pitch-grid-cols-2">
          <div class="pitch-card-item">
            <h4 style="color: #00f0ff; margin-bottom: 0.5rem;">1. OmniCloud Edge Streaming</h4>
            <p style="font-size: 0.9rem; color: #94a3b8;">Streaming game AAA resolusi 1080p 60fps dengan latensi <25ms langsung ke smartphone, laptop biasa, atau tablet via browser Chrome/Edge.</p>
          </div>
          <div class="pitch-card-item">
            <h4 style="color: #8a2be2; margin-bottom: 0.5rem;">2. OmniHub Universal Launcher</h4>
            <p style="font-size: 0.9rem; color: #94a3b8;">Satu profil, satu friend list, dan satu pencarian untuk seluruh game PC, konsol, dan mobile yang dimiliki pengguna.</p>
          </div>
          <div class="pitch-card-item">
            <h4 style="color: #00ff9d; margin-bottom: 0.5rem;">3. OmniArena Automated Esports</h4>
            <p style="font-size: 0.9rem; color: #94a3b8;">Turnamen otomatis dengan anticheat terintegrasi dan pencairan hadiah instan via e-wallet terpercaya.</p>
          </div>
          <div class="pitch-card-item">
            <h4 style="color: #ff007f; margin-bottom: 0.5rem;">4. OmniPass Mikro-Langganan</h4>
            <p style="font-size: 0.9rem; color: #94a3b8;">Akses 100+ game indie dan cloud play mulai dari Rp 49.000/bln yang dapat dibayar menggunakan pulsa dan QRIS.</p>
          </div>
        </div>
      `,
      notes: "Soroti keunggulan arsitektur edge node lokal OmniPlay yang berada dekat dengan pemain di Jakarta dan kota-kota sekunder, mengatasi masalah latensi yang dialami kompetitor global seperti Xbox Cloud."
    },
    {
      slideNumber: 4,
      title: "Peluang Pasar Raksasa di Asia Tenggara",
      subtitle: "Pasar Mobile-First yang Sedang Bertransisi ke Konten Premium",
      badge: "SLIDE 4 • MARKET",
      content: `
        <div style="display: flex; gap: 1.5rem; justify-content: center; margin-bottom: 1.5rem; text-align: center;">
          <div style="flex: 1; padding: 1.2rem; background: rgba(0, 240, 255, 0.08); border-radius: 12px; border: 1px solid rgba(0, 240, 255, 0.3);">
            <div style="font-size: 2.2rem; font-weight: 800; color: #00f0ff;">$187.7B</div>
            <div style="font-size: 0.85rem; color: #cbd5e1; font-weight: 600;">TAM Global Gaming</div>
          </div>
          <div style="flex: 1; padding: 1.2rem; background: rgba(138, 43, 226, 0.08); border-radius: 12px; border: 1px solid rgba(138, 43, 226, 0.3);">
            <div style="font-size: 2.2rem; font-weight: 800; color: #8a2be2;">$15.2B</div>
            <div style="font-size: 0.85rem; color: #cbd5e1; font-weight: 600;">SAM Asia Tenggara (+8.9% YoY)</div>
          </div>
          <div style="flex: 1; padding: 1.2rem; background: rgba(0, 255, 157, 0.08); border-radius: 12px; border: 1px solid rgba(0, 255, 157, 0.3);">
            <div style="font-size: 2.2rem; font-weight: 800; color: #00ff9d;">$2.4B</div>
            <div style="font-size: 0.85rem; color: #cbd5e1; font-weight: 600;">SOM Target Indonesia & SEA</div>
          </div>
        </div>
        <p style="text-align: center; color: #94a3b8; font-size: 0.95rem;">Indonesia memiliki <strong>128 juta gamer aktif</strong> dengan penetrasi internet dan e-wallet tercepat, namun pengeluaran hardware masih rendah. OmniPlay mengubah mereka menjadi pembeli layanan cloud berbayar.</p>
      `,
      notes: "Jelaskan mengapa waktu peluncuran saat ini sangat tepat: jaringan 5G mulai menyebar, tarif kuota broadband semakin murah, dan antusiasme turnamen esports lokal berada di puncak tertinggi."
    },
    {
      slideNumber: 5,
      title: "Model Bisnis & Arsitektur Monetisasi",
      subtitle: "Multi-Stream Revenue dengan Margin Tinggi dan Retensi Kuat",
      badge: "SLIDE 5 • BUSINESS MODEL",
      content: `
        <div class="pitch-grid-cols">
          <div class="pitch-card-item">
            <h4 style="color: #00ff9d; font-size: 1.05rem;">OmniPass Subscription</h4>
            <p style="font-size: 0.85rem; color: #94a3b8; margin: 0.4rem 0;">Rp 49.000 - Rp 99.000/bln ($3.2 - $6.4). Menyumbang 65% proyeksi pendapatan dengan recurring cash flow teratur.</p>
          </div>
          <div class="pitch-card-item">
            <h4 style="color: #00f0ff; font-size: 1.05rem;">Esports Take Rate</h4>
            <p style="font-size: 0.85rem; color: #94a3b8; margin: 0.4rem 0;">Komisi 8% - 12% dari total prize pool turnamen komersial dan biaya tiket registrasi tim.</p>
          </div>
          <div class="pitch-card-item">
            <h4 style="color: #8a2be2; font-size: 1.05rem;">Brand Sponsorships</h4>
            <p style="font-size: 0.85rem; color: #94a3b8; margin: 0.4rem 0;">Iklan integratif brand minuman energi, smartphone, telco, dan perangkat periferal pada platform.</p>
          </div>
        </div>
      `,
      notes: "Tekankan bahwa unit economics OmniPlay dirancang menghasilkan Gross Margin di atas 65% karena efisiensi server edge regional dan model monetisasi majemuk."
    },
    {
      slideNumber: 6,
      title: "Traksi & Rencana Eksekusi (Roadmap)",
      subtitle: "Dari Peluncuran Beta Nasional hingga Dominasi Regional Asia Tenggara",
      badge: "SLIDE 6 • ROADMAP",
      content: `
        <div style="display: flex; flex-direction: column; gap: 0.8rem;">
          <div style="display: flex; gap: 1rem; align-items: center; background: rgba(255,255,255,0.03); padding: 0.8rem 1rem; border-radius: 8px;">
            <span style="color: #00f0ff; font-weight: 700; width: 120px;">Q1-Q2 2026</span>
            <span style="color: #f8fafc; font-size: 0.95rem;">Peluncuran Beta Terbatas, 10.000 Closed Testers, 35 Game Katalog, 1 Edge Server Node Jakarta.</span>
          </div>
          <div style="display: flex; gap: 1rem; align-items: center; background: rgba(255,255,255,0.03); padding: 0.8rem 1rem; border-radius: 8px;">
            <span style="color: #8a2be2; font-weight: 700; width: 120px;">Q3-Q4 2026</span>
            <span style="color: #f8fafc; font-size: 0.95rem;">Monetisasi Penuh OmniPass, 250.000 MAU, Kemitraan Bundling Operator Telco.</span>
          </div>
          <div style="display: flex; gap: 1rem; align-items: center; background: rgba(255,255,255,0.03); padding: 0.8rem 1rem; border-radius: 8px;">
            <span style="color: #00ff9d; font-weight: 700; width: 120px;">2027</span>
            <span style="color: #f8fafc; font-size: 0.95rem;">Ekspansi Regional (Filipina, Vietnam, Thailand), Rilis Developer SDK, Target 1.2M MAU ($6.5M ARR).</span>
          </div>
        </div>
      `,
      notes: "Tunjukkan milestone yang terukur dan realistis. Fokus 12 bulan pertama adalah dominasi pasar Indonesia sebelum memperluas ke negara tetangga."
    },
    {
      slideNumber: 7,
      title: "Tim Pendiri & Pengalaman Industri",
      subtitle: "Kombinasi Rekayasa Cloud, Operasional Esports, dan Pertumbuhan Startup",
      badge: "SLIDE 7 • TEAM",
      content: `
        <div class="pitch-grid-cols">
          <div class="pitch-card-item" style="text-align: center;">
            <div style="font-size: 2.2rem; margin-bottom: 0.4rem;">👨‍💻</div>
            <h4 style="color: #fff; font-size: 1rem;">Rafly Aldiansyah</h4>
            <div style="color: #00f0ff; font-size: 0.8rem; margin-bottom: 0.4rem;">CEO & Co-Founder</div>
            <p style="font-size: 0.8rem; color: #94a3b8;">Arsitektur Cloud & Visi Strategis Startup Gaming</p>
          </div>
          <div class="pitch-card-item" style="text-align: center;">
            <div style="font-size: 2.2rem; margin-bottom: 0.4rem;">⚡</div>
            <h4 style="color: #fff; font-size: 1rem;">Arya Wicaksono</h4>
            <div style="color: #8a2be2; font-size: 0.8rem; margin-bottom: 0.4rem;">CTO & Co-Founder</div>
            <p style="font-size: 0.8rem; color: #94a3b8;">Ex-CDN Regional, Ahli WebRTC & Virtual GPU</p>
          </div>
          <div class="pitch-card-item" style="text-align: center;">
            <div style="font-size: 2.2rem; margin-bottom: 0.4rem;">🎯</div>
            <h4 style="color: #fff; font-size: 1rem;">Siti Nurhaliza</h4>
            <div style="color: #00ff9d; font-size: 0.8rem; margin-bottom: 0.4rem;">COO</div>
            <p style="font-size: 0.8rem; color: #94a3b8;">Ex-Head of Ops Esports, 200+ Event Nasional</p>
          </div>
        </div>
      `,
      notes: "Tunjukkan kredibilitas tim pendiri yang memiliki kecocokan latar belakang kuat (founder-market fit) untuk mengeksekusi visi OmniPlay."
    },
    {
      slideNumber: 8,
      title: "Permintaan Investasi: Seed Round $1.5M",
      subtitle: "Bergabung Bersama Kami Membangun Masa Depan Gaming Asia Tenggara",
      badge: "SLIDE 8 • THE ASK",
      content: `
        <div style="text-align: center; padding: 1.5rem 0;">
          <div style="font-size: 2.5rem; font-weight: 800; color: #00ff9d; margin-bottom: 0.5rem;">$1.500.000 USD</div>
          <div style="font-size: 1.1rem; color: #cbd5e1; margin-bottom: 1.5rem;">(Setara Rp 23,25 Miliar) • Runway 18 Bulan Menuju Break-Even</div>
          
          <div style="display: flex; gap: 1rem; max-width: 650px; margin: 0 auto; text-align: left;">
            <div style="flex: 1; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px; border-left: 3px solid #00f0ff;">
              <strong style="color: #fff; display: block; margin-bottom: 0.2rem;">42% Cloud & R&D</strong>
              <span style="font-size: 0.85rem; color: #94a3b8;">Infrastruktur GPU edge & optimasi latency WebRTC.</span>
            </div>
            <div style="flex: 1; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px; border-left: 3px solid #8a2be2;">
              <strong style="color: #fff; display: block; margin-bottom: 0.2rem;">30% Rekayasa & Tim</strong>
              <span style="font-size: 0.85rem; color: #94a3b8;">Talenta senior cloud & pengembangan antarmuka.</span>
            </div>
            <div style="flex: 1; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px; border-left: 3px solid #00ff9d;">
              <strong style="color: #fff; display: block; margin-bottom: 0.2rem;">28% Marketing & Lisensi</strong>
              <span style="font-size: 0.85rem; color: #94a3b8;">Akuisisi pengguna dan royalti katalog game indie.</span>
            </div>
          </div>

          <div style="margin-top: 2rem;">
            <button class="btn btn-pitch" style="padding: 0.8rem 2rem; font-size: 1rem;" onclick="alert('Terima kasih atas ketertarikan Anda! Tim investor relations kami dapat dihubungi melalui invest@omniplay.gg')">
              🤝 Jadwalkan Diskusi Lanjutan (invest@omniplay.gg)
            </button>
          </div>
        </div>
      `,
      notes: "Tutup presentasi dengan ajakan jelas. Nyatakan kesiapan mendemokan prototype game dan sistem cloud edge secara langsung kepada komite investasi."
    }
  ],

  // Tema Warna Platform OMNIPLAY
  themes: [
    { id: "neon", name: "Cyber Neon", primary: "#00f0ff", secondary: "#8a2be2", accent: "#00ff9d" },
    { id: "crimson", name: "Crimson GTA", primary: "#ff1e56", secondary: "#ffaa00", accent: "#00f0ff" },
    { id: "emerald", name: "Matrix Emerald", primary: "#00ff88", secondary: "#00b4d8", accent: "#f59e0b" },
    { id: "sapphire", name: "Royal Sapphire", primary: "#3b82f6", secondary: "#9333ea", accent: "#06b6d4" }
  ],

  // Katalog Game AAA & Cloud Computing
  aaaGames: [
    {
      id: "gta5",
      title: "Grand Theft Auto V",
      edition: "Los Santos Cloud Enhanced Edition",
      publisher: "Rockstar Games",
      category: "openworld",
      badge: "CLOUD VERIFIED",
      rating: "4.9 ★",
      players: "1.4M Cloud Active",
      icon: "🚗",
      bgGradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.35), rgba(245, 158, 11, 0.25))",
      description: "Jelajahi Los Santos dan Blaine County dalam resolusi 4K 60FPS dengan latensi ultra-rendah 12ms. Nikmati aksi balapan liar, kejar-kejaran polisi bintang 5, dan stasiun radio legendaris tanpa download 110 GB!",
      specs: {
        resolution: "4K UHD / 1080p 60FPS",
        latency: "12 ms (Node JKT-01)",
        storageNeeded: "0 GB (Stream)",
        rigProfile: "RTX 4090 Cloud Rig"
      },
      tags: ["Open World", "Action", "Ray Tracing", "Multiplayer"]
    },
    {
      id: "cyberpunk",
      title: "Cyberpunk 2077",
      edition: "Phantom Liberty (RTX Overdrive)",
      publisher: "CD PROJEKT RED",
      category: "action",
      badge: "RTX OVERDRIVE",
      rating: "4.8 ★",
      players: "890K Cloud Active",
      icon: "🦾",
      bgGradient: "linear-gradient(135deg, rgba(234, 179, 8, 0.35), rgba(0, 240, 255, 0.25))",
      description: "Night City dengan Full Path Tracing dan DLSS 3.5 Frame Generation. Mengubah ponsel kentang Rp 1 jutaan menjadi monster gaming dengan visual masa depan.",
      specs: {
        resolution: "1440p 60FPS Ultra",
        latency: "14 ms",
        storageNeeded: "0 GB (Stream)",
        rigProfile: "NVIDIA vGPU Cluster"
      },
      tags: ["Sci-Fi", "RPG", "Path Tracing", "Cyberpunk"]
    },
    {
      id: "wukong",
      title: "Black Myth: Wukong",
      edition: "Destined One Cloud Edition",
      publisher: "Game Science",
      category: "action",
      badge: "POPULAR IN ASIA",
      rating: "4.9 ★",
      players: "2.1M Cloud Active",
      icon: "🐒",
      bgGradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.35), rgba(180, 83, 9, 0.25))",
      description: "Rasakan aksi spektakuler Sang Kera Sakti berbasis Unreal Engine 5. Pertarungan boss epik dengan refleks secepat kilat berkat latensi streaming edge server Jakarta.",
      specs: {
        resolution: "1080p 60FPS Cinematic",
        latency: "13 ms",
        storageNeeded: "0 GB (Stream)",
        rigProfile: "RTX 4080 vGPU"
      },
      tags: ["Mythology", "Soulslike", "Unreal Engine 5", "Action"]
    },
    {
      id: "eldenring",
      title: "Elden Ring",
      edition: "Shadow of the Erdtree",
      publisher: "FromSoftware / Bandai Namco",
      category: "action",
      badge: "GOTY WINNER",
      rating: "4.9 ★",
      players: "1.2M Cloud Active",
      icon: "⚔️",
      bgGradient: "linear-gradient(135deg, rgba(217, 119, 6, 0.35), rgba(88, 28, 135, 0.25))",
      description: "Jelajahi Realm of Shadow dan Lands Between tanpa stuttering frame rate. Cloud streaming super responsif memastikan timing parry dan dodge Anda presisi.",
      specs: {
        resolution: "1440p 60FPS High",
        latency: "11 ms",
        storageNeeded: "0 GB (Stream)",
        rigProfile: "AMD ROCm Edge Rig"
      },
      tags: ["Dark Fantasy", "Open World", "Hardcore", "RPG"]
    },
    {
      id: "valorant",
      title: "Valorant",
      edition: "Esports Cloud Protocol",
      publisher: "Riot Games",
      category: "esports",
      badge: "128 TICK CLOUD",
      rating: "4.8 ★",
      players: "3.5M Cloud Active",
      icon: "🎯",
      bgGradient: "linear-gradient(135deg, rgba(244, 63, 94, 0.35), rgba(14, 165, 233, 0.25))",
      description: "Shooter taktis 5v5 dengan integrasi anticheat server-side OmniArena. Mainkan turnamen kompetitif resmi langsung dari browser tanpa perlu kartu grafis diskret.",
      specs: {
        resolution: "1080p 120FPS Low-Latency",
        latency: "< 9 ms",
        storageNeeded: "0 GB (Stream)",
        rigProfile: "Esports Dedicated Node"
      },
      tags: ["Tactical FPS", "Esports", "Ranked", "Competitive"]
    },
    {
      id: "forza",
      title: "Forza Horizon 5",
      edition: "Mexico Heat Cloud Apex",
      publisher: "Xbox Game Studios / Playground",
      category: "racing",
      badge: "HDR RACING",
      rating: "4.8 ★",
      players: "750K Cloud Active",
      icon: "🏎️",
      bgGradient: "linear-gradient(135deg, rgba(234, 88, 12, 0.35), rgba(236, 72, 153, 0.25))",
      description: "Balapan mobil impian di lanskap Meksiko yang memukau. Visual photorealistic HDR dengan respons kemudi gamepad nirkabel tanpa input lag yang terasa.",
      specs: {
        resolution: "4K 60FPS Ultra HDR",
        latency: "14 ms",
        storageNeeded: "0 GB (Stream)",
        rigProfile: "RTX 4080 Cloud Rig"
      },
      tags: ["Racing", "Open World", "Photorealistic", "Cars"]
    },
    {
      id: "cyberstrike",
      title: "Cyber Strike Arena",
      edition: "OmniPlay Native 60FPS Arcade",
      publisher: "OmniPlay Studios",
      category: "action",
      badge: "INSTANT PLAYABLE",
      rating: "5.0 ★",
      players: "Langsung di Browser",
      icon: "🚀",
      bgGradient: "linear-gradient(135deg, rgba(0, 240, 255, 0.35), rgba(138, 43, 226, 0.25))",
      description: "Game arcade tempur luar angkasa berlatensi 0ms dengan Web Audio API synthesizer, upgrade senjata laser ganda & plasma 3 arah, EMP shockwave, dan boss fights.",
      specs: {
        resolution: "60 FPS Native Canvas",
        latency: "0 ms (Instant)",
        storageNeeded: "0 MB",
        rigProfile: "Local Client / Edge Node"
      },
      tags: ["Arcade", "Action", "Synth Audio", "Instant Play"]
    }
  ]
};

