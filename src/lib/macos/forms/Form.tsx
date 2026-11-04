import * as React from 'react';
import { Form as BaseForm } from '@base-ui/react/form';
import { cx } from '../../common';


export type FormProps = Omit<React.ComponentPropsWithoutRef<typeof BaseForm>, 'className'> & {
  className?: string;
};

export function Form({ className, ...rest }: FormProps) {
  return <BaseForm className={cx('rd-mac rd-mac-form', className)}  {...rest} />;
}
