/* =========================================================
   evilzeda — retro handheld RPG personal site
   Town map, dialog, menus, battles and content panels.
   ========================================================= */
(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
};

/* ---------------------------------------------------------
   Translations (original site text + game text)
   --------------------------------------------------------- */
const translations = {
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_skills: "Skills",
    nav_works: "Works",
    nav_contact: "Contact",
    home_hello: "Hello, I am",
    home_name: "Ibrahim Atthariq",
    home_desc:
      "a person who crafting data, systems, and insights with simplicity and precision.",
    about_heading: "About <span>Me</span>",
    about_role: "Analytics Engineer & Developer",
    about_desc:
      "I am Ibrahim Atthariq. Transitioning from the calculating nature phenomenon using laws of physics to the building logic of computer science, I find joy in understanding how things work. I am passionate about understanding the internal mechanisms of systems, particularly in distributed systems, data warehousing, and machine learning. I also enjoy exploring other domains, such as applied finance and economics.",
    about_cv: "Download CV",
    skills_heading: "My <span>Skills</span>",
    skill_1_title: "Data Architect & Pipeline",
    skill_1_desc:
      "Architecting robust flows to transform raw chaotic data into structured, usable assets.",
    skill_2_title: "Analysis",
    skill_2_desc:
      "Uncovering patterns and trends to drive informed decision-making.",
    skill_3_title: "Visualization",
    skill_3_desc: "Translating complex datasets into intuitive visual stories.",
    works_heading: "Selected <span>Works</span>",
    work_px_title: "physcx",
    work_px_desc: "Interactive 3D physics simulations, built on the Feynman Lectures.",
    work_1_title: "Data Collection",
    work_1_desc: "Automated scraping & ingestion.",
    work_2_title: "Data Cleansing",
    work_2_desc: "Ensuring data integrity.",
    work_3_title: "Analysis",
    work_3_desc: "Statistical modeling.",
    work_4_title: "Visualization",
    work_4_desc: "Dashboard creation.",
    contact_heading: "Contact <span>Me</span>",
    contact_btn: "Send Message",

    title_sub: "DATA EDITION",
    title_press: "PRESS START",
    hint_move: "Arrows / D-pad to walk · A to talk · START for menu",
    keys_help: "Move: Arrows/WASD · A: Z/Space · B: X/Esc · START: Enter · SELECT: Shift (day/night) · Tip: click a building to enter",
    intro_3: "Welcome to EVILZEDA TOWN! Every building here holds a piece of my story.",
    intro_4: "Walk with the arrow keys or D-pad, press A to read signs, and START for the menu. Careful, wild bugs lurk in the tall grass!",
    sign_town: "EVILZEDA TOWN: where raw, chaotic data becomes insight.",
    sign_home: "HOME: Come in and say hello. My socials are inside.",
    sign_mail: "MAIL: Drop me a message anytime!",
    sign_lab: "LAB: Trainer card, background and CV.",
    sign_gym: "GYM: Train with my skills.",
    sign_works: "WORKS: A gallery of selected projects.",
    npc_1: "Hey! Wild bugs like NULL VALUE and DIRTY DATA hide in the tall grass.",
    npc_2: "Squash them with THARIQ's skills: pipelines, analysis and visualization!",
    water_text: "The pond is perfectly still, as clean as a well-modeled table.",
    lbl_home: "HOME", lbl_mail: "MAIL", lbl_lab: "LAB", lbl_gym: "GYM", lbl_works: "WORKS",
    menu_options: "Options", menu_exit: "Exit",
    opt_lang: "Language", opt_time: "Day / Night", opt_sound: "Sound", opt_back: "Back",
    ui_close: "Close", ui_on: "ON", ui_off: "OFF",
    home_social: "Find me around the web",
    card_title: "TRAINER CARD", card_name: "NAME", card_role: "ROLE", card_type: "TYPE", card_badges: "BADGES",
    skills_tip: "Tip: these skills double as battle moves. Try them on wild bugs in the tall grass!",
    type_data: "DATA", type_logic: "LOGIC", type_art: "ART",
    works_reg: "REGISTERED", works_view: "View",
    contact_text: "Want to trade ideas or team up on a new quest? My mailbox is always open.",
    b_appear: "A wild {x} appeared!",
    b_what: "What will {p} do?",
    b_fight: "FIGHT", b_info: "INFO", b_run: "RUN", b_back: "BACK",
    b_used: "{p} used {m}!",
    b_super: "It's super effective!",
    b_crit: "A critical hit!",
    b_win: "The wild {x} was cleaned up!",
    b_gain: "Data quality rose by {n}%!",
    b_enemy_used: "The wild {x} used {m}!",
    b_lose: "THARIQ ran out of coffee... Recharged and back on track!",
    b_run_ok: "Got away safely!",
    en_desc_0: "It hides in empty cells and breaks every JOIN.",
    en_desc_1: "Covered in typos, duplicates and mixed date formats.",
    en_desc_2: "Scans the full table every time. Every. Single. Time.",
    en_desc_3: "Appears whenever two branches disagree.",
    en_desc_4: "Grows quietly until everything crashes."
  },
  id: {
    nav_home: "Beranda",
    nav_about: "Tentang",
    nav_skills: "Keahlian",
    nav_works: "Karya",
    nav_contact: "Kontak",
    home_hello: "Halo, saya",
    home_name: "Ibrahim Atthariq",
    home_desc:
      "Seseorang yang merancang data, sistem, dan wawasan dengan kesederhanaan dan ketelitian.",
    about_heading: "Tentang <span>Saya</span>",
    about_role: "Insinyur & Pengembang Analitik",
    about_desc:
      "Saya Ibrahim Atthariq. Beralih dari menghitung fenomena alam menggunakan hukum fisika ke membangun logika ilmu komputer, saya menemukan kegemaran dalam memahami cara kerja sesuatu. Saya memiliki hasrat untuk memahami mekanisme internal dari sistem, terutama dalam sistem terdistribusi, gudang data, dan pembelajaran mesin. Saya juga senang mengeksplorasi bidang lain, seperti keuangan terapan dan ekonomi.",
    about_cv: "Unduh CV",
    skills_heading: "Keahlian <span>Saya</span>",
    skill_1_title: "Arsitek Data & Alur Data",
    skill_1_desc:
      "Merancang aliran data yang kuat untuk mengubah data mentah menjadi aset yang terstruktur dan berguna.",
    skill_2_title: "Analisis",
    skill_2_desc:
      "Menemukan pola dan tren untuk mendorong pengambilan keputusan yang tepat.",
    skill_3_title: "Visualisasi",
    skill_3_desc:
      "Menerjemahkan kumpulan data kompleks menjadi cerita visual yang intuitif.",
    works_heading: "Karya <span>Pilihan</span>",
    work_px_title: "physcx",
    work_px_desc: "Simulasi fisika 3D interaktif, berdasarkan Feynman Lectures.",
    work_1_title: "Pengumpulan Data",
    work_1_desc: "Scraping & ingestin data otomatis.",
    work_2_title: "Pembersihan Data",
    work_2_desc: "Menjamin integritas data.",
    work_3_title: "Analisis",
    work_3_desc: "Pemodelan statistik.",
    work_4_title: "Visualisasi",
    work_4_desc: "Pembuatan dashboard.",
    contact_heading: "Kontak <span>Saya</span>",
    contact_btn: "Kirim Pesan",

    title_sub: "EDISI DATA",
    title_press: "TEKAN START",
    hint_move: "Panah / D-pad untuk jalan · A untuk bicara · START untuk menu",
    keys_help: "Gerak: Panah/WASD · A: Z/Spasi · B: X/Esc · START: Enter · SELECT: Shift (siang/malam) · Tips: klik bangunan untuk masuk",
    intro_3: "Selamat datang di KOTA EVILZEDA! Setiap bangunan di sini menyimpan sepotong cerita saya.",
    intro_4: "Berjalanlah dengan tombol panah atau D-pad, tekan A untuk membaca papan, dan START untuk menu. Hati-hati, bug liar bersembunyi di rumput tinggi!",
    sign_town: "KOTA EVILZEDA: tempat data mentah yang kacau menjadi wawasan.",
    sign_home: "RUMAH: Mampir dan sapa saya. Media sosial saya ada di dalam.",
    sign_mail: "POS: Kirimi saya pesan kapan saja!",
    sign_lab: "LAB: Kartu trainer, latar belakang, dan CV.",
    sign_gym: "GYM: Berlatih dengan keahlian saya.",
    sign_works: "KARYA: Galeri proyek pilihan.",
    npc_1: "Hai! Bug liar seperti NULL VALUE dan DIRTY DATA bersembunyi di rumput tinggi.",
    npc_2: "Kalahkan mereka dengan keahlian THARIQ: pipeline, analisis, dan visualisasi!",
    water_text: "Kolamnya tenang sekali, sebersih tabel yang dimodelkan dengan baik.",
    lbl_home: "RUMAH", lbl_mail: "POS", lbl_lab: "LAB", lbl_gym: "GYM", lbl_works: "KARYA",
    menu_options: "Opsi", menu_exit: "Keluar",
    opt_lang: "Bahasa", opt_time: "Siang / Malam", opt_sound: "Suara", opt_back: "Kembali",
    ui_close: "Tutup", ui_on: "NYALA", ui_off: "MATI",
    home_social: "Temukan saya di internet",
    card_title: "KARTU TRAINER", card_name: "NAMA", card_role: "PERAN", card_type: "TIPE", card_badges: "LENCANA",
    skills_tip: "Tips: keahlian ini juga jurus bertarung. Coba lawan bug liar di rumput tinggi!",
    type_data: "DATA", type_logic: "LOGIKA", type_art: "SENI",
    works_reg: "TERDAFTAR", works_view: "Lihat",
    contact_text: "Ingin bertukar ide atau berpetualang bersama? Kotak surat saya selalu terbuka.",
    b_appear: "{x} liar muncul!",
    b_what: "Apa yang akan {p} lakukan?",
    b_fight: "SERANG", b_info: "INFO", b_run: "KABUR", b_back: "KEMBALI",
    b_used: "{p} menggunakan {m}!",
    b_super: "Sangat efektif!",
    b_crit: "Serangan kritis!",
    b_win: "{x} liar berhasil dibersihkan!",
    b_gain: "Kualitas data naik {n}%!",
    b_enemy_used: "{x} liar menggunakan {m}!",
    b_lose: "THARIQ kehabisan kopi... Sudah isi ulang dan siap lagi!",
    b_run_ok: "Berhasil kabur dengan aman!",
    en_desc_0: "Bersembunyi di sel kosong dan merusak setiap JOIN.",
    en_desc_1: "Penuh salah ketik, duplikat, dan format tanggal campur aduk.",
    en_desc_2: "Memindai seluruh tabel setiap saat. Setiap. Saat.",
    en_desc_3: "Muncul setiap kali dua branch tidak sepakat.",
    en_desc_4: "Tumbuh diam-diam sampai semuanya crash."
  },
  jp: {
    nav_home: "ホーム",
    nav_about: "自己紹介",
    nav_skills: "スキル",
    nav_works: "作品",
    nav_contact: "コンタクト",
    home_hello: "こんにちは、私は",
    home_name: "イブラヒム・アッタリク",
    home_desc: "データ、システム、洞察をシンプルかつ正確に作成する人。",
    about_heading: "自己 <span>紹介</span>",
    about_role: "アナリティクスエンジニア",
    about_desc:
      "私はイブラヒム・アッタリクです。自然現象を物理法則で計算することから、コンピュータサイエンスの論理を構築することに移る中で、ものの仕組みを理解することに喜びを見出しました。私は特に分散システム、データウェアハウス、機械学習の内部メカニズムを理解することに情熱を持っています。また、応用金融や経済学などの他の分野を探求することも楽しんでいます。",
    about_cv: "CVをダウンロード",
    skills_heading: "私の <span>スキル</span>",
    skill_1_title: "データアーキテクト＆パイプライン",
    skill_1_desc:
      "混沌とした生データを構造化された有用な資産に変えるための堅牢なフローを設計します。",
    skill_2_title: "分析",
    skill_2_desc:
      "パターンやトレンドを発見し、情報に基づいた意思決定を促進します。",
    skill_3_title: "可視化",
    skill_3_desc:
      "複雑なデータセットを直感的なビジュアルストーリーに変換します。",
    works_heading: "主要な <span>作品</span>",
    work_px_title: "physcx",
    work_px_desc: "ファインマン物理学に基づくインタラクティブな3D物理シミュレーション。",
    work_1_title: "データ収集",
    work_1_desc: "自動化されたスクレイピングと取り込み。",
    work_2_title: "データクレンジング",
    work_2_desc: "データの整合性を確保します。",
    work_3_title: "分析",
    work_3_desc: "統計モデリング。",
    work_4_title: "可視化",
    work_4_desc: "ダッシュボード作成。",
    contact_heading: "コンタクト <span>私</span>",
    contact_btn: "メッセージを送る",

    title_sub: "データ・エディション",
    title_press: "PRESS START",
    hint_move: "矢印 / 十字キーで移動 · Aで話す · STARTでメニュー",
    keys_help: "移動：矢印/WASD · A：Z/スペース · B：X/Esc · START：Enter · SELECT：Shift（昼/夜）· ヒント：建物をクリックして入る",
    intro_3: "エビルゼダ・タウンへようこそ！ここにある建物には、それぞれ私のストーリーが詰まっています。",
    intro_4: "矢印キーか十字キーで歩き、Aで看板を読み、STARTでメニューを開こう。草むらの野生のバグに気をつけて！",
    sign_town: "エビルゼダ・タウン：混沌とした生データがインサイトに変わる町。",
    sign_home: "いえ：あいさつはこちら。SNSのリンクもあるよ。",
    sign_mail: "ポスト：いつでもメッセージをどうぞ！",
    sign_lab: "ラボ：トレーナーカード、経歴、CV。",
    sign_gym: "ジム：わたしのスキルを見てみよう。",
    sign_works: "さくひん：これまでの作品を展示中。",
    npc_1: "やあ！草むらにはNULL VALUEやDIRTY DATAみたいな野生のバグがひそんでいるよ。",
    npc_2: "パイプライン、分析、可視化。THARIQのスキルでやっつけよう！",
    water_text: "静かな水面。きれいにモデリングされたテーブルのように澄んでいる。",
    lbl_home: "いえ", lbl_mail: "ポスト", lbl_lab: "ラボ", lbl_gym: "ジム", lbl_works: "さくひん",
    menu_options: "せってい", menu_exit: "とじる",
    opt_lang: "げんご", opt_time: "ひる / よる", opt_sound: "サウンド", opt_back: "もどる",
    ui_close: "とじる", ui_on: "オン", ui_off: "オフ",
    home_social: "SNSはこちら",
    card_title: "トレーナーカード", card_name: "なまえ", card_role: "しょくぎょう", card_type: "タイプ", card_badges: "バッジ",
    skills_tip: "ヒント：これらのスキルはバトルのわざにもなります。草むらの野生のバグに試してみよう！",
    type_data: "データ", type_logic: "ロジック", type_art: "アート",
    works_reg: "とうろくずみ", works_view: "見る",
    contact_text: "アイデアを交換したり、一緒に新しい冒険に出たりしませんか？メールはいつでも大歓迎です。",
    b_appear: "野生の {x} が あらわれた！",
    b_what: "{p} は どうする？",
    b_fight: "たたかう", b_info: "しらべる", b_run: "にげる", b_back: "もどる",
    b_used: "{p} の {m}！",
    b_super: "こうかは バツグンだ！",
    b_crit: "クリティカルヒット！",
    b_win: "野生の {x} を クリーンにした！",
    b_gain: "データ品質が {n}% あがった！",
    b_enemy_used: "野生の {x} の {m}！",
    b_lose: "THARIQ は コーヒー切れ… 充電して ふっかつした！",
    b_run_ok: "うまく にげきれた！",
    en_desc_0: "空のセルに隠れて、すべてのJOINを壊す。",
    en_desc_1: "タイプミス、重複、バラバラな日付形式だらけ。",
    en_desc_2: "毎回フルスキャン。毎回、毎回。",
    en_desc_3: "2つのブランチの意見が食い違うと現れる。",
    en_desc_4: "静かに大きくなり、やがて全てをクラッシュさせる。"
  }
};

