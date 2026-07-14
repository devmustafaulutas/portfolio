import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Journey from "@/components/sections/Journey";
import CaseFiles from "@/components/sections/CaseFiles";
import Arsenal from "@/components/sections/Arsenal";
import ProjectIndex from "@/components/sections/ProjectIndex";
import ContactFinale from "@/components/sections/ContactFinale";
import { site } from "@/config/site";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  url: site.url,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kocaeli",
    addressCountry: "TR",
  },
  sameAs: [site.social.github, site.social.linkedin],
  knowsAbout: [
    "C#",
    ".NET",
    "ASP.NET Core",
    "Clean Architecture",
    "CQRS",
    "Multi-Tenant Architecture",
    "React",
    "TypeScript",
    "Next.js",
    "RabbitMQ",
    "Redis",
  ],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Hero />
      <Manifesto />
      <Journey />
      <CaseFiles />
      {/* <Arsenal /> */}
      <ProjectIndex />
      <ContactFinale />
    </main>
  );
}
