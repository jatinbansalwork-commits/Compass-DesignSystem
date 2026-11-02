import type React from 'react';
import { useId } from 'react';

const KLEARNOW_MARK_PATH =
  'M1123.24 298.455L626.261 11.515C599.554 -3.83834 566.783 -3.83834 540.076 11.515L43.0921 298.455C16.3851 313.808 0 342.322 0 373.157V947.037C0 977.873 16.3851 1006.26 43.0921 1021.74L46.0593 1023.42L384.736 807.05L292.1 1165.47L347.578 1197.46L483.307 672.225L177.789 867.432L226.687 658.549L793.213 296.648L532.851 1304.29L540.334 1308.55C567.041 1323.9 599.813 1323.9 626.52 1308.55L1123.5 1021.61C1150.21 1006.26 1166.6 977.744 1166.6 946.908V373.028C1166.6 342.192 1150.21 313.808 1123.5 298.326L1123.24 298.455Z';

const KlearnowLogoWordmark = ({ textFill }: { textFill: string }): React.ReactElement => {
  const gradientId = useId();

  return (
    <svg
      width="116"
      height="24"
      viewBox="0 0 90 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="KlearNow"
    >
      <g transform="translate(0 1.5) scale(0.0165)">
        <path d={KLEARNOW_MARK_PATH} fill={`url(#${gradientId})`} />
      </g>
      <text
        x="24"
        y="19"
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica Neue, sans-serif"
        fontSize="13.5"
        fontWeight="700"
        fill={textFill}
      >
        KlearNow
      </text>
      <defs>
        <linearGradient
          id={gradientId}
          x1="641"
          y1="0"
          x2="641"
          y2="1320"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9772FF" />
          <stop offset="0.609375" stopColor="#003F5B" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const KlearnowLogo = (): React.ReactElement => {
  return <KlearnowLogoWordmark textFill="#003F5B" />;
};

const KlearnowLogoWhite = (): React.ReactElement => {
  return <KlearnowLogoWordmark textFill="#FFFFFF" />;
};

export { KlearnowLogo, KlearnowLogoWhite };
