export const siteConfig = {
  url: "https://mustafaulutas.dev",

  name: "Mustafa Ulutaş",
  tagline: "Creative Full-Stack Engineer",
  description:
    "Next.js, .NET ve yaratıcı motion tasarımını birleştiren; performans, kullanıcı deneyimi ve üretim kalitesi odağında çalışan yazılım mühendisi.",
  ogImage: "https://mustafaulutas.dev/og.png",

  author: {
    name: "Mustafa Ulutaş",
    role: "Full-Stack Software Engineer",
    bio: "Modern web deneyimleri, üretimde çalışan backend sistemleri ve performans odaklı ürün tasarımı üzerinde çalışıyorum.",
    email: "mustafa@mustafaulutas.dev",
    avatar: "/assets/avatar.jpg",
    location: "Türkiye",
    availability: "Yeni freelance ve ürün odaklı iş birliklerine açık.",
  },

  home: {
    eyebrow: "designerly engineering · smooth, human, intentional",
    intro:
      "Merhaba, ben Mustafa. Yazılımı sadece teknik bir üretim alanı olarak değil, aynı zamanda his bırakan dijital deneyimler tasarlamanın bir yolu olarak görüyorum.",
    subIntro:
      "Next.js, .NET, motion design ve performans disiplinini; daha sakin, daha insani ve daha akılda kalan ürünler üretmek için bir araya getiriyorum.",
  },

  social: {
    github: "https://github.com/mustafaulutas",
    linkedin: "https://linkedin.com/in/mustafaulutas",
    twitter: "https://x.com/mustafaulutas",
  },

  nav: [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],

  keywords: [
    "mustafa ulutas",
    "full-stack engineer",
    "creative frontend developer",
    "next.js developer",
    ".net architect",
    "gsap animations",
    "lenis smooth scroll",
    "premium web design",
    "software engineer türkiye",
    "frontend motion design",
  ],
} as const;

export type SiteConfig = typeof siteConfig;