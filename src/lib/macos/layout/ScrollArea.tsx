import * as React from 'react';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type ScrollAreaProps = Omit<React.ComponentPropsWithoutRef<typeof BaseScrollArea.Root>, 'className' | 'children'> & {
  className?: string;
  /** Also render a horizontal scrollbar. */
  horizontal?: boolean;
  children?: React.ReactNode;
} & Themed;

export function ScrollArea({ theme, className, horizontal, children, ...rest }: ScrollAreaProps) {
  return (
    <BaseScrollArea.Root className={cx('rd-mac rd-mac-scroll', className)} {...themed(theme)} {...rest}>
      <BaseScrollArea.Viewport className="rd-mac-scroll__viewport">
        <BaseScrollArea.Content>{children}</BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar orientation="vertical" className="rd-mac-scroll__bar">
        <BaseScrollArea.Thumb className="rd-mac-scroll__thumb" />
      </BaseScrollArea.Scrollbar>
      {horizontal && (
        <BaseScrollArea.Scrollbar orientation="horizontal" className="rd-mac-scroll__bar">
          <BaseScrollArea.Thumb className="rd-mac-scroll__thumb" />
        </BaseScrollArea.Scrollbar>
      )}
      <BaseScrollArea.Corner />
    </BaseScrollArea.Root>
  );
}
