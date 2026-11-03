import * as React from 'react';

export interface SegmentedControlItemProps {
  title?: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  children?: React.ReactNode;
}

/** Marker component: SegmentedControl reads its props. */
export const SegmentedControlItem: React.FC<SegmentedControlItemProps> = () => null;
