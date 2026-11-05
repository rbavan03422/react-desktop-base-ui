import * as React from 'react';
import { cx } from './index';

export type TypographyVariant =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'subtitle1' | 'subtitle2' | 'body1' | 'body2'
  | 'button' | 'caption' | 'overline' | 'inherit';

export type TypographyColor =
  | 'initial' | 'inherit' | 'primary' | 'secondary'
  | 'textPrimary' | 'textSecondary' | 'error' | 'warning' | 'info' | 'success';

export type TypographyProps = Omit<React.HTMLAttributes<HTMLElement>, 'color'> & {
  variant?: TypographyVariant;
  variantMapping?: Partial<Record<TypographyVariant, React.ElementType>>;
  component?: React.ElementType;
  color?: TypographyColor | string;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  display?: 'initial' | 'block' | 'inline';
  gutterBottom?: boolean;
  paragraph?: boolean;
  noWrap?: boolean;
  theme?: 'light' | 'dark';
};

const defaultMapping: Record<TypographyVariant, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  button: 'span',
  caption: 'span',
  overline: 'span',
  inherit: 'p',
};

const paletteColors = new Set<TypographyColor>([
  'initial', 'inherit', 'primary', 'secondary', 'textPrimary', 'textSecondary',
  'error', 'warning', 'info', 'success',
]);

export interface TypographyCoreProps extends TypographyProps {
  classPrefix: string;
  rootClassName: string;
}

export const TypographyCore = React.forwardRef<HTMLElement, TypographyCoreProps>(
  function TypographyCore(
    {
      variant = 'body1', variantMapping, component, color, align, display,
      gutterBottom, paragraph, noWrap, classPrefix, rootClassName, className,
      theme, style, ...rest
    },
    ref,
  ) {
    const Component = component ?? (paragraph ? 'p' : variantMapping?.[variant] ?? defaultMapping[variant]);
    const colorName = color && paletteColors.has(color as TypographyColor) ? color : undefined;
    const customColor = color && !colorName ? color : undefined;
    return (
      <Component
        {...rest}
        ref={ref}
        className={cx(rootClassName, `${classPrefix}--${variant}`, className)}
        data-variant={variant}
        data-color={colorName}
        data-align={align}
        data-display={display}
        data-gutter-bottom={gutterBottom ? '' : undefined}
        data-paragraph={paragraph ? '' : undefined}
        data-nowrap={noWrap ? '' : undefined}
        data-rd-theme={theme}
        style={{ color: customColor, ...style }}
      />
    );
  },
);
