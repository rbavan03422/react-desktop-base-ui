import * as React from 'react';
import { NavigationMenu as BaseNav } from '@base-ui/react/navigation-menu';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type NavigationMenuLinkData = { label: React.ReactNode; href: string; description?: React.ReactNode };
export type NavigationMenuItemData = {
  label: React.ReactNode;
  /** A plain link (no flyout). */
  href?: string;
  /** Flyout links shown under the item. */
  links?: NavigationMenuLinkData[];
};

export type NavigationMenuProps = {
  items: NavigationMenuItemData[];
  className?: string;
} & Themed;

/** Windows top navigation bar with flyouts. */
export function NavigationMenu({ theme, color, items, className }: NavigationMenuProps) {
  return (
    <BaseNav.Root className={cx('rd-win rd-win-nav', className)} {...themed(theme, color)}>
      <BaseNav.List className="rd-win-nav__list">
        {items.map((item, i) => (
          <BaseNav.Item key={i} value={String(i)}>
            {item.links ? (
              <>
                <BaseNav.Trigger className="rd-win-nav__trigger">
                  {item.label}
                  <BaseNav.Icon className="rd-win-nav__icon"><svg viewBox="0 0 12 8" width="10" height="7" aria-hidden><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg></BaseNav.Icon>
                </BaseNav.Trigger>
                <BaseNav.Content className="rd-win-nav__content">
                  <ul className="rd-win-nav__links">
                    {item.links.map((link, j) => (
                      <li key={j}>
                        <BaseNav.Link href={link.href} className="rd-win-nav__link">
                          <span className="rd-win-nav__linktitle">{link.label}</span>
                          {link.description && <span className="rd-win-nav__linkdesc">{link.description}</span>}
                        </BaseNav.Link>
                      </li>
                    ))}
                  </ul>
                </BaseNav.Content>
              </>
            ) : (
              <BaseNav.Link href={item.href} className="rd-win-nav__trigger">{item.label}</BaseNav.Link>
            )}
          </BaseNav.Item>
        ))}
      </BaseNav.List>
      <BaseNav.Portal>
        <BaseNav.Positioner className="rd-win-positioner" sideOffset={4} align="start">
          <BaseNav.Popup className="rd-win rd-win-popup rd-win-nav__popup" {...themed(theme, color)}>
            <BaseNav.Viewport />
          </BaseNav.Popup>
        </BaseNav.Positioner>
      </BaseNav.Portal>
    </BaseNav.Root>
  );
}
