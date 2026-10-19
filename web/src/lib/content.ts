/**
 * Bilingual site content (EN / ID).
 * Source of truth: Docs/Portfolio.md, Docs/company.md, Docs/web_PRD.proposed.md.
 */

export type Lang = "en" | "id";
export type Localized = Record<Lang, string>;

export const COMPANY = {
  name: "Morpiks Solutions",
  email: "info@morpiks.com",
  whatsappDisplay: "+62 813-8499-0143",
  whatsappHref: "https://wa.me/6281384990143",
  location: "Bogor, Jawa Barat - Indonesia",
};

export const TAGLINE: Localized = {
  en: "Evolve Beyond Limits",
  id: "Melampaui Batas, Terus Berkembang",
};

export type SlideCategory = "technology" | "industrial";

export interface Slide {
  id: string;
  category: SlideCategory;
  image: string;
  title: Localized;
  description: Localized;
  highlights: Record<Lang, string[]>;
  alt: Localized;
}

/** PRD 8.1: 9 slides. System Integration is combined into slide 6. */
export const SLIDES: Slide[] = [
  {
    id: "end-to-end",
    category: "technology",
    image: "/images/services-hero-overview.jpg",
    title: { en: "End-to-End Business Solution", id: "Solusi Bisnis End-to-End" },
    description: {
      en: "Integrated solutions covering process, system, and operations, shaped around how your business actually works.",
      id: "Solusi terintegrasi dari proses, sistem, hingga operasional, dirancang sesuai cara bisnis Anda bekerja.",
    },
    highlights: {
      en: ["Process", "System", "Operations"],
      id: ["Proses", "Sistem", "Operasional"],
    },
    alt: {
      en: "A camera module and an industrial motor connected through a central hub to floating system dashboards",
      id: "Modul kamera dan motor industri yang terhubung melalui hub pusat ke dasbor sistem",
    },
  },
  {
    id: "webapp",
    category: "technology",
    image: "/images/service-webapp-dev.jpg",
    title: { en: "WebApp Development", id: "Pengembangan WebApp" },
    description: {
      en: "Custom web applications built for your workflow, not the other way around.",
      id: "Aplikasi web kustom yang dibangun sesuai alur kerja Anda.",
    },
    highlights: {
      en: ["Custom build", "Your workflow", "Iterative delivery"],
      id: ["Kustom", "Sesuai alur kerja", "Pengembangan iteratif"],
    },
    alt: {
      en: "Layered glass panels showing web application wireframes and dashboard layouts",
      id: "Panel kaca berlapis yang menampilkan wireframe aplikasi web dan tata letak dasbor",
    },
  },
  {
    id: "prototyping",
    category: "technology",
    image: "/images/service-rapid-prototyping.jpg",
    title: { en: "Rapid Prototyping", id: "Rapid Prototyping" },
    description: {
      en: "Validate ideas fast before committing to a full build.",
      id: "Validasi ide dengan cepat sebelum pengembangan penuh.",
    },
    highlights: {
      en: ["Fast validation", "Lower risk", "Clear next step"],
      id: ["Validasi cepat", "Risiko lebih rendah", "Langkah jelas"],
    },
    alt: {
      en: "A machined metal gearbox beside its translucent 3D-printed prototype on a measuring grid",
      id: "Gearbox logam hasil permesinan di samping prototipe cetak 3D transparan di atas grid ukur",
    },
  },
  {
    id: "enterprise",
    category: "technology",
    image: "/images/service-enterprise-erp.jpg",
    title: { en: "WMS / IMS / ERP Development", id: "Pengembangan WMS / IMS / ERP" },
    description: {
      en: "Warehouse, inventory, and enterprise management systems that keep operations in one view.",
      id: "Sistem manajemen gudang, inventaris, dan ERP yang menyatukan operasional dalam satu tampilan.",
    },
    highlights: {
      en: ["Warehouse", "Inventory", "Enterprise"],
      id: ["Gudang", "Inventaris", "Enterprise"],
    },
    alt: {
      en: "Stacked glass modules linked by data paths above a server base, representing connected enterprise systems",
      id: "Modul kaca bertumpuk yang terhubung jalur data di atas server, menggambarkan sistem enterprise yang terintegrasi",
    },
  },
  {
    id: "iot",
    category: "technology",
    image: "/images/service-iot-solutions.jpg",
    title: { en: "IoT Development", id: "Pengembangan IoT" },
    description: {
      en: "Custom IoT solutions for monitoring and automation.",
      id: "Solusi IoT kustom untuk monitoring dan otomasi.",
    },
    highlights: {
      en: ["Sensors", "Monitoring", "Automation"],
      id: ["Sensor", "Monitoring", "Otomasi"],
    },
    alt: {
      en: "Two IoT device enclosures with visible circuit boards on a lab workbench",
      id: "Dua perangkat IoT dengan papan sirkuit terlihat di meja laboratorium",
    },
  },
  {
    id: "automation",
    category: "technology",
    image: "/images/service-automation.jpg",
    title: { en: "Automation & System Integration", id: "Otomasi & Integrasi Sistem" },
    description: {
      en: "Reduce manual work through automated processes, and connect existing systems into one flow.",
      id: "Kurangi pekerjaan manual melalui proses otomatis, dan hubungkan sistem yang ada menjadi satu alur.",
    },
    highlights: {
      en: ["Automation", "Integration", "One flow"],
      id: ["Otomasi", "Integrasi", "Satu alur"],
    },
    alt: {
      en: "A robotic arm placing components on a circuit board, connected to a control unit",
      id: "Lengan robot yang menempatkan komponen pada papan sirkuit, terhubung ke unit kontrol",
    },
  },
  {
    id: "industrial-equipment",
    category: "industrial",
    image: "/images/service-industrial-equipment.jpg",
    title: { en: "Industrial Equipment Design", id: "Desain Peralatan Industri" },
    description: {
      en: "Design of custom industrial equipment, fitted to your process and floor.",
      id: "Desain peralatan industri kustom, disesuaikan dengan proses dan area kerja Anda.",
    },
    highlights: {
      en: ["Custom design", "Fit to process", "Built to last"],
      id: ["Desain kustom", "Sesuai proses", "Tahan lama"],
    },
    alt: {
      en: "An enclosed CNC milling machine with a touch control panel in a bright facility",
      id: "Mesin CNC milling tertutup dengan panel kontrol sentuh di fasilitas yang terang",
    },
  },
  {
    id: "furniture",
    category: "industrial",
    image: "/images/service-furniture-design.jpg",
    title: { en: "Furniture Design & Fabrication", id: "Desain & Fabrikasi Furnitur" },
    description: {
      en: "Custom furniture, from design to fabrication.",
      id: "Furnitur kustom, dari desain hingga fabrikasi.",
    },
    highlights: {
      en: ["Design", "Fabrication", "Office & commercial"],
      id: ["Desain", "Fabrikasi", "Kantor & komersial"],
    },
    alt: {
      en: "A custom walnut and black steel executive desk with a chair in a dark office",
      id: "Meja eksekutif kustom dari kayu walnut dan baja hitam dengan kursi di kantor bernuansa gelap",
    },
  },
  {
    id: "procurement",
    category: "industrial",
    image: "/images/service-procurement.jpg",
    title: { en: "Industrial & Office Procurement", id: "Pengadaan Industri & Kantor" },
    description: {
      en: "Sourcing industrial and office supplies, handled end to end.",
      id: "Pengadaan kebutuhan industri dan kantor, ditangani dari awal hingga akhir.",
    },
    highlights: {
      en: ["Industrial supplies", "Office supplies", "Sourcing"],
      id: ["Kebutuhan industri", "Kebutuhan kantor", "Sourcing"],
    },
    alt: {
      en: "An arranged set of hardware units, cases, and storage boxes on a marble platform",
      id: "Rangkaian unit perangkat keras, koper, dan kotak penyimpanan di atas platform marmer",
    },
  },
];

