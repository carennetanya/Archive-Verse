// ============================================================================
//  Culture Verse — Data Budaya Jawa
//  Konten diriset dari sumber budaya (filosofi batik, watak wayang, dll).
//  Dipakai bersama oleh seluruh section landing page.
// ============================================================================

// ── PILAR 1 · BATIK ─────────────────────────────────────────────────────────
// Filosofi motif klasik Jawa. Sumber: tradisi Keraton Mataram/Surakarta.
export const batik = [
  {
    id: 'kawung',
    nama: 'Kawung',
    asal: 'Yogyakarta · Surakarta',
    tagline: 'Kemurnian hati & pengendalian diri',
    filosofi:
      'Pola empat lingkaran simetris menyerupai buah aren (kolang-kaling) ini ' +
      'melambangkan kesucian jiwa, pengendalian diri, dan keadilan. Dahulu hanya ' +
      'boleh dikenakan kalangan keraton. Susunannya yang seimbang mengingatkan ' +
      'manusia untuk menjaga harmoni antara lahir dan batin.',
    nilai: ['Kesucian', 'Pengendalian diri', 'Keseimbangan'],
  },
  {
    id: 'parang',
    nama: 'Parang',
    asal: 'Keraton Mataram',
    tagline: 'Keteguhan & semangat pantang menyerah',
    filosofi:
      'Berasal dari kata "pereng" (lereng/tebing), motif diagonal ini menggambarkan ' +
      'ombak yang tak henti menghantam karang — simbol perjuangan yang berkesinambungan ' +
      'dan keteguhan hati. Dahulu motif larangan yang hanya dikenakan raja dan ' +
      'bangsawan sebagai lambang kewibawaan.',
    nilai: ['Kekuatan', 'Keteguhan', 'Kesinambungan'],
  },
  {
    id: 'truntum',
    nama: 'Truntum',
    asal: 'Surakarta',
    tagline: 'Cinta yang tumbuh kembali',
    filosofi:
      'Diciptakan Kanjeng Ratu Kencana, permaisuri Pakubuwana III, sebagai ungkapan ' +
      'cinta yang setia. Nama "truntum" berarti tumbuh kembali — taburan bunga kecil ' +
      'bagai bintang melambangkan kasih yang terus bersemi. Dipakai orang tua mempelai ' +
      'untuk "menuntun" pasangan menuju kehidupan baru.',
    nilai: ['Cinta', 'Kesetiaan', 'Ketulusan'],
  },
  {
    id: 'sidomukti',
    nama: 'Sido Mukti',
    asal: 'Surakarta (Solo)',
    tagline: 'Doa kemakmuran & kemuliaan',
    filosofi:
      'Dari kata "sido" (terlaksana) dan "mukti" (mulia/makmur). Kain wajib dalam ' +
      'pernikahan adat Jawa, sering dihias kupu-kupu dan singgasana. Sebuah doa agar ' +
      'pemakainya menjalani hidup yang berkelanjutan dalam kemuliaan, kemakmuran, ' +
      'dan kebahagiaan yang langgeng.',
    nilai: ['Kemakmuran', 'Kemuliaan', 'Harapan'],
  },
]

// ── PILAR 2 · WAYANG ────────────────────────────────────────────────────────
// Tokoh wayang & watak/nilai hidup yang diwakilinya.
export const wayang = [
  {
    id: 'arjuna',
    nama: 'Arjuna',
    peran: 'Ksatria Pandawa',
    watak: 'Tenang, cerdas, dan teguh pada kebenaran',
    nilai:
      'Lambang ksatria sejati: berani namun rendah hati, tekun menempa diri lewat ' +
      'tapa dan ilmu. Mengajarkan bahwa kekuatan sejati lahir dari penguasaan diri, ' +
      'bukan amarah.',
  },
  {
    id: 'semar',
    nama: 'Semar',
    peran: 'Punakawan · penasihat',
    watak: 'Bijaksana, jenaka, merakyat',
    nilai:
      'Sosok paling dihormati dalam wayang: dewa yang menjelma rakyat jelata. ' +
      'Mengingatkan bahwa kebijaksanaan dan kerendahan hati lebih tinggi dari ' +
      'kekuasaan, dan pemimpin sejati mengabdi pada rakyat.',
  },
  {
    id: 'bima',
    nama: 'Bima',
    peran: 'Ksatria Pandawa',
    watak: 'Jujur, gagah, teguh pendirian',
    nilai:
      'Berbicara apa adanya tanpa basa-basi, setia pada prinsip, dan tak gentar pada ' +
      'kebenaran. Lambang keberanian moral — berani membela yang benar walau sendirian.',
  },
  {
    id: 'srikandi',
    nama: 'Srikandi',
    peran: 'Ksatria wanita',
    watak: 'Pemberani, mandiri, ahli memanah',
    nilai:
      'Perempuan tangguh yang setara di medan laga. Simbol keberanian dan kesetaraan — ' +
      'bahwa keteguhan dan kepemimpinan tak mengenal batas gender.',
  },
]

