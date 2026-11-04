import * as React from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type TooltipProps = {
  content: React.ReactNode;
  /** A single element that receives the hover / focus behaviour. */
  children: React.ReactElement;
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Delay before showing, in ms. */
  delay?: number;
  className?: string;
} & Themed;

export function Tooltip({ theme, content, children, side = 'top', delay, className }: TooltipProps) {
  return (
    <BaseTooltip.Provider delay={delay}>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger render={children} />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner className="rd-mac-positioner" side={side} sideOffset={6}>
            <BaseTooltip.Popup className={cx('rd-mac rd-mac-popup rd-mac-tooltip', className)} {...themed(theme)}>{content}</BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}
