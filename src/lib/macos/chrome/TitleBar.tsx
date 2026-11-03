import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cx } from '../../common';

export interface TitleBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  controls?: boolean;
  isFullscreen?: boolean;
  inset?: boolean;
  transparent?: boolean;
  onCloseClick?: () => void;
  onMinimizeClick?: () => void;
  onMaximizeClick?: () => void;
  onResizeClick?: () => void;
}

export function TitleBar({
  title, controls, isFullscreen, inset, transparent, className, children,
  onCloseClick, onMinimizeClick, onMaximizeClick, onResizeClick, ...rest
}: TitleBarProps) {
  return (
    <div
      className={cx('rd-mac rd-mac-titlebar', inset && 'rd-mac-titlebar--inset', transparent && 'rd-mac-titlebar--transparent', className)}
      data-fullscreen={isFullscreen ? '' : undefined}
      {...rest}
    >
      <div className="rd-mac-titlebar__row">
        {controls && (
          <div className="rd-mac-titlebar__controls">
            <BaseButton aria-label="Close" className="rd-mac-light rd-mac-light--close" onClick={onCloseClick} />
            <BaseButton aria-label="Minimize" className="rd-mac-light rd-mac-light--min" onClick={onMinimizeClick} />
            <BaseButton
              aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
              className="rd-mac-light rd-mac-light--max"
              onClick={isFullscreen ? onResizeClick : onMaximizeClick ?? onResizeClick}
            />
          </div>
        )}
        {title != null && <div className="rd-mac-titlebar__title">{title}</div>}
      </div>
      {children != null && <div className="rd-mac-titlebar__extra">{children}</div>}
    </div>
  );
}
