type Props = {
  className?: string;
  fill?: string;
};

/**
 * Simplified Dallas skyline silhouette (Reunion Tower, BoA Plaza, etc).
 * Pure SVG so it scales crisp on mobile. The shop's real mural has the same
 * iconic silhouette behind the red wall.
 */
export default function DallasSkyline({ className = "", fill = "#050505" }: Props) {
  return (
    <svg
      viewBox="0 0 1600 240"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <g fill={fill}>
        {/* baseline ground */}
        <rect x="0" y="220" width="1600" height="20" />

        {/* far left buildings */}
        <rect x="40" y="160" width="60" height="60" />
        <rect x="110" y="140" width="40" height="80" />
        <rect x="160" y="170" width="50" height="50" />

        {/* Reunion Tower (ball on stick) */}
        <rect x="230" y="100" width="14" height="120" />
        <circle cx="237" cy="92" r="22" />
        <circle cx="237" cy="92" r="14" fill="#050505" opacity="0.0" />

        {/* mid risers */}
        <rect x="280" y="80" width="55" height="140" />
        <polygon points="335,80 360,55 385,80 385,220 335,220" />
        <rect x="395" y="120" width="40" height="100" />
        <rect x="445" y="60" width="70" height="160" />
        {/* spire */}
        <polygon points="480,60 480,30 480,30 482,30 482,60" />

        {/* BoA Plaza (tallest, with antenna) */}
        <rect x="540" y="40" width="80" height="180" />
        <polygon points="540,40 580,10 620,40" />
        <rect x="578.5" y="0" width="4" height="14" />
        <rect x="578" y="-2" width="4" height="14" />

        {/* Comerica-ish */}
        <rect x="640" y="70" width="55" height="150" />
        <polygon points="640,70 667,45 695,70" />

        {/* Fountain Place pyramid */}
        <polygon points="720,220 780,55 840,220" />

        {/* mid */}
        <rect x="860" y="90" width="50" height="130" />
        <rect x="920" y="110" width="40" height="110" />
        <rect x="970" y="75" width="60" height="145" />
        <polygon points="970,75 1000,50 1030,75" />

        {/* Trammell Crow-ish */}
        <rect x="1050" y="100" width="70" height="120" />
        <rect x="1130" y="130" width="40" height="90" />

        {/* JPMorgan / Chase */}
        <rect x="1180" y="65" width="80" height="155" />
        <rect x="1216" y="40" width="8" height="30" />

        {/* outer right */}
        <rect x="1275" y="120" width="50" height="100" />
        <rect x="1335" y="100" width="60" height="120" />
        <rect x="1405" y="140" width="40" height="80" />
        <rect x="1455" y="160" width="60" height="60" />
        <rect x="1525" y="180" width="55" height="40" />
      </g>
    </svg>
  );
}
