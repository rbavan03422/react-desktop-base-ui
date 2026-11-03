import * as React from 'react';
import type { Theme } from '../shared';

export interface MasterDetailsViewItemProps { selected?: boolean; children?: React.ReactNode; theme?: Theme; color?: string }

/** Marker component: MasterDetailsView reads its Master/Details children. */
export const MasterDetailsViewItem: React.FC<MasterDetailsViewItemProps> = ({ children }) => <>{children}</>;
