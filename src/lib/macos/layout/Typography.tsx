import * as React from 'react';
import { cx } from '../../common';
import { TypographyCore, type TypographyCoreProps } from '../../common/Typography';

export type { TypographyColor, TypographyVariant } from '../../common/Typography';

export type TypographyProps = Omit<TypographyCoreProps, 'classPrefix' | 'rootClassName'>;

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ theme, className, ...props }, ref) => (
    <TypographyCore
      {...props}
      ref={ref}
      classPrefix="rd-mac-typography"
      rootClassName={cx('rd-mac rd-mac-typography', className)}
      theme={theme}
    />
  ),
);
Typography.displayName = 'Typography';
