import * as React from 'react';

export function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="rd-win-grid__star" data-filled={filled ? '' : undefined} viewBox="0 0 24 24" width="14" height="14" aria-hidden>
      <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9z" strokeLinejoin="round" />
    </svg>
  );
}