let lang = 'en';
function t(key, vars) {
    let s = (translations[lang] && translations[lang][key]) ?? translations.en[key] ?? key;
    if (vars) for (const [a, b] of Object.entries(vars)) s = s.split('{' + a + '}').join(b);
    return s;
}
const plain = (s) => String(s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------------------------------------------------------
   Sound (tiny square-wave blips)
   --------------------------------------------------------- */
let soundOn = store.get('sound') !== 'off';
let actx = null;
function blip(freq = 660, dur = 0.05, type = 'square', vol = 0.03) {
    if (!soundOn) return;
    try {
        actx = actx || new (window.AudioContext || window.webkitAudioContext)();
        if (actx.state === 'suspended') actx.resume();
        const o = actx.createOscillator(), gn = actx.createGain();
        o.type = type; o.frequency.value = freq;
        gn.gain.setValueAtTime(vol, actx.currentTime);
        gn.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
        o.connect(gn).connect(actx.destination);
        o.start(); o.stop(actx.currentTime + dur + 0.02);
    } catch (e) { /* audio unavailable */ }
}

/* ---------------------------------------------------------
   Pixel sprites (original art, 16x16)
   --------------------------------------------------------- */
const SPR = {
    down: [
        '................',
        '.....kkkkkk.....',
        '....khhhhhhk....',
        '...khhhhhhhhk...',
        '...khhhhhhhhk...',
        '...khsssssshk...',
        '...ksessssesk...',
        '...kssssssssk...',
        '....kssmmssk....',
        '...kbbkkkkbbk...',
        '..kbbbbwwbbbbk..',
        '..ksbbbbbbbbsk..',
        '...kBBBBBBBBk...',
        '....kppkkppk....',
        '....kpk..kpk....',
        '...kook..kook...'
    ],
    up: [
        '................',
        '.....kkkkkk.....',
        '....khhhhhhk....',
        '...khhhhhhhhk...',
        '...khhhhhhhhk...',
        '...khhhhhhhhk...',
        '...khhhhhhhhk...',
        '...kshhhhhhsk...',
        '....kssssssk....',
        '...kbbbbbbbbk...',
        '..kbbBBBBBBbbk..',
        '..ksbbbbbbbbsk..',
        '...kBBBBBBBBk...',
        '....kppkkppk....',
        '....kpk..kpk....',
        '...kook..kook...'
    ],
    right: [
        '................',
        '.....kkkkk......',
        '....khhhhhk.....',
        '...khhhhhhhk....',
        '...khhhhhhhhk...',
        '...khhhhsssk....',
        '...khhhssesk....',
        '...khhsssssk....',
        '....kkssmsk.....',
        '....kbbbbbk.....',
        '...kbbbbbbbk....',
        '...kbbbsbbbk....',
        '...kBBBBBBBk....',
        '....kppppk......',
        '....kpkkpk......',
        '....kokkok......'
    ]
};
SPR.downWalk = SPR.down.slice(0, 14).concat(['...kpk....kpk...', '...kok....kok...']);
SPR.upWalk = SPR.up.slice(0, 14).concat(['...kpk....kpk...', '...kok....kok...']);
SPR.rightWalk = SPR.right.slice(0, 14).concat(['...kpk..kpk.....', '..kook..kook....']);

const MON = {
    bug: [
        '...k........k...',
        '....k......k....',
        '.....kkkkkk.....',
        '....kcccccck....',
        '...kcwkccwkck...',
        '...kcwkccwkck...',
        '..kcccccccccck..',
        '..kccckkkkccck..',
        '.kdccccccccccdk.',
        '.kddccccccccddk.',
        'kd.kddddddddk.dk',
        'k..kddddddddk..k',
        '...kdddddddk....',
        '....kkkkkkk.....',
        '...k.k...k.k....',
        '................'
    ],
    ghost: [
        '................',
        '.....kkkkkk.....',
        '....kwwwwwwk....',
        '...kwwwwwwwwk...',
        '..kwwkwwwwkwwk..',
        '..kwwkwwwwkwwk..',
        '..kwwwwwwwwwwk..',
        '..kwwwwkkwwwwk..',
        '..kwwwwkkwwwwk..',
        '.kcwwwwwwwwwwck.',
        '.kcwwwwwwwwwwck.',
        '..kwwwwwwwwwwk..',
        '..kwwwwwwwwwwk..',
        '..kwwkwwwkwwwk..',
        '..kwk.kwk.kwk...',
        '...k...k...k....'
    ]
};

const PAL_PLAYER = { k: '#1b1b2f', h: '#3b2a20', s: '#f2c79b', e: '#1b1b2f', m: '#c9735a', b: '#2bb3a3', B: '#1d7f74', w: '#ffffff', p: '#34405a', o: '#c0392b' };
const PAL_NPC = Object.assign({}, PAL_PLAYER, { h: '#c96f2d', b: '#8e5cc2', B: '#64408a', o: '#2a2a3a' });

function drawRows(ctx, rows, pal, x, y, flip = false, scale = 1) {
    for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        for (let c = 0; c < row.length; c++) {
            const ch = row[c];
            if (ch === '.' || !pal[ch]) continue;
            ctx.fillStyle = pal[ch];
            const cx = flip ? (row.length - 1 - c) : c;
            ctx.fillRect(x + cx * scale, y + r * scale, scale, scale);
        }
    }
}
function spriteURL(rows, pal, scale = 8, flip = false) {
    const c = document.createElement('canvas');
    c.width = 16 * scale; c.height = rows.length * scale;
    drawRows(c.getContext('2d'), rows, pal, 0, 0, flip, scale);
    return c.toDataURL();
}

