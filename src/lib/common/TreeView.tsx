import * as React from 'react';
import { cx } from './index';

export type TreeViewItem = {
  id: string;
  label: React.ReactNode;
  children?: TreeViewItem[];
  icon?: React.ReactNode;
  disabled?: boolean;
};

export interface TreeViewCoreProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'className' | 'style'> {
  items: TreeViewItem[];
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectedChange?: (id: string | null, item?: TreeViewItem) => void;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  classPrefix: string;
  rootClassName: string;
  rootStyle?: React.CSSProperties;
  theme?: 'light' | 'dark';
}

function firstEnabled(items: TreeViewItem[]): string | null {
  for (const item of items) {
    if (!item.disabled) return item.id;
    const child = firstEnabled(item.children ?? []);
    if (child) return child;
  }
  return null;
}

export function TreeViewCore({
  items, selectedId, defaultSelectedId = null, onSelectedChange,
  expandedIds, defaultExpandedIds = [], onExpandedChange,
  classPrefix, rootClassName, rootStyle, theme, onKeyDown, ...rootProps
}: TreeViewCoreProps) {
  const [innerSelectedId, setInnerSelectedId] = React.useState<string | null>(defaultSelectedId);
  const selected = selectedId !== undefined ? selectedId : innerSelectedId;
  const [innerExpandedIds, setInnerExpandedIds] = React.useState<string[]>(defaultExpandedIds);
  const expandedSet = React.useMemo(() => new Set(expandedIds ?? innerExpandedIds), [expandedIds, innerExpandedIds]);
  const [activeId, setActiveId] = React.useState<string | null>(
    () => defaultSelectedId ?? selectedId ?? firstEnabled(items),
  );
  const itemRefs = React.useRef(new Map<string, HTMLDivElement>());
  const itemsById = React.useMemo(() => {
    const map = new Map<string, TreeViewItem>();
    const visit = (nodes: TreeViewItem[]) => nodes.forEach((item) => {
      map.set(item.id, item);
      visit(item.children ?? []);
    });
    visit(items);
    return map;
  }, [items]);

  const visibleItems = React.useMemo(() => {
    const result: TreeViewItem[] = [];
    const visit = (nodes: TreeViewItem[]) => nodes.forEach((item) => {
      result.push(item);
      if (expandedSet.has(item.id)) visit(item.children ?? []);
    });
    visit(items);
    return result;
  }, [items, expandedSet]);

  React.useEffect(() => {
    if (activeId && visibleItems.some((item) => item.id === activeId && !item.disabled)) return;
    const selectedIsVisible = selected != null && visibleItems.some((item) => item.id === selected && !item.disabled);
    setActiveId(selectedIsVisible ? selected : visibleItems.find((item) => !item.disabled)?.id ?? null);
  }, [activeId, selected, visibleItems]);

  const selectItem = (item: TreeViewItem) => {
    if (item.disabled) return;
    if (selectedId === undefined) setInnerSelectedId(item.id);
    onSelectedChange?.(item.id, item);
  };

  const setExpanded = (item: TreeViewItem, expand: boolean) => {
    const next = new Set(expandedSet);
    if (expand) next.add(item.id);
    else next.delete(item.id);
    const ids = Array.from(next);
    if (expandedIds === undefined) setInnerExpandedIds(ids);
    onExpandedChange?.(ids);
  };

  const focusItem = (item: TreeViewItem) => {
    if (item.disabled) return;
    setActiveId(item.id);
    selectItem(item);
    itemRefs.current.get(item.id)?.focus();
  };

  const toggleItem = (item: TreeViewItem) => {
    if (!item.children?.length) return;
    const expand = !expandedSet.has(item.id);
    setExpanded(item, expand);
    if (!expand && itemRefs.current.get(item.id)?.contains(document.activeElement)) {
      setActiveId(item.id);
      itemRefs.current.get(item.id)?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const target = event.target as HTMLElement;
    const currentElement = target.closest<HTMLElement>('[data-tree-id]');
    const currentId = currentElement?.dataset.treeId;
    const current = currentId ? itemsById.get(currentId) : undefined;
    if (!current) return;
    const index = visibleItems.findIndex((item) => item.id === current.id);
    const focusAt = (position: number) => {
      const item = visibleItems[position];
      if (!item) return;
      event.preventDefault();
      focusItem(item);
    };

    switch (event.key) {
      case 'ArrowDown': {
        const next = visibleItems.findIndex((item, i) => i > index && !item.disabled);
        if (next >= 0) focusAt(next);
        else event.preventDefault();
        break;
      }
      case 'ArrowUp': {
        let previous = index - 1;
        while (previous >= 0 && visibleItems[previous].disabled) previous--;
        if (previous >= 0) focusAt(previous);
        else event.preventDefault();
        break;
      }
      case 'Home': {
        const first = visibleItems.findIndex((item) => !item.disabled);
        if (first >= 0) focusAt(first);
        break;
      }
      case 'End': {
        let last = visibleItems.length - 1;
        while (last >= 0 && visibleItems[last].disabled) last--;
        if (last >= 0) focusAt(last);
        break;
      }
      case 'ArrowRight':
        if (current.children?.length) {
          event.preventDefault();
          if (!expandedSet.has(current.id)) setExpanded(current, true);
          else {
            const child = current.children?.find((item) => !item.disabled);
            if (child) focusItem(child);
          }
        }
        break;
      case 'ArrowLeft': {
        if (current.children?.length && expandedSet.has(current.id)) {
          event.preventDefault();
          setExpanded(current, false);
        } else {
          const parent = visibleItems.slice(0, index).reverse().find((item) =>
            item.children?.some((child) => child.id === current.id) ||
            containsItem(item.children ?? [], current.id),
          );
          if (parent) {
            event.preventDefault();
            focusItem(parent);
          }
        }
        break;
      }
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectItem(current);
        break;
    }
  };

  const containsItem = (nodes: TreeViewItem[], id: string): boolean =>
    nodes.some((item) => item.id === id || containsItem(item.children ?? [], id));

  const renderItems = (nodes: TreeViewItem[], level: number): React.ReactNode =>
    nodes.map((item, index) => {
      const hasChildren = !!item.children?.length;
      const expanded = hasChildren && expandedSet.has(item.id);
      const name = typeof item.label === 'string' || typeof item.label === 'number' ? String(item.label) : 'item';
      return (
        <div
          key={item.id}
          ref={(element) => {
            if (element) itemRefs.current.set(item.id, element);
            else itemRefs.current.delete(item.id);
          }}
          role="treeitem"
          aria-level={level}
          aria-posinset={index + 1}
          aria-setsize={nodes.length}
          aria-expanded={hasChildren ? expanded : undefined}
          aria-selected={selected === item.id}
          aria-disabled={item.disabled || undefined}
          tabIndex={activeId === item.id ? 0 : -1}
          data-tree-id={item.id}
          className={`${classPrefix}__item`}
        >
          <div
            className={`${classPrefix}__row`}
            style={{ paddingLeft: 4 + (level - 1) * 16 }}
            onClick={() => {
              if (!item.disabled) {
                setActiveId(item.id);
                selectItem(item);
                itemRefs.current.get(item.id)?.focus();
              }
            }}
          >
            {hasChildren ? (
              <button
                type="button"
                tabIndex={-1}
                disabled={item.disabled}
                aria-label={`${expanded ? 'Collapse' : 'Expand'} ${name}`}
                className={`${classPrefix}__toggle`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={(event) => {
                  event.stopPropagation();
                  if (!item.disabled) {
                    setActiveId(item.id);
                    selectItem(item);
                    itemRefs.current.get(item.id)?.focus();
                    toggleItem(item);
                  }
                }}
              >
                <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden>
                  <path d="m5 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : <span className={`${classPrefix}__toggle-spacer`} aria-hidden />}
            {item.icon != null && <span className={`${classPrefix}__icon`} aria-hidden>{item.icon}</span>}
            <span className={`${classPrefix}__label`}>{item.label}</span>
          </div>
          {expanded && (
            <div role="group" className={`${classPrefix}__group`}>
              {renderItems(item.children ?? [], level + 1)}
            </div>
          )}
        </div>
      );
    });

  return (
    <div
      {...rootProps}
      role="tree"
      className={rootClassName}
      style={rootStyle}
      data-rd-theme={theme}
      tabIndex={visibleItems.some((item) => !item.disabled) ? rootProps.tabIndex : rootProps.tabIndex ?? 0}
      onKeyDown={handleKeyDown}
    >
      {renderItems(items, 1)}
    </div>
  );
}
