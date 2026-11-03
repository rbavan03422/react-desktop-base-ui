import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { Tabs } from '@base-ui/react/tabs';
import { cx } from '../../common';
import { themed, type Theme } from '../shared';
import { kids } from './utils';
import type { NavPaneItemProps } from './NavPaneItem';

export interface NavPaneProps {
  canPaneToggle?: boolean;
  defaultIsPaneExpanded?: boolean;
  onPaneToggle?: (expanded: boolean) => void;
  paneCompactedLength?: number;
  paneExpandedLength?: number;
  theme?: Theme;
  color?: string;
  push?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function NavPane({
  canPaneToggle = true, defaultIsPaneExpanded = true, onPaneToggle,
  paneCompactedLength = 48, paneExpandedLength = 320, theme, color, className, style, children,
}: NavPaneProps) {
  const items = kids<NavPaneItemProps>(children);
  const firstSelected = Math.max(0, items.findIndex((i) => i.props.selected));
  const [value, setValue] = React.useState(String(firstSelected));
  const [expanded, setExpanded] = React.useState(defaultIsPaneExpanded);

  return (
    <Tabs.Root
      orientation="vertical"
      value={value}
      onValueChange={(v: any) => { setValue(String(v)); items[Number(v)]?.props.onSelect?.(); }}
      className={cx('rd-win rd-win-navpane', className)}
      {...themed(theme, color, style)}
    >
      <div className="rd-win-navpane__pane" style={{ width: expanded ? paneExpandedLength : paneCompactedLength }}>
        {canPaneToggle && (
          <BaseButton
            aria-label="Toggle navigation pane"
            aria-expanded={expanded}
            className="rd-win-navpane__toggle"
            onClick={() => { setExpanded(!expanded); onPaneToggle?.(!expanded); }}
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden><path d="M1 3.5h14M1 8h14M1 12.5h14" stroke="currentColor" /></svg>
          </BaseButton>
        )}
        <Tabs.List className="rd-win-navpane__list">
          {items.map((it, i) => (
            <Tabs.Tab key={it.key ?? i} value={String(i)} className="rd-win-navpane__item">
              <span className="rd-win-navpane__icon">{it.props.icon}</span>
              {expanded && <span className="rd-win-navpane__title">{it.props.title}</span>}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </div>
      <div className="rd-win-navpane__content">
        {items.map((it, i) => (
          <Tabs.Panel key={it.key ?? i} value={String(i)} className="rd-win-navpane__panel">{it.props.children}</Tabs.Panel>
        ))}
      </div>
    </Tabs.Root>
  );
}
