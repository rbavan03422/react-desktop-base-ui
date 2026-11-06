import * as React from 'react';

const base = { viewBox: '0 0 24 24', width: 18, height: 18, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false } as const;
type P = { size?: number };
const svg = (size: number | undefined, children: React.ReactNode) => (
  <svg {...base} width={size ?? 18} height={size ?? 18}>{children}</svg>
);

export const BackIcon = ({ size }: P) => svg(size, <path d="M15 5l-7 7 7 7" />);
export const GearIcon = ({ size }: P) => svg(size, <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></>);
export const PhoneIcon = ({ size }: P) => svg(size, <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />);
export const HangUpIcon = ({ size }: P) => svg(size, <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1M2.1 4.2A2 2 0 014.1 2h3a2 2 0 012 1.7M2 2l20 20" />);
export const VideoIcon = ({ size }: P) => svg(size, <><rect x="2" y="6" width="13" height="12" rx="2" /><path d="M22 8l-7 4 7 4z" /></>);
export const VideoOffIcon = ({ size }: P) => svg(size, <><path d="M16 16v1a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2h2m5 0h3a2 2 0 012 2v3l6-4v10M2 2l20 20" /></>);
export const MicIcon = ({ size }: P) => svg(size, <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v4" /></>);
export const MicOffIcon = ({ size }: P) => svg(size, <><path d="M9 9v2a3 3 0 005.1 2.1M15 9.3V5a3 3 0 00-5.9-.8M5 11a7 7 0 0011.3 5.5M19 11a7 7 0 01-.6 2.8M12 18v4M2 2l20 20" /></>);
export const SpeakerIcon = ({ size }: P) => svg(size, <><path d="M11 5L6 9H2v6h4l5 4z" /><path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" /></>);
export const SendIcon = ({ size }: P) => svg(size, <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />);
export const LogoIcon = ({ size }: P) => svg(size ?? 44, <path d="M21 11.5a8.4 8.4 0 01-9 8.4 8.6 8.6 0 01-3.7-.8L3 21l1.9-5A8.4 8.4 0 1121 11.5z" />);
