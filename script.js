/*=======/* Toggle Icon Navbar */
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

/* Scroll Sections Active Link */
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });
    
    /* Sticky Navbar */
    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);

    /* Remove toggle icon and navbar when click navbar link (scroll) */
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

/* Scroll Reveal */
ScrollReveal({ 
    // reset: true,
    distance: '80px',
    duration: 2000,
    delay: 200
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img, .services-container, .portfolio-box, .contact form', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right' });

/*=======/* Theme Toggle Logic */
const toggleButton = document.getElementById('theme-toggle');
const themeIcon = toggleButton.querySelector('i');
const htmlElement = document.documentElement;

// Function to set theme
function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update icon
    if (theme === 'dark') {
        themeIcon.classList.remove('bx-moon');
        themeIcon.classList.add('bx-sun');
    } else {
        themeIcon.classList.remove('bx-sun');
        themeIcon.classList.add('bx-moon');
    }
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

if (savedTheme) {
    setTheme(savedTheme);
} else if (prefersDarkScheme.matches) {
    setTheme('dark');
} else {
    setTheme('light');
}

// Event Listener
toggleButton.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

/* Language Toggle Logic */
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
  },
};

const languageSelector = document.getElementById('language-selector');

function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key]; // Use innerHTML to allow <span>
        }
    });
    localStorage.setItem('language', lang);
    languageSelector.value = lang;
}

// Load saved language
const savedLang = localStorage.getItem('language') || 'en';
setLanguage(savedLang);

languageSelector.addEventListener('change', (e) => {
    setLanguage(e.target.value);
});