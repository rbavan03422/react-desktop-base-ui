import * as React from 'react';

export type El<P> = React.ReactElement<P>;

export const kids = <P,>(children: React.ReactNode) =>
  React.Children.toArray(children).filter(React.isValidElement) as El<P>[];