/* ---------------------------------------------------------
   Town map
   T tree  . grass  , tall grass  = path  ~ water  * flowers
   --------------------------------------------------------- */
const MAP = [
    'TTTTTTTTTTTTTTTTTTTT',
    'T*..............*..T',
    'T..................T',
    'T..................T',
    'T..................T',
    'T.================.T',
    'T,,,,..=..~~~~...*.T',
    'T,,,,,.=..~~~~..,,,T',
    'T,,,,..=..~~~~..,,,T',
    'T......=...........T',
    'T......=...........T',
    'T......=...........T',
    'T.================.T',
    'T*..,,,,,,,,,,,,..*T',
    'TTTTTTTTTTTTTTTTTTTT'
];
const COLS = 20, ROWS = 15, TS = 16;

const BUILDINGS = [
    { id: 'home',  panel: 'home',      x: 2,  y: 2, w: 4, h: 3, roof: '#d65a5a', label: 'lbl_home' },
    { id: 'mail',  panel: 'contact',   x: 8,  y: 2, w: 4, h: 3, roof: '#f2a541', label: 'lbl_mail' },
    { id: 'lab',   panel: 'about',     x: 14, y: 2, w: 4, h: 3, roof: '#4f7cc2', label: 'lbl_lab' },
    { id: 'gym',   panel: 'services',  x: 2,  y: 9, w: 5, h: 3, roof: '#2a9d8f', label: 'lbl_gym' },
    { id: 'works', panel: 'portfolio', x: 13, y: 9, w: 5, h: 3, roof: '#8e5cc2', label: 'lbl_works' }
];
BUILDINGS.forEach((b) => { b.door = { x: b.x + 2, y: b.y + b.h - 1 }; });

const SIGNS = [
    { x: 9, y: 6, key: 'sign_town' },
    { x: 6, y: 4, key: 'sign_home' },
    { x: 12, y: 4, key: 'sign_mail' },
    { x: 18, y: 4, key: 'sign_lab' },
    { x: 1, y: 11, key: 'sign_gym' },
    { x: 12, y: 11, key: 'sign_works' }
];

