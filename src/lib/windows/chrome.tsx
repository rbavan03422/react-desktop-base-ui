import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cx } from '../common';
import { themed, type Theme } from './shared';

export interface TitleBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'color'> {
  title?: React.ReactNode;
  controls?: boolean;
  isMaximized?: boolean;
  background?: string;
  color?: string;
  theme?: Theme;
  onMinimizeClick?: () => void;
  onMaximizeClick?: () => void;
  onRestoreDownClick?: () => void;
  onCloseClick?: () => void;
}

const g = { fill: 'none', stroke: 'currentColor', strokeWidth: 1 } as const;
const Min = () => <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden><path d="M0 5.5h10" {...g} /></svg>;
const Max = () => <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden><rect x="0.5" y="0.5" width="9" height="9" {...g} /></svg>;
const Restore = () => (
  <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden>
    <rect x="0.5" y="2.5" width="7" height="7" {...g} /><path d="M2.5 2.5V.5h7v7h-2" {...g} />
  </svg>
);
const Close = () => <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden><path d="M0 0l10 10M10 0L0 10" {...g} /></svg>;

export function TitleBar({
  title, controls, isMaximized, background, color, theme, className, style, children,
  onMinimizeClick, onMaximizeClick, onRestoreDownClick, onCloseClick, ...rest
}: TitleBarProps) {
  return (
    <div
      className={cx('rd-win rd-win-titlebar', className)}
      {...themed(theme, undefined, { background, color, ...style })}
      {...rest}
    >
      <div className="rd-win-titlebar__title">{title ?? children}</div>
      {controls && (
        <div className="rd-win-titlebar__controls">
          <BaseButton aria-label="Minimize" className="rd-win-tb" onClick={onMinimizeClick}><Min /></BaseButton>
          <BaseButton
            aria-label={isMaximized ? 'Restore down' : 'Maximize'}
            className="rd-win-tb"
            onClick={isMaximized ? onRestoreDownClick : onMaximizeClick}
          >
            {isMaximized ? <Restore /> : <Max />}
          </BaseButton>
          <BaseButton aria-label="Close" className="rd-win-tb rd-win-tb--close" onClick={onCloseClick}><Close /></BaseButton>
        </div>
      )}
    </div>
  );
}
