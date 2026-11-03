import * as React from 'react';
import type { Theme } from '../shared';

export interface MasterProps { push?: boolean; selected?: boolean; width?: number | string; color?: string; theme?: Theme; children?: React.ReactNode }

export const MasterDetailsViewItemMaster: React.FC<MasterProps> = ({ children }) => <>{children}</>;