const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

const player = { x: 4, y: 5, tx: 4, ty: 5, t: 0, moving: false, dir: 'down', step: 0, hp: 100, emote: false };
const npc = { x: 15, y: 7, dir: 'left', step: 0 };
let stepsSinceBattle = 0;

const buildingAt = (x, y) => BUILDINGS.find((b) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h);
const signAt = (x, y) => SIGNS.find((s) => s.x === x && s.y === y);
const tileAt = (x, y) => (MAP[y] && MAP[y][x]) || 'T';

function isSolid(x, y) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return true;
    const c = tileAt(x, y);
    if (c === 'T' || c === '~') return true;
    if (buildingAt(x, y) || signAt(x, y)) return true;
    if (npc.x === x && npc.y === y) return true;
    return false;
}

/* --- tile painting --- */
function hash(x, y, n) {
    let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(n, 1442695041)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const f = (v) => Math.max(0, Math.min(255, Math.round(v + (amt > 0 ? (255 - v) * amt : v * amt))));
    const r = f(n >> 16), gg = f((n >> 8) & 255), b = f(n & 255);
    return '#' + ((1 << 24) | (r << 16) | (gg << 8) | b).toString(16).slice(1);
}

function paintTile(g, ch, tx, ty, f) {
    const X = tx * TS, Y = ty * TS;
    const P = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(X + x, Y + y, w, h); };
    const grass = () => {
        P(0, 0, 16, 16, '#7ccf6a');
        for (let i = 0; i < 6; i++) P(Math.floor(hash(tx, ty, i) * 15), Math.floor(hash(tx, ty, i + 9) * 14), 1, 2, '#5db55a');
        for (let i = 0; i < 3; i++) P(Math.floor(hash(tx, ty, i + 20) * 15), Math.floor(hash(tx, ty, i + 30) * 15), 1, 1, '#a5e28f');
    };
    switch (ch) {
        case '.': grass(); break;
        case '=': {
            P(0, 0, 16, 16, '#e9d7a3');
            for (let i = 0; i < 7; i++) P(Math.floor(hash(tx, ty, i + 40) * 15), Math.floor(hash(tx, ty, i + 50) * 15), 1, 1, i % 2 ? '#d6c08a' : '#f6e9c4');
            if (tileAt(tx, ty - 1) !== '=') P(0, 0, 16, 1, '#c9b27a');
            if (tileAt(tx, ty + 1) !== '=') P(0, 15, 16, 1, '#c9b27a');
            if (tileAt(tx - 1, ty) !== '=') P(0, 0, 1, 16, '#c9b27a');
            if (tileAt(tx + 1, ty) !== '=') P(15, 0, 1, 16, '#c9b27a');
            break;
        }
        case ',': {
            P(0, 0, 16, 16, '#4fa556');
            [[1, 2], [9, 1], [4, 9], [11, 9]].forEach(([ax, ay], i) => {
                const sw = (f + i) % 2;
                P(ax, ay + 3, 1, 4, '#2f7d3e');
                P(ax + 1, ay + 1, 1, 6, '#3b9148');
                P(ax + 2, ay + 2, 1, 5, '#2f7d3e');
                P(ax + 3, ay + 1, 1, 6, '#3b9148');
                P(ax + 4, ay + 3, 1, 4, '#2f7d3e');
                P(ax + 1 + sw, ay, 1, 1, '#8fdc78');
                P(ax + 3 + sw, ay, 1, 1, '#8fdc78');
            });
            break;
        }
        case '~': {
            P(0, 0, 16, 16, '#4aa3df');
            for (const r of [4, 10]) {
                for (let x = 0; x < 16; x++) if (((x + f * 3 + r) % 8) < 3) P(x, r + (x % 8 < 2 ? 0 : 1), 1, 1, '#a6dcf6');
            }
            if (tileAt(tx, ty - 1) !== '~') P(0, 0, 16, 2, '#c8eefc');
            if (tileAt(tx, ty + 1) !== '~') P(0, 14, 16, 2, '#3586bd');
            if (tileAt(tx - 1, ty) !== '~') P(0, 0, 2, 16, '#c8eefc');
            if (tileAt(tx + 1, ty) !== '~') P(14, 0, 2, 16, '#3586bd');
            break;
        }
        case '*': {
            grass();
            const cols = ['#ff6b6b', '#ffd93d', '#ffffff', '#ff9ad5'];
            [[4, 5], [11, 10], [10, 3]].forEach(([cx, cy], i) => {
                const c = cols[Math.floor(hash(tx, ty, i + 60) * cols.length)];
                const yy = cy + ((f + i) % 2);
                P(cx - 1, yy, 3, 1, c); P(cx, yy - 1, 1, 3, c);
                P(cx, yy, 1, 1, c === '#ffd93d' ? '#ff8c00' : '#ffd93d');
                P(cx, yy + 2, 1, 2, '#3b9148');
            });
            break;
        }
        case 'T': {
            grass();
            const rows = [[4, 11], [2, 13], [1, 14], [1, 14], [0, 15], [0, 15], [0, 15], [1, 14], [1, 14], [2, 13], [4, 11]];
            P(6, 10, 4, 6, '#7a4a2a'); P(6, 10, 1, 6, '#5a3418');
            rows.forEach(([a, b], r) => {
                P(a, r, b - a + 1, 1, r > 7 ? '#26744a' : '#2e8b57');
                P(a, r, 1, 1, '#1d5a39'); P(b, r, 1, 1, '#1d5a39');
            });
            P(4, 0, 8, 1, '#1d5a39'); P(4, 10, 8, 1, '#1d5a39');
            P(3, 2, 3, 1, '#56b47e'); P(2, 3, 2, 2, '#56b47e'); P(9, 4, 2, 1, '#3fa06a'); P(5, 6, 2, 1, '#3fa06a');
            break;
        }
        default: grass();
    }
}

function paintBuilding(g, b) {
    const X = b.x * TS, Y = b.y * TS, W = b.w * TS, H = b.h * TS;
    const ink = '#2a2a3a', roofH = 22;
    g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(X + 3, Y + H - 2, W - 2, 3);
    g.fillStyle = ink; g.fillRect(X + 1, Y + roofH - 2, W - 2, H - roofH + 2);
    g.fillStyle = '#f4ead5'; g.fillRect(X + 2, Y + roofH - 1, W - 4, H - roofH);
    g.fillStyle = '#e2d3b2'; g.fillRect(X + 2, Y + H - 4, W - 4, 3);
    g.fillStyle = ink; g.fillRect(X, Y + 1, W, roofH);
    g.fillStyle = b.roof; g.fillRect(X + 1, Y + 2, W - 2, roofH - 2);
    g.fillStyle = shade(b.roof, -0.22);
    for (let yy = Y + 6; yy < Y + roofH; yy += 5) g.fillRect(X + 1, yy, W - 2, 1);
    g.fillStyle = shade(b.roof, 0.3); g.fillRect(X + 1, Y + 2, W - 2, 1);
    g.fillStyle = shade(b.roof, -0.4); g.fillRect(X + 1, Y + roofH - 1, W - 2, 1);
    const label = plain(t(b.label));
    g.font = "8px 'Press Start 2P', 'DotGothic16', monospace";
    g.textBaseline = 'top';
    const tw = Math.ceil(g.measureText(label).width);
    const bw = Math.min(W - 4, tw + 6), bx = X + Math.round((W - bw) / 2), by = Y + 7;
    g.fillStyle = ink; g.fillRect(bx, by, bw, 11);
    g.fillStyle = '#fff8e1'; g.fillText(label, bx + 3, by + 2, bw - 6);
    const wy = Y + roofH + 3;
    [X + 6, X + W - 18].forEach((wx) => {
        g.fillStyle = ink; g.fillRect(wx - 1, wy - 1, 14, 11);
        g.fillStyle = '#9fd3f0'; g.fillRect(wx, wy, 12, 9);
        g.fillStyle = '#d9f1fc'; g.fillRect(wx + 1, wy + 1, 3, 2);
        g.fillStyle = ink; g.fillRect(wx + 6, wy, 1, 9); g.fillRect(wx, wy + 4, 12, 1);
    });
    const dx = b.door.x * TS + 3, dy = Y + H - 15;
    g.fillStyle = ink; g.fillRect(dx - 1, dy - 1, 12, 15);
    g.fillStyle = '#8a5a3a'; g.fillRect(dx, dy, 10, 14);
    g.fillStyle = '#6b4229'; g.fillRect(dx + 1, dy + 2, 3, 4); g.fillRect(dx + 6, dy + 2, 3, 4);
    g.fillStyle = '#ffd166'; g.fillRect(dx + 7, dy + 8, 1, 2);
}