export const UI = {
  nav: {
    portfolio: { en: "Portfolio", id: "Portofolio" },
    services: { en: "Services", id: "Layanan" },
    about: { en: "About", id: "Tentang" },
    contact: { en: "Contact", id: "Kontak" },
    language: { en: "Switch to Bahasa Indonesia", id: "Ganti ke English" },
  },
  cta: { en: "Book a consultation", id: "Pesan konsultasi" },
  category: {
    technology: { en: "Technology", id: "Teknologi" },
    industrial: { en: "Industrial", id: "Industri" },
  },
  slider: {
    label: { en: "Portfolio and services", id: "Portofolio dan layanan" },
    prev: { en: "Prev", id: "Sebelumnya" },
    next: { en: "Next", id: "Berikutnya" },
    pause: { en: "Pause", id: "Jeda" },
    play: { en: "Play", id: "Putar" },
    goTo: { en: "Go to slide", id: "Ke slide" },
    of: { en: "of", id: "dari" },
  },
  loading: { en: "Loading", id: "Memuat" },
} satisfies Record<string, unknown>;

export const ABOUT = {
  eyebrow: { en: "About us", id: "Tentang kami" },
  heading: {
    en: "Adapt. Evolve. Grow.",
    id: "Beradaptasi. Berkembang. Tumbuh.",
  },
  body: {
    en: "Morpiks is a multi-solution company that helps businesses adapt, evolve, and grow. From software development and rapid prototyping to procurement, business consulting, custom industrial equipment, furniture, and IoT, we deliver solutions tailored to each business context.",
    id: "Morpiks adalah perusahaan multi-solusi yang membantu bisnis beradaptasi, berkembang, dan tumbuh. Dari pengembangan perangkat lunak dan rapid prototyping hingga pengadaan, konsultasi bisnis, peralatan industri custom, furnitur, dan IoT, kami menghadirkan solusi yang disesuaikan dengan konteks setiap bisnis.",
  },
  chameleon: {
    en: "Inspired by the chameleon, we adjust our approach to the environment and needs of every client, while staying consistent in our principles.",
    id: "Terinspirasi dari bunglon, kami menyesuaikan pendekatan dengan lingkungan dan kebutuhan setiap klien, namun tetap konsisten dengan prinsip kami.",
  },
  philosophyTitle: { en: "Our philosophy", id: "Filosofi kami" },
  philosophy: [
    {
      key: "ADAPT",
      text: {
        en: "We adjust the approach to the context and needs of each business.",
        id: "Kami menyesuaikan pendekatan dengan konteks dan kebutuhan setiap bisnis.",
      },
    },
    {
      key: "EVOLVE",
      text: {
        en: "We continuously improve processes, systems, and ways of working.",
        id: "Kami terus meningkatkan proses, sistem, dan cara kerja.",
      },
    },
    {
      key: "CORE VALUE",
      text: {
        en: "We stay consistent in principles while evolving how we deliver.",
        id: "Kami konsisten pada prinsip sambil terus berkembang dalam cara kami bekerja.",
      },
    },
  ],
  serveTitle: { en: "Who we serve", id: "Siapa yang kami layani" },
  segments: [
    {
      title: { en: "Small businesses", id: "Usaha kecil" },
      text: { en: "Affordable digitalization of daily operations", id: "Digitalisasi operasional harian yang terjangkau" },
    },
    {
      title: { en: "Manufacturing & warehousing", id: "Manufaktur & pergudangan" },
      text: { en: "Inventory, WMS/IMS, automation, custom equipment", id: "Inventaris, WMS/IMS, otomasi, peralatan kustom" },
    },
    {
      title: { en: "Offices & commercial spaces", id: "Kantor & ruang komersial" },
      text: { en: "Office procurement, custom furniture, business systems", id: "Pengadaan kantor, furnitur kustom, sistem bisnis" },
    },
    {
      title: { en: "Enterprises", id: "Enterprise" },
      text: { en: "End-to-end solutions and system integration", id: "Solusi end-to-end dan integrasi sistem" },
    },
  ],
};

