import * as React from 'react';
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { cx } from '../../common';

export interface ToolbarNavItemProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseToolbar.Button>, 'className' | 'title' | 'children'> {
  title?: React.ReactNode; icon?: React.ReactNode; selected?: boolean; onPress?: () => void; className?: string;
}

export function ToolbarNavItem({ title, icon, selected, onPress, className, onClick, ...rest }: ToolbarNavItemProps) {
  return (
    <BaseToolbar.Button
      className={cx('rd-mac-toolbarnav__item', className)}
      data-selected={selected ? '' : undefined}
      aria-pressed={!!selected}
      onClick={(e) => { onClick?.(e); onPress?.(); }}
      {...rest}
    >
      {icon && <span className="rd-mac-toolbarnav__icon">{icon}</span>}
      {title && <span>{title}</span>}
    </BaseToolbar.Button>
  );
}
