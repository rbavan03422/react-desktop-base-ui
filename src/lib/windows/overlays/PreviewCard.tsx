import * as React from 'react';
import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type PreviewCardProps = {
  /** URL the link points to. */
  href: string;
  /** The link text. */
  children: React.ReactNode;
  /** What the card shows while the link is hovered or keyboard-focused. */
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
} & Themed;

/** A link whose destination is previewed in a card on hover (visual enhancement; not announced by screen readers). */
export function PreviewCard({ theme, color, href, children, content, side, align, className }: PreviewCardProps) {
  return (
    <BasePreviewCard.Root>
      <BasePreviewCard.Trigger href={href} className="rd-win-previewlink">{children}</BasePreviewCard.Trigger>
      <BasePreviewCard.Portal>
        <BasePreviewCard.Positioner className="rd-win-positioner" side={side} align={align} sideOffset={8}>
          <BasePreviewCard.Popup className={cx('rd-win rd-win-popup rd-win-previewcard', className)} {...themed(theme, color)}>{content}</BasePreviewCard.Popup>
        </BasePreviewCard.Positioner>
      </BasePreviewCard.Portal>
    </BasePreviewCard.Root>
  );
}
