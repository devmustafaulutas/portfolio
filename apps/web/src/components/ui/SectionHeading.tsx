type SectionHeadingProps = {
  label: string;
  title: string;
  lede?: string;
  className?: string;
};

/**
 * Bölüm başlığı deseni: mono etiket + dev display başlık + kısa lede.
 * Görünme animasyonunu bölümün kendisi ([data-reveal]) yönetir.
 */
export default function SectionHeading({ label, title, lede, className }: SectionHeadingProps) {
  return (
    <header className={className} data-reveal>
      <p className="font-mono text-[11px] tracking-[0.3em] opacity-55">{label}</p>
      <h2 className="mt-5 font-display text-[clamp(2.6rem,7vw,5.5rem)] uppercase leading-[0.92]">
        {title}
      </h2>
      {lede ? <p className="mt-6 max-w-xl text-base leading-relaxed opacity-70 md:text-lg">{lede}</p> : null}
    </header>
  );
}
