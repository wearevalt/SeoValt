"use client";

import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 24) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const SpiderIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="10" r="3" />
    <path d="M12 13v4m-4-7L4 9m4-3L5 4m6 2V2m3 4 3-2m2 7-4-1m-2 5 2 3m-4-3-2 3" />
  </svg>
);

export const RankingArrowIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M7 17V7l5-5 5 5v10" />
    <path d="M9 21h6M12 3v4" />
    <polyline points="9 11 12 8 15 11" />
  </svg>
);

export const MetaTagIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
    <line x1="12" y1="2" x2="12" y2="22" />
  </svg>
);

export const SitemapIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="9" y="2" width="6" height="4" rx="1" />
    <rect x="2" y="18" width="6" height="4" rx="1" />
    <rect x="16" y="18" width="6" height="4" rx="1" />
    <path d="M12 6v4M5 18v-4h14v4" />
  </svg>
);

export const SchemaIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

export const SpeedGaugeIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" />
    <path d="M12 12 8.5 8.5" strokeLinecap="round" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <path d="M22 12a10 10 0 0 1-1 4.33" />
    <path d="M12 6v1M6 12H5M8.5 8.5l-.7-.7" />
  </svg>
);

export const KeywordTargetIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="2" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
  </svg>
);

export const AltTextIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
    <path d="M10 14h4" />
    <path d="M12 12v4" />
  </svg>
);

export const AIBrainIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M9.5 2a2.5 2.5 0 0 1 5 0" />
    <path d="M9 8c-2.8 0-5 2.2-5 5s2.2 5 5 5h6c2.8 0 5-2.2 5-5s-2.2-5-5-5" />
    <path d="M12 8V2" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="10" y1="10" x2="10" y2="14" />
    <line x1="14" y1="10" x2="14" y2="14" />
  </svg>
);

export const LinkChainIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export const SearchCodeIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <path d="M9 9l2 2-2 2M13 13l-2-2 2-2" />
  </svg>
);

export const AutopilotIcon = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
  </svg>
);
