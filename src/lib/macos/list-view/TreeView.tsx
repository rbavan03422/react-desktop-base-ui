import * as React from 'react';
import { cx } from '../../common';
import { TreeViewCore, type TreeViewCoreProps, type TreeViewItem } from '../../common/TreeView';
import type { Themed } from '../shared';

export type { TreeViewItem };

export type TreeViewProps = Omit<TreeViewCoreProps, 'classPrefix' | 'rootClassName' | 'rootStyle' | 'theme'> &
  Themed & { className?: string; style?: React.CSSProperties };

/** A keyboard-navigable hierarchical tree with single-item selection. */
export function TreeView({ theme, className, style, ...props }: TreeViewProps) {
  return (
    <TreeViewCore
      {...props}
      classPrefix="rd-mac-tree"
      rootClassName={cx('rd-mac rd-mac-tree', className)}
      rootStyle={style}
      theme={theme}
    />
  );
}
