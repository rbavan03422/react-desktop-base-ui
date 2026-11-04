import * as React from 'react';
import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type SeparatorProps = Omit<React.ComponentPropsWithoutRef<typeof BaseSeparator>, 'className'> & {
  className?: string;
} & Themed;

export function Separator({ theme, className, ...rest }: SeparatorProps) {
  return <BaseSeparator className={cx('rd-mac rd-mac-separator', className)} {...themed(theme)} {...rest} />;
}