export const APPROACH = {
  eyebrow: { en: "Why Morpiks", id: "Mengapa Morpiks" },
  heading: {
    en: "Problem-first, not product-first.",
    id: "Mulai dari masalah, bukan dari produk.",
  },
  reasons: [
    {
      title: { en: "Problem-first", id: "Fokus pada masalah" },
      text: {
        en: "We analyze the problem, find the gap, and understand the real need before proposing a solution.",
        id: "Kami menganalisis masalah, menemukan celah, dan memahami kebutuhan nyata sebelum mengusulkan solusi.",
      },
    },
    {
      title: { en: "Integrity & transparency", id: "Integritas & transparansi" },
      text: {
        en: "An expert team with proven experience, committed to high-quality delivery with integrity and transparency.",
        id: "Tim ahli dengan pengalaman terbukti, berkomitmen pada kualitas tinggi dengan integritas dan transparansi.",
      },
    },
    {
      title: { en: "Fair pricing", id: "Harga wajar" },
      text: {
        en: "High-quality solutions at a reasonable price for businesses of all sizes, including small owners going digital.",
        id: "Solusi berkualitas tinggi dengan harga wajar untuk bisnis dari berbagai skala, termasuk usaha kecil yang ingin go digital.",
      },
    },
    {
      title: { en: "Agile & Kaizen", id: "Agile & Kaizen" },
      text: {
        en: "Iterative delivery with clear communication, guided by Kaizen and Six Sigma practices.",
        id: "Pengembangan iteratif dengan komunikasi jelas, dipandu praktik Kaizen dan Six Sigma.",
      },
    },
  ],
  howTitle: { en: "How we work", id: "Cara kami bekerja" },
  steps: [
    {
      title: { en: "Understand", id: "Memahami" },
      text: { en: "Discovery: analyze the problem, find the gap", id: "Discovery: menganalisis masalah dan menemukan celah" },
    },
    {
      title: { en: "Design", id: "Merancang" },
      text: { en: "Shape the approach to your context", id: "Merancang pendekatan sesuai konteks Anda" },
    },
    {
      title: { en: "Iterate", id: "Iterasi" },
      text: { en: "Build in small cycles with regular feedback", id: "Membangun dalam siklus kecil dengan umpan balik rutin" },
    },
    {
      title: { en: "Improve", id: "Menyempurnakan" },
      text: { en: "Continuous improvement (Kaizen) after delivery", id: "Perbaikan berkelanjutan (Kaizen) setelah delivery" },
    },
  ],
};