function paintSign(g, s) {
    const X = s.x * TS, Y = s.y * TS;
    g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(X + 4, Y + 14, 9, 2);
    g.fillStyle = '#5a3418'; g.fillRect(X + 7, Y + 9, 2, 6);
    g.fillStyle = '#2a2a3a'; g.fillRect(X + 1, Y + 2, 14, 9);
    g.fillStyle = '#c89458'; g.fillRect(X + 2, Y + 3, 12, 7);
    g.fillStyle = '#a87438'; g.fillRect(X + 4, Y + 5, 8, 1); g.fillRect(X + 4, Y + 7, 6, 1);
}

const world = { ready: false, frames: [], lights: null, night: false, anim: 0 };
const canvas = $('#world');
const g = canvas.getContext('2d');

function bakeFrame(f) {
    const c = document.createElement('canvas'); c.width = 320; c.height = 240;
    const ctx = c.getContext('2d');
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) paintTile(ctx, MAP[y][x], x, y, f);
    BUILDINGS.forEach((b) => paintBuilding(ctx, b));
    SIGNS.forEach((s) => paintSign(ctx, s));
    return c;
}
function bakeLights() {
    const c = document.createElement('canvas'); c.width = 320; c.height = 240;
    const ctx = c.getContext('2d');
    BUILDINGS.forEach((b) => {
        const X = b.x * TS, Y = b.y * TS, W = b.w * TS;
        const wy = Y + 25;
        [X + 6, X + W - 18].forEach((wx) => {
            const grd = ctx.createRadialGradient(wx + 6, wy + 5, 1, wx + 6, wy + 8, 18);
            grd.addColorStop(0, 'rgba(255,214,120,.45)'); grd.addColorStop(1, 'rgba(255,214,120,0)');
            ctx.fillStyle = grd; ctx.fillRect(wx - 14, wy - 12, 40, 36);
            ctx.fillStyle = '#ffd879'; ctx.fillRect(wx, wy, 12, 9);
            ctx.fillStyle = '#2a2a3a'; ctx.fillRect(wx + 6, wy, 1, 9); ctx.fillRect(wx, wy + 4, 12, 1);
        });
    });
    for (let i = 0; i < 26; i++) {
        ctx.fillStyle = i % 3 ? 'rgba(255,255,220,.8)' : 'rgba(180,255,170,.9)';
        ctx.fillRect(Math.floor(hash(i, 7, 3) * 320), Math.floor(hash(i, 9, 5) * 240), 1, 1);
    }
    return c;
}
function bakeWorld() {
    world.frames = [bakeFrame(0), bakeFrame(1)];
    world.lights = bakeLights();
    world.ready = true;
}

function drawPerson(p, pal, x, y, walking) {
    let rows, flip = false;
    if (p.dir === 'left' || p.dir === 'right') {
        rows = walking ? SPR.rightWalk : SPR.right;
        flip = p.dir === 'left';
    } else {
        const k = p.dir === 'up' ? 'up' : 'down';
        rows = walking ? SPR[k + 'Walk'] : SPR[k];
        flip = walking && p.step % 2 === 1;
    }
    x = Math.round(x); y = Math.round(y);
    g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(x + 3, y + 14, 10, 2);
    drawRows(g, rows, pal, x, y - 3 - (walking ? 1 : 0), flip);
}

function render() {
    if (!world.ready) return;
    g.drawImage(world.frames[world.anim], 0, 0);
    const ppx = (player.x + (player.tx - player.x) * player.t) * TS;
    const ppy = (player.y + (player.ty - player.y) * player.t) * TS;
    const walking = player.moving && player.t > 0.15 && player.t < 0.85;
    const ents = [
        { y: npc.y * TS, draw: () => drawPerson(npc, PAL_NPC, npc.x * TS, npc.y * TS, false) },
        { y: ppy, draw: () => drawPerson(player, PAL_PLAYER, ppx, ppy, walking) }
    ].sort((a, b) => a.y - b.y);
    ents.forEach((e) => e.draw());
    if (!player.moving && tileAt(player.x, player.y) === ',') {
        g.drawImage(world.frames[world.anim], player.x * TS, player.y * TS + 9, 16, 7, player.x * TS, player.y * TS + 9, 16, 7);
    }
    if (world.night) {
        g.fillStyle = 'rgba(12,16,56,.55)'; g.fillRect(0, 0, 320, 240);
        g.drawImage(world.lights, 0, 0);
    }
    if (player.emote) {
        const ex = Math.round(ppx) + 4, ey = Math.round(ppy) - 17;
        g.fillStyle = '#2a2a3a'; g.fillRect(ex, ey, 9, 11);
        g.fillStyle = '#fff'; g.fillRect(ex + 1, ey + 1, 7, 9);
        g.fillStyle = '#e04b3c'; g.fillRect(ex + 4, ey + 2, 1, 4); g.fillRect(ex + 4, ey + 7, 1, 2);
    }
}

/* ---------------------------------------------------------
   Game state & loop
   --------------------------------------------------------- */
let state = 'title'; // title | world | dialog | menu | panel | battle | transition
const screenEl = $('#screen');
const heldDirs = [];
const heldDir = () => heldDirs[heldDirs.length - 1];
function holdDir(d) { releaseDir(d); heldDirs.push(d); }
function releaseDir(d) { const i = heldDirs.indexOf(d); if (i > -1) heldDirs.splice(i, 1); }
function clearHeld() { heldDirs.length = 0; }

const MOVE_TIME = 0.17;
let last = performance.now(), animClock = 0;
function loop(now) {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    animClock += dt;
    if (animClock > 0.55) { animClock = 0; world.anim ^= 1; }
    update(dt);
    render();
    requestAnimationFrame(loop);
}
function update(dt) {
    if (player.moving) {
        player.t += dt / MOVE_TIME;
        if (player.t >= 1) {
            player.x = player.tx; player.y = player.ty;
            player.t = 0; player.moving = false; player.step++;
            onStep();
        }
    }
    if (!player.moving && state === 'world') {
        const d = heldDir();
        if (d) tryMove(d);
    }
}

let lastBump = 0;
function tryMove(d) {
    player.dir = d;
    const [dx, dy] = DIRS[d];
    const nx = player.x + dx, ny = player.y + dy;
    const door = BUILDINGS.find((b) => b.door.x === nx && b.door.y === ny);
    if (door && d === 'up') { enterBuilding(door); return; }
    if (isSolid(nx, ny)) {
        const now = performance.now();
        if (now - lastBump > 280) { blip(110, 0.05, 'square', 0.02); lastBump = now; }
        return;
    }
    player.tx = nx; player.ty = ny; player.t = 0; player.moving = true;
    hideHint();
}
function onStep() {
    stepsSinceBattle++;
    if (state === 'world' && tileAt(player.x, player.y) === ',' && stepsSinceBattle > 3 && Math.random() < 0.13) {
        startEncounter();
    }
}

function interact() {
    const [dx, dy] = DIRS[player.dir];
    const fx = player.x + dx, fy = player.y + dy;
    const door = BUILDINGS.find((b) => b.door.x === fx && b.door.y === fy);
    if (door) return enterBuilding(door);
    const s = signAt(fx, fy);
    if (s) return say([t(s.key)]);
    if (npc.x === fx && npc.y === fy) return talkNpc();
    if (tileAt(fx, fy) === '~') return say([t('water_text')]);
    const b = buildingAt(fx, fy);
    if (b) return say([t('sign_' + b.id)]);
}
function talkNpc() {
    const dx = player.x - npc.x, dy = player.y - npc.y;
    npc.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
    say([t('npc_1'), t('npc_2')], () => { npc.dir = 'left'; });
}

