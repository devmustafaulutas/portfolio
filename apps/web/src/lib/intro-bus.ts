type IntroCallback = () => void;

let finished = false;
const callbacks = new Set<IntroCallback>();

/**
 * One-shot synchronisation point between the preloader and everything
 * that must wait for the curtains: the hero entrance plays only after
 * `finish()` fires. Late subscribers (hot reload, remounts) run
 * immediately if the intro already happened.
 */
export const introBus = {
  get finished(): boolean {
    return finished;
  },

  finish(): void {
    if (finished) return;
    finished = true;
    callbacks.forEach((callback) => callback());
    callbacks.clear();
  },

  onFinish(callback: IntroCallback): () => void {
    if (finished) {
      callback();
      return () => undefined;
    }
    callbacks.add(callback);
    return () => callbacks.delete(callback);
  },
};
