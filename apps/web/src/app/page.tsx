import { SmoothScrollLayout } from "@/components/layout/SmoothScrollLayout";
import { ExperienceCanvas } from "@/components/three/ExperienceCanvas";
import { HeroSection } from "@/components/sections/HeroSection";
import { TheJourneyTimeline } from "@/components/sections/TheJourneyTimeline";
import { TechArsenalSection } from "@/components/sections/TechArsenalSection";
import { FinaleSection } from "@/components/sections/FinaleSection";
import { siteConfig } from "@/config/site";
import {
  apexData,
  apexModules,
  journeyIntro,
  journeyNodes,
} from "@/content/journey";
import { arsenalIntro, arsenalRows } from "@/content/arsenal";

/**
 * Server component: owns the data layer and hands plain, serialisable
 * content down to the client-side experience components.
 */
export default function HomePage() {
  return (
    <SmoothScrollLayout>
      <ExperienceCanvas />
      <main id="main" className="relative z-10">
        <HeroSection
          name={siteConfig.name}
          role={siteConfig.role}
          location={siteConfig.location}
        />
        <TheJourneyTimeline
          intro={journeyIntro}
          nodes={journeyNodes}
          apex={apexData}
          modules={[...apexModules]}
        />
        <TechArsenalSection intro={arsenalIntro} rows={arsenalRows} />
        <FinaleSection
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
