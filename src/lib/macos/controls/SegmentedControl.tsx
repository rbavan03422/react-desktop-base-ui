import * as React from 'react';
import { Toggle } from '@base-ui/react/toggle';
import { cx } from '../../common';
import type { SegmentedControlItemProps } from './SegmentedControlItem';

export interface SegmentedControlProps { box?: boolean; className?: string; style?: React.CSSProperties; children?: React.ReactNode }

export function SegmentedControl({ box, className, style, children }: SegmentedControlProps) {
  const items = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<SegmentedControlItemProps>[];
  const active = items.find((i) => i.props.selected);
  return (
    <div className={cx('rd-mac rd-mac-segmented', box && 'rd-mac-segmented--box', className)} style={style}>
      <div role="group" className="rd-mac-segmented__bar">
        {items.map((it, i) => (
          <Toggle
            key={it.key ?? i}
            className="rd-mac-segment"
            pressed={!!it.props.selected}
            onPressedChange={() => it.props.onSelect?.()}
          >
            {it.props.title}
          </Toggle>
        ))}
      </div>
      {box && active && <div className="rd-mac-segmented__box">{active.props.children}</div>}
    </div>
  );
}
