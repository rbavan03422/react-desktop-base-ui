import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { Tabs } from '@base-ui/react/tabs';
import { cx } from '../common';
import { themed, type Theme } from './shared';

type El<P> = React.ReactElement<P>;
const kids = <P,>(children: React.ReactNode) =>
  React.Children.toArray(children).filter(React.isValidElement) as El<P>[];

/* ---------- NavPane ---------- */
export interface NavPaneItemProps {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  selected?: boolean;
  push?: boolean;
  onSelect?: () => void;
  children?: React.ReactNode;
}
/** Marker component: NavPane reads its props. */
export const NavPaneItem: React.FC<NavPaneItemProps> = () => null;

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

/* ---------- MasterDetailsView ---------- */
export interface MasterProps { push?: boolean; selected?: boolean; width?: number | string; color?: string; theme?: Theme; children?: React.ReactNode }
export interface DetailsProps { background?: boolean | string; color?: string; children?: React.ReactNode }
export const MasterDetailsViewItemMaster: React.FC<MasterProps> = ({ children }) => <>{children}</>;
export const MasterDetailsViewItemDetails: React.FC<DetailsProps> = ({ children }) => <>{children}</>;
export interface MasterDetailsViewItemProps { selected?: boolean; children?: React.ReactNode; theme?: Theme; color?: string }
/** Marker component: MasterDetailsView reads its Master/Details children. */
export const MasterDetailsViewItem: React.FC<MasterDetailsViewItemProps> = ({ children }) => <>{children}</>;

export interface MasterDetailsViewProps {
  theme?: Theme; color?: string; className?: string; style?: React.CSSProperties; children?: React.ReactNode;
}
export function MasterDetailsView({ theme, color, className, style, children }: MasterDetailsViewProps) {
  const items = kids<MasterDetailsViewItemProps>(children);
  const first = Math.max(0, items.findIndex((i) => i.props.selected));
  const [value, setValue] = React.useState(String(first));

  const parts = items.map((it) => {
    const c = kids<any>(it.props.children);
    return {
      master: c.find((k) => k.type === MasterDetailsViewItemMaster) as El<MasterProps> | undefined,
      details: c.find((k) => k.type === MasterDetailsViewItemDetails) as El<DetailsProps> | undefined,
    };
  });

  return (
    <Tabs.Root
      orientation="vertical"
      value={value}
      onValueChange={(v: any) => setValue(String(v))}
      className={cx('rd-win rd-win-mdv', className)}
      {...themed(theme, color, style)}
    >
      <Tabs.List className="rd-win-mdv__masters">
        {parts.map(({ master }, i) => (
          <Tabs.Tab
            key={i} value={String(i)} className="rd-win-mdv__master"
            style={master?.props.width ? { width: master.props.width } : undefined}
          >
            {master?.props.children}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      <div className="rd-win-mdv__details">
        {parts.map(({ details }, i) => (
          <Tabs.Panel
            key={i} value={String(i)} className="rd-win-mdv__panel"
            style={{
              color: details?.props.color,
              background: typeof details?.props.background === 'string' ? details.props.background : undefined,
            }}
          >
            {details?.props.children}
          </Tabs.Panel>
        ))}
      </div>
    </Tabs.Root>
  );
}
