// ============================================================
// Açılış sekansı ile scroll/hero arasındaki koordinasyon.
// Boot bitince: Lenis serbest kalır, hero giriş animasyonu oynar.
// ============================================================

type Listener = () => void;

let done = false;
const listeners = new Set<Listener>();

export const bootBus = {
  isDone(): boolean {
    return done;
  },
  complete(): void {
    if (done) return;
    done = true;
    listeners.forEach((listener) => listener());
    listeners.clear();
  },
  /** Boot zaten bittiyse callback hemen çalışır. Unsubscribe döner. */
  onComplete(callback: Listener): () => void {
    if (done) {
      callback();
      return () => {};
    }
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  },
};
