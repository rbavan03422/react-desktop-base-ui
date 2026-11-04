import * as React from 'react';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type FieldsetProps = Omit<React.ComponentPropsWithoutRef<typeof BaseFieldset.Root>, 'className'> & {
  legend?: React.ReactNode;
  className?: string;
} & Themed;

export function Fieldset({ theme, legend, className, children, ...rest }: FieldsetProps) {
  return (
    <BaseFieldset.Root className={cx('rd-mac rd-mac-fieldset', className)} {...themed(theme)} {...rest}>
      {legend != null && <BaseFieldset.Legend className="rd-mac-fieldset__legend">{legend}</BaseFieldset.Legend>}
      {children}
    </BaseFieldset.Root>
  );
}
