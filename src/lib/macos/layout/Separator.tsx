import * as React from 'react';
import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { cx } from '../../common';


export type SeparatorProps = Omit<React.ComponentPropsWithoutRef<typeof BaseSeparator>, 'className'> & {
  className?: string;
};

export function Separator({ className, ...rest }: SeparatorProps) {
  return <BaseSeparator className={cx('rd-mac rd-mac-separator', className)}  {...rest} />;
}