export type Subject = "consultation" | "project" | "procurement" | "general";

export const CONTACT = {
  eyebrow: { en: "Contact", id: "Kontak" },
  heading: { en: "Ready to adapt and evolve?", id: "Siap beradaptasi dan berkembang?" },
  body: {
    en: "Book a free consultation and let us analyze your challenge.",
    id: "Pesan konsultasi gratis dan biarkan kami menganalisis tantangan Anda.",
  },
  details: {
    email: { en: "Email", id: "Email" },
    whatsapp: { en: "WhatsApp", id: "WhatsApp" },
    location: { en: "Location", id: "Lokasi" },
  },
  whatsappCta: { en: "Chat on WhatsApp", id: "Chat via WhatsApp" },
  form: {
    name: { en: "Name", id: "Nama" },
    email: { en: "Email", id: "Email" },
    subject: { en: "Subject", id: "Subjek" },
    message: { en: "Message", id: "Pesan" },
    messagePlaceholder: {
      en: "Tell us about your business and the challenge you're facing.",
      id: "Ceritakan tentang bisnis Anda dan tantangan yang dihadapi.",
    },
    submit: { en: "Send message", id: "Kirim pesan" },
    sending: { en: "Sending…", id: "Mengirim…" },
    success: {
      en: "Thank you. We received your message and will reply to your email soon.",
      id: "Terima kasih. Pesan Anda telah kami terima dan akan segera kami balas melalui email.",
    },
    error: {
      en: "Something went wrong. Please try again, or email us directly.",
      id: "Terjadi kesalahan. Silakan coba lagi, atau kirim email langsung kepada kami.",
    },
    required: { en: "This field is required.", id: "Kolom ini wajib diisi." },
    invalidEmail: { en: "Please enter a valid email.", id: "Masukkan email yang valid." },
    subjects: {
      consultation: { en: "Free consultation", id: "Konsultasi gratis" },
      project: { en: "New project", id: "Proyek baru" },
      procurement: { en: "Procurement", id: "Pengadaan" },
      general: { en: "General enquiry", id: "Pertanyaan umum" },
    } satisfies Record<Subject, Localized>,
  },
  footer: {
    rights: { en: "All rights reserved.", id: "Hak cipta dilindungi." },
  },
};

export const SUBJECTS: Subject[] = ["consultation", "project", "procurement", "general"];
