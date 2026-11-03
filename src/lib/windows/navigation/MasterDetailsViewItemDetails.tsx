import * as React from 'react';

export interface DetailsProps { background?: boolean | string; color?: string; children?: React.ReactNode }

export const MasterDetailsViewItemDetails: React.FC<DetailsProps> = ({ children }) => <>{children}</>;
