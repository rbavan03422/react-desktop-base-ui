import * as React from 'react';

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
