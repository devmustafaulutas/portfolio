import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { TextPlugin } from "gsap/TextPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { SplitText } from "gsap/SplitText";

let registered = false;

/**
 * Registers every GSAP plugin and custom ease exactly once, on the
 * client only. Every animated component calls this before building
 * its timelines, so import order never matters.
 */
export function ensureGsap(): typeof gsap {
  if (registered || typeof window === "undefined") {
    return gsap;
  }

  gsap.registerPlugin(
    ScrollTrigger,
    CustomEase,
    TextPlugin,
    MotionPathPlugin,
    SplitText,
  );

  CustomEase.create("deepOut", "0.16, 1, 0.3, 1");
  CustomEase.create("deepInOut", "0.83, 0, 0.17, 1");
  CustomEase.create("surge", "0.7, 0, 0.2, 1");

  gsap.defaults({ ease: "deepOut", duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });

  registered = true;
  return gsap;
}

export { gsap, ScrollTrigger, CustomEase, TextPlugin, MotionPathPlugin, SplitText };
