import * as React from 'react';
import { cx, cssVar } from '../../common';
import { TreeViewCore, type TreeViewCoreProps, type TreeViewItem } from '../../common/TreeView';
import type { Themed } from '../shared';

export type { TreeViewItem };

export type TreeViewProps = Omit<TreeViewCoreProps, 'classPrefix' | 'rootClassName' | 'rootStyle' | 'theme'> &
  Themed & { className?: string; style?: React.CSSProperties };

/** A keyboard-navigable hierarchical tree with single-item selection. */
export function TreeView({ theme, color, className, style, ...props }: TreeViewProps) {
  return (
    <TreeViewCore
      {...props}
      classPrefix="rd-win-tree"
      rootClassName={cx('rd-win rd-win-tree', className)}
      rootStyle={{ ...cssVar('--rd-win-accent', color), ...style }}
      theme={theme}
    />
  );
}