// ── PILAR 3 · KULINER ───────────────────────────────────────────────────────
// Kuliner khas dengan asal daerah & cerita rasa.
export const kuliner = [
  {
    id: 'gudeg',
    nama: 'Gudeg',
    daerah: 'Yogyakarta',
    rasa: 'Manis legit',
    cerita:
      'Nangka muda yang dimasak berjam-jam dengan santan dan gula aren. Rasa manisnya ' +
      'mencerminkan watak masyarakat Yogya yang halus dan sabar — kesabaran dalam ' +
      'memasak jadi filosofi hidup.',
  },
  {
    id: 'rawon',
    nama: 'Rawon',
    daerah: 'Jawa Timur',
    rasa: 'Gurih dalam',
    cerita:
      'Sup daging berkuah hitam pekat dari kluwek. Warna gelapnya yang khas justru ' +
      'menyimpan rasa gurih kaya rempah — bukti bahwa yang sederhana bisa menyimpan ' +
      'kedalaman luar biasa.',
  },
  {
    id: 'pecel',
    nama: 'Pecel',
    daerah: 'Jawa Tengah · Timur',
    rasa: 'Pedas segar',
    cerita:
      'Aneka sayuran rebus disiram sambal kacang. Perpaduan banyak sayur dalam satu ' +
      'piring melambangkan kebersamaan dan keberagaman yang menyatu dalam harmoni rasa.',
  },
  {
    id: 'serabi',
    nama: 'Serabi',
    daerah: 'Solo',
    rasa: 'Manis lembut',
    cerita:
      'Kue tradisional dari tepung beras dan santan, dimasak di tungku tanah liat. ' +
      'Aromanya membawa nostalgia pasar pagi — warisan jajanan yang bertahan lintas ' +
      'generasi.',
  },
]

// ── PILAR 4 · AKSARA ────────────────────────────────────────────────────────
// 20 aksara dasar Hanacaraka (Aksara Nglegena) + makna legendanya.
export const aksaraDasar = [
  { latin: 'ha', jawa: 'ꦲ' }, { latin: 'na', jawa: 'ꦤ' },
  { latin: 'ca', jawa: 'ꦕ' }, { latin: 'ra', jawa: 'ꦫ' },
  { latin: 'ka', jawa: 'ꦏ' }, { latin: 'da', jawa: 'ꦢ' },
  { latin: 'ta', jawa: 'ꦠ' }, { latin: 'sa', jawa: 'ꦱ' },
  { latin: 'wa', jawa: 'ꦮ' }, { latin: 'la', jawa: 'ꦭ' },
  { latin: 'pa', jawa: 'ꦥ' }, { latin: 'dha', jawa: 'ꦝ' },
  { latin: 'ja', jawa: 'ꦗ' }, { latin: 'ya', jawa: 'ꦪ' },
  { latin: 'nya', jawa: 'ꦚ' }, { latin: 'ma', jawa: 'ꦩ' },
  { latin: 'ga', jawa: 'ꦒ' }, { latin: 'ba', jawa: 'ꦧ' },
  { latin: 'tha', jawa: 'ꦛ' }, { latin: 'nga', jawa: 'ꦔ' },
]

// Legenda Hanacaraka — kisah Aji Saka di balik 20 aksara.
export const aksaraLegenda = {
  bait: [
    { teks: 'ꦲꦤꦕꦫꦏ', latin: 'Hana caraka', arti: 'Ada dua utusan' },
    { teks: 'ꦢꦠꦱꦮꦭ', latin: 'Data sawala', arti: 'Yang saling berselisih' },
    { teks: 'ꦥꦝꦗꦪꦚ', latin: 'Padha jayanya', arti: 'Sama-sama saktinya' },
    { teks: 'ꦩꦒꦧꦛꦔ', latin: 'Maga bathanga', arti: 'Keduanya gugur menjadi jasad' },
  ],
  makna:
    'Dua puluh aksara Jawa bukan sekadar huruf — ia menyimpan kisah Aji Saka tentang ' +
    'kesetiaan dua abdi yang gugur karena sama-sama memegang teguh perintah. Sebuah ' +
    'pelajaran tentang kesetiaan, ketaatan, dan tragisnya kesalahpahaman.',
}

// ── META & SDG ──────────────────────────────────────────────────────────────
export const meta = {
  judul: 'Pusaka Nusantara',
  sub: 'Culture Verse',
  tema: 'Melestarikan Warisan Lewat Desain',
  sdg:
    'Sejalan dengan SDG 11 — Kota dan Permukiman Berkelanjutan, yang mengajak kita ' +
    'melindungi dan menjaga warisan budaya dunia. Setiap motif, tokoh, rasa, dan ' +
    'aksara adalah memori kolektif yang layak diwariskan ke generasi mendatang.',
}

export const pilar = [
  { id: 'batik',   nama: 'Batik',   aksara: 'ꦧꦠꦶꦏ꧀',   ket: 'Filosofi di balik motif' },
  { id: 'wayang',  nama: 'Wayang',  aksara: 'ꦮꦪꦁ',     ket: 'Tokoh & nilai kehidupan' },
  { id: 'kuliner', nama: 'Kuliner', aksara: 'ꦏꦸꦭꦶꦤꦺꯒ', ket: 'Cerita di balik rasa' },
  { id: 'aksara',  nama: 'Aksara',  aksara: 'ꦲꦏ꧀ꦱꦫ',  ket: 'Tulis namamu sendiri' },
]