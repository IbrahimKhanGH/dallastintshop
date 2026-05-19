type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: Props) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-3xl ${alignCls}`}>
      {eyebrow && (
        <div
          className={`mb-4 inline-flex items-center gap-2 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="h-px w-8 bg-brand-red" />
          <span className="h-display text-xs uppercase tracking-[0.4em] text-brand-red">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="h-display text-4xl uppercase leading-[0.95] text-white sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-base text-white/65 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
