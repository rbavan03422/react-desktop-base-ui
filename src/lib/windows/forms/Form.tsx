import * as React from 'react';
import { Form as BaseForm } from '@base-ui/react/form';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type FormProps = Omit<React.ComponentPropsWithoutRef<typeof BaseForm>, 'className'> & {
  className?: string;
} & Themed;

export function Form({ theme, color, className, ...rest }: FormProps) {
  return <BaseForm className={cx('rd-win rd-win-form', className)} {...themed(theme, color)} {...rest} />;
}
