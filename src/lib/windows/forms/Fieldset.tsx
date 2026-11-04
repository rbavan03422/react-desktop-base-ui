import * as React from 'react';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type FieldsetProps = Omit<React.ComponentPropsWithoutRef<typeof BaseFieldset.Root>, 'className'> & {
  legend?: React.ReactNode;
  className?: string;
} & Themed;

export function Fieldset({ theme, color, legend, className, children, ...rest }: FieldsetProps) {
  return (
    <BaseFieldset.Root className={cx('rd-win rd-win-fieldset', className)} {...themed(theme, color)} {...rest}>
      {legend != null && <BaseFieldset.Legend className="rd-win-fieldset__legend">{legend}</BaseFieldset.Legend>}
      {children}
    </BaseFieldset.Root>
  );
}
