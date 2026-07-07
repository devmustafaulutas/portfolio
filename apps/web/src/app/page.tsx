import { SmoothScrollLayout } from "@/components/layout/SmoothScrollLayout";
import { FluidCanvas } from "@/components/three/FluidCanvas";
import { HeroSection } from "@/components/sections/HeroSection";
import { TheManifestoSection } from "@/components/sections/TheManifestoSection";
import { ExperienceAccordion } from "@/components/sections/ExperienceAccordion";
import { MagneticProjectShowcase } from "@/components/sections/MagneticProjectShowcase";
import { ContactFinale } from "@/components/sections/ContactFinale";
import { siteConfig } from "@/config/site";
import { heroContent, heroManifesto, manifestoSection } from "@/content/manifesto";
import { experienceEntries, experienceSection } from "@/content/experience";
import { showcaseProjects, showcaseSection } from "@/content/showcase";

/**
 * Server component: owns the data layer and hands plain, serialisable
 * content down to the client-side experience components.
 */
export default function HomePage() {
  return (
    <SmoothScrollLayout>
      <FluidCanvas />
      <main id="main" className="relative z-10">
        <HeroSection hero={heroContent} />
        <TheManifestoSection content={manifestoSection} opener={heroManifesto} />
        <ExperienceAccordion
          section={experienceSection}
          entries={experienceEntries}
        />
        <MagneticProjectShowcase
          section={showcaseSection}
          projects={showcaseProjects}
        />
        <ContactFinale
          email={siteConfig.email}
          github={siteConfig.social.github}
          linkedin={siteConfig.social.linkedin}
          location={siteConfig.location}
          name={siteConfig.name}
        />
      </main>
    </SmoothScrollLayout>
  );
}