function enterBuilding(b) {
    if (state !== 'world') return;
    state = 'transition';
    clearHeld();
    blip(523, 0.06); setTimeout(() => blip(784, 0.08), 70);
    screenEl.classList.add('fade');
    setTimeout(() => {
        if (b.id === 'home') player.hp = 100;
        state = 'world';
        openPanel(b.panel, 'world');
        screenEl.classList.remove('fade');
    }, 260);
}

/* --- hint --- */
const hintEl = $('#hint');
let hintShown = false;
function showHint() { if (hintShown) return; hintShown = true; hintEl.classList.remove('hidden'); setTimeout(hideHint, 9000); }
function hideHint() { hintEl.classList.add('hidden'); }

/* ---------------------------------------------------------
   Dialog
   --------------------------------------------------------- */
const dlg = { el: $('#dialog'), text: $('#dialog-text'), queue: [], full: '', i: 0, timer: null, typing: false, cb: null, ret: 'world' };
function say(lines, cb) {
    if (state !== 'dialog') dlg.ret = (state === 'transition' || state === 'title') ? 'world' : state;
    state = 'dialog';
    clearHeld();
    dlg.queue = lines.slice();
    dlg.cb = cb || null;
    dlg.el.classList.remove('hidden');
    nextLine();
}
function nextLine() {
    clearInterval(dlg.timer);
    if (!dlg.queue.length) {
        dlg.el.classList.add('hidden');
        state = dlg.ret;
        const cb = dlg.cb; dlg.cb = null;
        if (cb) cb();
        return;
    }
    dlg.full = dlg.queue.shift();
    dlg.i = 0; dlg.typing = true;
    dlg.el.classList.remove('done');
    dlg.text.textContent = '';
    dlg.timer = setInterval(() => {
        dlg.i++;
        dlg.text.textContent = dlg.full.slice(0, dlg.i);
        if (dlg.i % 3 === 0) blip(1200, 0.015, 'square', 0.012);
        if (dlg.i >= dlg.full.length) { clearInterval(dlg.timer); dlg.typing = false; dlg.el.classList.add('done'); }
    }, 24);
}
function dialogAdvance() {
    if (dlg.typing) {
        clearInterval(dlg.timer);
        dlg.text.textContent = dlg.full;
        dlg.typing = false;
        dlg.el.classList.add('done');
    } else {
        blip(880, 0.03);
        nextLine();
    }
}
dlg.el.addEventListener('click', () => { if (state === 'dialog') dialogAdvance(); });

/* ---------------------------------------------------------
   Start menu
   --------------------------------------------------------- */
const menuEl = $('#start-menu');
function openMenu() {
    state = 'menu';
    clearHeld();
    menuEl.classList.remove('hidden');
    showMenuPage('main');
    blip(784, 0.05);
}
function showMenuPage(p) {
    $('.menu-main', menuEl).hidden = p !== 'main';
    $('.menu-options', menuEl).hidden = p !== 'options';
    menuEl.dataset.page = p;
    const first = $(p === 'main' ? '.menu-main button' : '.menu-options button', menuEl);
    if (first) first.focus({ preventScroll: true });
}
function closeMenu(silent) {
    menuEl.classList.add('hidden');
    if (menuEl.contains(document.activeElement)) document.activeElement.blur();
    if (!silent) { state = 'world'; blip(523, 0.04); }
}
function menuBack() {
    if (menuEl.dataset.page === 'options') showMenuPage('main');
    else closeMenu();
}
menuEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.open) { openPanel(btn.dataset.open, 'world'); return; }
    if (btn.dataset.lang) { setLanguage(btn.dataset.lang); blip(880, 0.04); return; }
    switch (btn.dataset.action) {
        case 'options': blip(880, 0.04); showMenuPage('options'); break;
        case 'back': blip(660, 0.04); showMenuPage('main'); break;
        case 'exit': closeMenu(); break;
        case 'theme': toggleTheme(); break;
        case 'sound':
            soundOn = !soundOn;
            store.set('sound', soundOn ? 'on' : 'off');
            updateSoundLabel();
            blip(880, 0.05);
            break;
    }
});
function updateSoundLabel() { const el = $('#sound-state'); if (el) el.textContent = soundOn ? t('ui_on') : t('ui_off'); }

/* ---------------------------------------------------------
   Content panels
   --------------------------------------------------------- */
