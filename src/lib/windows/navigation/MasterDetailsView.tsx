import * as React from 'react';
import { Tabs } from '@base-ui/react/tabs';
import { cx } from '../../common';
import { themed, type Theme } from '../shared';
import { type El, kids } from './utils';
import { MasterDetailsViewItemMaster, type MasterProps } from './MasterDetailsViewItemMaster';
import { type DetailsProps, MasterDetailsViewItemDetails } from './MasterDetailsViewItemDetails';
import type { MasterDetailsViewItemProps } from './MasterDetailsViewItem';

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
