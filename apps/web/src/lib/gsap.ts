import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { TextPlugin } from "gsap/TextPlugin";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

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
    Flip,
    SplitText,
    ScrambleTextPlugin,
  );

  CustomEase.create("monoOut", "0.16, 1, 0.3, 1");
  CustomEase.create("monoInOut", "0.83, 0, 0.17, 1");
  CustomEase.create("snap", "0.7, 0, 0.2, 1");
  // The curtain split: slow grip, violent release, soft landing.
  CustomEase.create("curtain", "0.87, 0, 0.13, 1");

  gsap.defaults({ ease: "monoOut", duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });

  registered = true;
  return gsap;
}

export {
  gsap,
  ScrollTrigger,
  CustomEase,
  TextPlugin,
  Flip,
  SplitText,
  ScrambleTextPlugin,
};
