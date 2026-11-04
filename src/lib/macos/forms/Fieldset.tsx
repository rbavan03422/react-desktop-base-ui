import * as React from 'react';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { cx } from '../../common';


export type FieldsetProps = Omit<React.ComponentPropsWithoutRef<typeof BaseFieldset.Root>, 'className'> & {
  legend?: React.ReactNode;
  className?: string;
};

export function Fieldset({ legend, className, children, ...rest }: FieldsetProps) {
  return (
    <BaseFieldset.Root className={cx('rd-mac rd-mac-fieldset', className)}  {...rest}>
      {legend != null && <BaseFieldset.Legend className="rd-mac-fieldset__legend">{legend}</BaseFieldset.Legend>}
      {children}
    </BaseFieldset.Root>
  );
}
