/**
 * Sinematik film greni · tüm sayfanın üzerinde sabit, tıklamayı
 * engellemeyen SVG gürültü katmanı. Animasyonu CSS'te;
 * prefers-reduced-motion altında durur.
 */
export default function FilmGrain() {
  return <div aria-hidden className="film-grain" />;
}