const layer = $('#panel-layer');
const PANELS = ['home', 'about', 'services', 'portfolio', 'contact'];
let panelReturn = 'world';
function openPanel(id, returnTo) {
    const sec = document.getElementById(id);
    if (!sec || !sec.classList.contains('panel')) return;
    if (state !== 'panel') {
        panelReturn = returnTo || state;
        if (panelReturn === 'menu' || panelReturn === 'transition') panelReturn = 'world';
    }
    if (state === 'menu') closeMenu(true);
    $$('.panel').forEach((p) => { p.hidden = p !== sec; });
    $$('.navbar a').forEach((a) => a.classList.toggle('active', a.dataset.panel === id));
    layer.classList.remove('hidden');
    $('#panel-wrap').scrollTop = 0;
    state = 'panel';
    clearHeld();
    $('.panel-close').focus({ preventScroll: true });
    try { history.replaceState(null, '', '#' + id); } catch (e) { /* ignore */ }
    blip(660, 0.05); setTimeout(() => blip(990, 0.06), 60);
}
function closePanel() {
    layer.classList.add('hidden');
    $$('.navbar a').forEach((a) => a.classList.remove('active'));
    if (layer.contains(document.activeElement)) document.activeElement.blur();
    state = panelReturn;
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignore */ }
    blip(440, 0.05);
}
$$('[data-close]', layer).forEach((el) => el.addEventListener('click', closePanel));
$$('.navbar a').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    openPanel(a.dataset.panel);
}));
$('#logo-link').addEventListener('click', (e) => { e.preventDefault(); if (state === 'panel') closePanel(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
$('#to-top').addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

/* ---------------------------------------------------------
   Battle
   --------------------------------------------------------- */
const MOVES = [
    { key: 'skill_1_title', type: 'data', typeKey: 'type_data' },
    { key: 'skill_2_title', type: 'logic', typeKey: 'type_logic' },
    { key: 'skill_3_title', type: 'art', typeKey: 'type_art' }
];
const ENEMIES = [
    { name: 'NULL VALUE', shape: 'ghost', pal: { k: '#2a2a3a', w: '#eef0ff', c: '#9aa3d9' }, weak: 'data', moves: ['VOID', 'BLANK STARE'] },
    { name: 'DIRTY DATA', shape: 'bug', pal: { k: '#2a1a10', c: '#a0703c', d: '#6e4a26', w: '#ffffff' }, weak: 'data', moves: ['TYPO STORM', 'DUPLICATE'] },
    { name: 'SLOW QUERY', shape: 'bug', pal: { k: '#10203a', c: '#5aa0e6', d: '#346fae', w: '#ffffff' }, weak: 'logic', moves: ['FULL SCAN', 'TIMEOUT'] },
    { name: 'MERGE CONFLICT', shape: 'ghost', pal: { k: '#3a1010', w: '#ff9a9a', c: '#c94a4a' }, weak: 'logic', moves: ['<<<<<<< HEAD', 'REBASE'] },
    { name: 'MEMORY LEAK', shape: 'bug', pal: { k: '#24103a', c: '#b07ae6', d: '#7a4bb0', w: '#ffffff' }, weak: 'art', moves: ['OVERFLOW', 'SLOW DRIP'] }
];
const battle = { active: false, enemy: null, menu: 'main', waiting: false, resolve: null, skip: null, busy: false, timer: null, auto: null };
const bEl = $('#battle'), bMsg = $('#b-msg'), bMenu = $('#b-menu');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function msg(text, opts) {
    const holdForInput = !(opts && opts.wait === false);
    return new Promise((res) => {
        bMenu.classList.add('hidden');
        clearInterval(battle.timer);
        clearTimeout(battle.auto);
        battle.waiting = false;
        battle.resolve = null;
        bEl.classList.remove('msg-done');
        let i = 0;
        bMsg.textContent = '';
        const finish = () => {
            clearInterval(battle.timer);
            battle.skip = null;
            bMsg.textContent = text;
            if (!holdForInput) { res(); return; }
            battle.waiting = true;
            bEl.classList.add('msg-done');
            battle.resolve = () => {
                battle.waiting = false;
                battle.resolve = null;
                clearTimeout(battle.auto);
                bEl.classList.remove('msg-done');
                res();
            };
            battle.auto = setTimeout(() => { if (battle.resolve) battle.resolve(); }, 2200);
        };
        battle.skip = finish;
        battle.timer = setInterval(() => {
            i++;
            bMsg.textContent = text.slice(0, i);
            if (i % 3 === 0) blip(1100, 0.015, 'square', 0.012);
            if (i >= text.length) finish();
        }, 22);
    });
}
function battleAdvance() {
    if (battle.skip) { battle.skip(); return; }
    if (battle.resolve) { blip(880, 0.03); battle.resolve(); }
}
$('#b-msgbox').addEventListener('click', () => { if (state === 'battle') battleAdvance(); });

function setHp(who, hp) {
    const bar = $('#b-' + who + '-hp');
    bar.style.width = hp + '%';
    bar.classList.toggle('mid', hp <= 50 && hp > 20);
    bar.classList.toggle('low', hp <= 20);
    if (who === 'player') $('#b-player-hpnum').textContent = hp + '/100';
}
function anim(el, cls, keep) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    if (!keep) setTimeout(() => el.classList.remove(cls), 600);
}

function startEncounter() {
    state = 'battle';
    clearHeld();
    battle.active = true;
    player.emote = true;
    blip(1320, 0.08); setTimeout(() => blip(1568, 0.1), 90);
    setTimeout(() => {
        player.emote = false;
        screenEl.classList.add('encounter');
        [880, 660, 880, 660, 440].forEach((f, i) => setTimeout(() => blip(f, 0.07), i * 120));
        setTimeout(() => { screenEl.classList.remove('encounter'); beginBattle(); }, 720);
    }, 500);
}
function beginBattle() {
    const idx = Math.floor(Math.random() * ENEMIES.length);
    const e = ENEMIES[idx];
    battle.enemy = Object.assign({}, e, { idx, hp: 100, lv: 3 + Math.floor(Math.random() * 12) });
    $('#b-enemy-name').textContent = e.name;
    $('#b-enemy-lv').textContent = battle.enemy.lv;
    const eImg = $('#b-enemy-img');
    eImg.classList.remove('faint', 'hit');
    eImg.src = spriteURL(MON[e.shape], e.pal, 8);
    eImg.alt = e.name;
    setHp('enemy', 100);
    setHp('player', player.hp);
    bMsg.textContent = '';
    bEl.classList.remove('hidden');
    bEl.classList.add('enter');
    setTimeout(() => bEl.classList.remove('enter'), 700);
    (async () => {
        await wait(400);
        await msg(t('b_appear', { x: e.name }));
        mainMenu();
    })();
}
async function mainMenu() {
    await msg(t('b_what', { p: 'THARIQ' }), { wait: false });
    renderBattleMenu('main');
}
function renderBattleMenu(m) {
    battle.menu = m;
    bMenu.innerHTML = '';
    bMenu.dataset.mode = m;
    const add = (html, fn, cls) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'b-btn ' + (cls || '');
        b.innerHTML = html;
        b.addEventListener('click', () => { if (battle.busy || state !== 'battle') return; blip(880, 0.04); fn(); });
        bMenu.appendChild(b);
        return b;
    };
    if (m === 'main') {
        add(t('b_fight'), () => renderBattleMenu('moves'));
        add(t('b_info'), doInfo);
        add(t('b_run'), doRun);
    } else {
        MOVES.forEach((mv, i) => add('<span>' + plain(t(mv.key)) + '</span><small>' + t(mv.typeKey) + '</small>', () => useMove(i), 't-' + mv.type));
        add(t('b_back'), () => renderBattleMenu('main'), 'back');
    }
    bMenu.classList.remove('hidden');
    const first = bMenu.querySelector('button');
    if (first) first.focus({ preventScroll: true });
}
async function doInfo() {
    battle.busy = true;
    await msg(t('en_desc_' + battle.enemy.idx));
    battle.busy = false;
    mainMenu();
}
async function doRun() {
    battle.busy = true;
    blip(330, 0.05); setTimeout(() => blip(260, 0.05), 80); setTimeout(() => blip(200, 0.08), 160);
    await msg(t('b_run_ok'));
    battle.busy = false;
    endBattle();
}
async function useMove(i) {
    battle.busy = true;
    const mv = MOVES[i], en = battle.enemy;
    await msg(t('b_used', { p: 'THARIQ', m: plain(t(mv.key)) }));
    const eImg = $('#b-enemy-img');
    anim(eImg, 'hit');
    blip(220, 0.14, 'sawtooth', 0.04);
    let dmg = 24 + Math.floor(Math.random() * 18);
    const crit = Math.random() < 0.15;
    const sup = mv.type === en.weak;
    if (crit) dmg = Math.round(dmg * 1.5);
    if (sup) dmg = Math.round(dmg * 1.6);
    en.hp = Math.max(0, en.hp - dmg);
    setHp('enemy', en.hp);
    await wait(650);
    if (crit) await msg(t('b_crit'));
    if (sup) await msg(t('b_super'));
    if (en.hp <= 0) {
        anim(eImg, 'faint', true);
        blip(400, 0.1); setTimeout(() => blip(300, 0.1), 100); setTimeout(() => blip(180, 0.2), 200);
        await wait(500);
        await msg(t('b_win', { x: en.name }));
        [523, 659, 784, 1047].forEach((f, k) => setTimeout(() => blip(f, 0.09), k * 110));
        await msg(t('b_gain', { n: 5 + Math.floor(Math.random() * 16) }));
        battle.busy = false;
        endBattle();
        return;
    }
    const em = en.moves[Math.floor(Math.random() * en.moves.length)];
    await msg(t('b_enemy_used', { x: en.name, m: em }));
    anim($('#b-player-img'), 'hit');
    blip(160, 0.14, 'sawtooth', 0.04);
    player.hp = Math.max(0, player.hp - (8 + Math.floor(Math.random() * 12)));
    setHp('player', player.hp);
    await wait(650);
    if (player.hp <= 0) {
        await msg(t('b_lose'));
        player.hp = 100;
        battle.busy = false;
        endBattle();
        return;
    }
    battle.busy = false;
    mainMenu();
}
function endBattle() {
    state = 'transition';
    screenEl.classList.add('fade');
    setTimeout(() => {
        bEl.classList.add('hidden');
        bMenu.classList.add('hidden');
        clearTimeout(battle.auto);
        battle.active = false;
        battle.resolve = null; battle.skip = null;
        if (bEl.contains(document.activeElement)) document.activeElement.blur();
        stepsSinceBattle = 0;
        state = 'world';
        screenEl.classList.remove('fade');
    }, 320);
}

/* ---------------------------------------------------------
   Title screen
   --------------------------------------------------------- */
const titleEl = $('#title-screen');
function startGame() {
    if (state !== 'title') return;
    state = 'transition';
    blip(659, 0.08); setTimeout(() => blip(988, 0.14), 90);
    titleEl.classList.add('leaving');
    setTimeout(() => {
        titleEl.classList.add('hidden');
        state = 'world';
        say([
            plain(t('home_hello')) + ' ' + plain(t('home_name')) + '!',
            cap(plain(t('home_desc'))),
            t('intro_3'),
            t('intro_4')
        ], showHint);
    }, 500);
}
titleEl.addEventListener('click', () => { if (state === 'title') startGame(); });

/* ---------------------------------------------------------
   Input
   --------------------------------------------------------- */
const KEYMAP = {
    ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
    KeyZ: 'a', Space: 'a', KeyX: 'b', Escape: 'b', Backspace: 'b',
    Enter: 'start', NumpadEnter: 'start', ShiftLeft: 'select', ShiftRight: 'select'
};
const isDir = (a) => a === 'up' || a === 'down' || a === 'left' || a === 'right';

function visible(el) { return el.offsetParent !== null; }
function moveFocus(container, dir) {
    const items = $$('button', container).filter(visible);
    if (!items.length) return;
    const cur = items.includes(document.activeElement) ? document.activeElement : null;
    if (!cur) { items[0].focus({ preventScroll: true }); return; }
    const r = cur.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let best = null, bd = Infinity;
    for (const it of items) {
        if (it === cur) continue;
        const q = it.getBoundingClientRect();
        const dx = q.left + q.width / 2 - cx, dy = q.top + q.height / 2 - cy;
        const ok = dir === 'up' ? dy < -4 : dir === 'down' ? dy > 4 : dir === 'left' ? dx < -4 : dx > 4;
        if (!ok) continue;
        const vert = dir === 'up' || dir === 'down';
        const d = (vert ? Math.abs(dy) : Math.abs(dx)) + (vert ? Math.abs(dx) : Math.abs(dy)) * 2;
        if (d < bd) { bd = d; best = it; }
    }
    if (best) { best.focus({ preventScroll: true }); blip(990, 0.025); }
}

function press(act) {
    switch (state) {
        case 'title':
            if (act === 'a' || act === 'start') startGame();
            break;
        case 'world':
            if (act === 'a') interact();
            else if (act === 'start') openMenu();
            else if (act === 'select') toggleTheme();
            break;
        case 'dialog':
            if (act === 'a' || act === 'b' || act === 'start') dialogAdvance();
            break;
        case 'menu':
            if (isDir(act)) moveFocus(menuEl, act);
            else if (act === 'a') { const f = document.activeElement; if (f && menuEl.contains(f)) f.click(); }
            else if (act === 'b') menuBack();
            else if (act === 'start') closeMenu();
            break;
        case 'battle':
            if (battle.skip || battle.resolve) {
                if (act === 'a' || act === 'b' || act === 'start') battleAdvance();
            } else if (!bMenu.classList.contains('hidden')) {
                if (isDir(act)) moveFocus(bMenu, act);
                else if (act === 'a') {
                    const f = document.activeElement;
                    if (f && bMenu.contains(f)) f.click();
                    else { const b0 = bMenu.querySelector('button'); if (b0) b0.focus({ preventScroll: true }); }
                }
                else if (act === 'b' && battle.menu === 'moves') renderBattleMenu('main');
            }
            break;
        case 'panel':
            if (act === 'b') closePanel();
            break;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('select, input, textarea')) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const act = KEYMAP[e.code];
    if (!act) return;
    if (state === 'panel') {
        if (act === 'b') { e.preventDefault(); closePanel(); }
        return;
    }
    const ae = document.activeElement;
    const nativeActivate = (e.code === 'Enter' || e.code === 'Space' || e.code === 'NumpadEnter') && ae && (ae.tagName === 'BUTTON' || ae.tagName === 'A');
    if (nativeActivate && (!screenEl.contains(ae) || state === 'menu' || (state === 'battle' && !battle.skip && !battle.resolve))) return;
    // let arrows scroll the page when the game screen is out of view
    const rect = screenEl.getBoundingClientRect();
    if (isDir(act) && (rect.bottom < 0 || rect.top > window.innerHeight)) return;
    e.preventDefault();
    if (isDir(act)) holdDir(act);
    if (!e.repeat) press(act);
});
document.addEventListener('keyup', (e) => { const act = KEYMAP[e.code]; if (act && isDir(act)) releaseDir(act); });
window.addEventListener('blur', clearHeld);

// on-screen controls
$$('.dpad button').forEach((btn) => {
    const d = btn.dataset.dir;
    btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        try { btn.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        btn.classList.add('pressed');
        holdDir(d);
        press(d);
    });
    const up = () => { btn.classList.remove('pressed'); releaseDir(d); };
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => btn.addEventListener(ev, up));
});
$$('[data-btn]').forEach((btn) => {
    btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        btn.classList.add('pressed');
        press(btn.dataset.btn);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, () => btn.classList.remove('pressed')));
});
$('.controls').addEventListener('contextmenu', (e) => e.preventDefault());
titleEl.addEventListener('keydown', (e) => { if ((e.code === 'Enter' || e.code === 'Space') && state === 'title') { e.preventDefault(); e.stopPropagation(); startGame(); } });

// click / tap on the map
function tileFromEvent(e) {
    const r = canvas.getBoundingClientRect();
    return [Math.floor((e.clientX - r.left) / r.width * COLS), Math.floor((e.clientY - r.top) / r.height * ROWS)];
}
canvas.addEventListener('click', (e) => {
    if (state !== 'world') return;
    const [tx, ty] = tileFromEvent(e);
    const b = buildingAt(tx, ty);
    if (b) { enterBuilding(b); return; }
    const s = signAt(tx, ty);
    if (s) { say([t(s.key)]); return; }
    if (npc.x === tx && npc.y === ty) talkNpc();
});
canvas.addEventListener('mousemove', (e) => {
    if (state !== 'world') { canvas.style.cursor = ''; return; }
    const [tx, ty] = tileFromEvent(e);
    canvas.style.cursor = (buildingAt(tx, ty) || signAt(tx, ty) || (npc.x === tx && npc.y === ty)) ? 'pointer' : '';
});

/* ---------------------------------------------------------
   Theme & language
   --------------------------------------------------------- */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    store.set('theme', theme);
    const icon = $('#theme-toggle i');
    if (icon) icon.className = theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
    world.night = theme === 'dark';
}
function toggleTheme() {
    setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    blip(523, 0.05); setTimeout(() => blip(659, 0.06), 60);
}
$('#theme-toggle').addEventListener('click', toggleTheme);

const languageSelector = $('#language-selector');
function setLanguage(l) {
    if (!translations[l]) l = 'en';
    lang = l;
    $$('[data-i18n]').forEach((el) => {
        const v = translations[l][el.dataset.i18n] ?? translations.en[el.dataset.i18n];
        if (v != null) el.innerHTML = v; // innerHTML allows the <span> accents in headings
    });
    document.documentElement.lang = l === 'jp' ? 'ja' : l;
    store.set('language', l);
    languageSelector.value = l;
    $$('[data-lang]').forEach((b) => b.classList.toggle('is-on', b.dataset.lang === l));
    updateSoundLabel();
    if (world.ready) bakeWorld();
    if (battle.active && !bMenu.classList.contains('hidden')) renderBattleMenu(battle.menu);
}
languageSelector.addEventListener('change', (e) => setLanguage(e.target.value));

/* ---------------------------------------------------------
   Boot
   --------------------------------------------------------- */
const savedTheme = store.get('theme');
setTheme(savedTheme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
setLanguage(store.get('language') || 'en');

const heroURL = spriteURL(SPR.down, PAL_PLAYER, 8);
$$('img[data-sprite="hero"]').forEach((img) => { img.src = heroURL; });
$('#b-player-img').src = spriteURL(SPR.up, PAL_PLAYER, 8);
$('#title-buddy').src = spriteURL(MON.bug, { k: '#10303a', c: '#3fd0c0', d: '#22968a', w: '#ffffff' }, 8);

g.imageSmoothingEnabled = false;
bakeWorld();
if (document.fonts) {
    Promise.all([
        document.fonts.load("8px 'Press Start 2P'"),
        document.fonts.load("8px 'DotGothic16'", 'いえポストラボジムさくひん')
    ]).then(bakeWorld, bakeWorld);
    if (document.fonts.ready) document.fonts.ready.then(bakeWorld);
}
requestAnimationFrame(loop);

// deep links (#about, #portfolio ...) open their panel straight away
const hashId = location.hash.slice(1);
if (PANELS.includes(hashId)) openPanel(hashId, 'title');
})();
