import * as React from 'react';
import { cx } from './index';

export type MaterialColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

const nextId = (() => {
  let id = 0;
  return (prefix: string) => `${prefix}-${++id}`;
})();

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  alt?: string;
  src?: string;
  variant?: 'circular' | 'rounded' | 'square';
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ alt, src, variant = 'circular', className, children, imgProps, ...props }, ref) => (
    <div {...props} ref={ref} className={cx('rd-material-avatar', `rd-material-avatar--${variant}`, className)}>
      {src ? <img {...imgProps} src={src} alt={alt ?? ''} /> : children ?? (alt ? alt.slice(0, 1).toUpperCase() : null)}
    </div>
  ),
);
Avatar.displayName = 'Avatar';

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  children: React.ReactNode;
  badgeContent?: React.ReactNode;
  color?: Exclude<MaterialColor, 'default'>;
  variant?: 'standard' | 'dot';
  max?: number;
  showZero?: boolean;
  invisible?: boolean;
  overlap?: 'rectangular' | 'circular';
  anchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'right' };
}

export function Badge({
  children, badgeContent, color = 'error', variant = 'standard', max = 99, showZero = false,
  invisible = false, overlap = 'rectangular', anchorOrigin = { vertical: 'top', horizontal: 'right' },
  className, ...props
}: BadgeProps) {
  const numeric = typeof badgeContent === 'number';
  const empty = badgeContent == null || (numeric && badgeContent === 0 && !showZero);
  const content = numeric && badgeContent > max ? `${max}+` : badgeContent;
  return (
    <span {...props} className={cx('rd-material-badge-root', className)}>
      {children}
      {!invisible && !empty && (
        <span
          className={cx(
            'rd-material-badge',
            `rd-material-badge--${color}`,
            `rd-material-badge--${variant}`,
            `rd-material-badge--${anchorOrigin.vertical}-${anchorOrigin.horizontal}`,
            `rd-material-badge--${overlap}`,
          )}
          aria-label={variant === 'dot' ? 'Notification' : typeof badgeContent === 'string' || typeof badgeContent === 'number' ? String(badgeContent) : undefined}
        >
          {variant === 'dot' ? null : content}
        </span>
      )}
    </span>
  );
}

export interface ChipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  label?: React.ReactNode;
  avatar?: React.ReactNode;
  icon?: React.ReactNode;
  deleteIcon?: React.ReactNode;
  color?: MaterialColor;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
  disabled?: boolean;
  clickable?: boolean;
  onDelete?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({
    label, avatar, icon, deleteIcon, color = 'default', variant = 'filled', size = 'medium',
    disabled = false, clickable = false, onClick, onDelete, className, ...props
  }, ref) => (
    <div
      {...props}
      ref={ref}
      role={onClick ? 'button' : undefined}
      tabIndex={!disabled && onClick ? 0 : undefined}
      aria-disabled={disabled || undefined}
      className={cx(
        'rd-material-chip',
        `rd-material-chip--${color}`,
        `rd-material-chip--${variant}`,
        `rd-material-chip--${size}`,
        (onClick || clickable) && 'rd-material-chip--clickable',
        disabled && 'rd-material-chip--disabled',
        className,
      )}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (!disabled && (event.key === 'Enter' || event.key === ' ') && onClick) {
          event.preventDefault();
          event.currentTarget.click();
        }
      }}
    >
      {avatar && <span className="rd-material-chip__avatar">{avatar}</span>}
      {!avatar && icon && <span className="rd-material-chip__icon">{icon}</span>}
      {label != null && <span className="rd-material-chip__label">{label}</span>}
      {onDelete && (
        <button
          type="button"
          className="rd-material-chip__delete"
          aria-label="Remove"
          disabled={disabled}
          onClick={(event) => { event.stopPropagation(); onDelete(event); }}
        >
          {deleteIcon ?? '×'}
        </button>
      )}
    </div>
  ),
);
Chip.displayName = 'Chip';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'fullWidth' | 'inset' | 'middle';
  flexItem?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  light?: boolean;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = 'horizontal', variant = 'fullWidth', flexItem = false, textAlign = 'center', light, className, children, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={cx(
        'rd-material-divider',
        `rd-material-divider--${orientation}`,
        `rd-material-divider--${variant}`,
        `rd-material-divider--text-${textAlign}`,
        flexItem && 'rd-material-divider--flex-item',
        light && 'rd-material-divider--light',
        className,
      )}
    >
      {children != null && <span className="rd-material-divider__text">{children}</span>}
    </div>
  ),
);
Divider.displayName = 'Divider';

interface AccordionContextValue {
  expanded: boolean;
  disabled: boolean;
  summaryId: string;
  detailsId: string;
  toggle: (event: React.SyntheticEvent, expanded: boolean) => void;
}
const AccordionContext = React.createContext<AccordionContextValue | null>(null);

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  expanded?: boolean;
  defaultExpanded?: boolean;
  disabled?: boolean;
  disableGutters?: boolean;
  square?: boolean;
  onChange?: (event: React.SyntheticEvent, expanded: boolean) => void;
}

export function Accordion({
  expanded: controlledExpanded, defaultExpanded = false, disabled = false, disableGutters = false,
  square = false, onChange, className, children, ...props
}: AccordionProps) {
  const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState(defaultExpanded);
  const expanded = controlledExpanded ?? uncontrolledExpanded;
  const ids = React.useRef<{ summary: string; details: string } | null>(null);
  if (!ids.current) {
    const id = nextId('rd-accordion');
    ids.current = { summary: `${id}-summary`, details: `${id}-details` };
  }
  const toggle = (event: React.SyntheticEvent, next: boolean) => {
    if (controlledExpanded === undefined) setUncontrolledExpanded(next);
    onChange?.(event, next);
  };
  return (
    <AccordionContext.Provider value={{ expanded, disabled, summaryId: ids.current.summary, detailsId: ids.current.details, toggle }}>
      <div
        {...props}
        className={cx('rd-material-accordion', expanded && 'rd-material-accordion--expanded',
          disabled && 'rd-material-accordion--disabled', disableGutters && 'rd-material-accordion--no-gutters',
          square && 'rd-material-accordion--square', className)}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionSummaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  expandIcon?: React.ReactNode;
}

export const AccordionSummary = React.forwardRef<HTMLButtonElement, AccordionSummaryProps>(
  ({ expandIcon, className, children, onClick, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context) throw new Error('AccordionSummary must be used inside Accordion');
    return (
      <button
        {...props}
        ref={ref}
        id={context.summaryId}
        type="button"
        className={cx('rd-material-accordion__summary', className)}
        aria-expanded={context.expanded}
        aria-controls={context.detailsId}
        disabled={context.disabled || props.disabled}
        onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) context.toggle(event, !context.expanded); }}
      >
        <span className="rd-material-accordion__summary-content">{children}</span>
        <span className="rd-material-accordion__expand-icon" aria-hidden>
          {expandIcon ?? (
            <svg viewBox="0 0 16 16" width="16" height="16" focusable="false">
              <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </button>
    );
  },
);
AccordionSummary.displayName = 'AccordionSummary';

export interface AccordionDetailsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AccordionDetails = React.forwardRef<HTMLDivElement, AccordionDetailsProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context) throw new Error('AccordionDetails must be used inside Accordion');
    return (
      <div
        {...props}
        ref={ref}
        id={context.detailsId}
        role="region"
        aria-labelledby={context.summaryId}
        hidden={!context.expanded}
        className={cx('rd-material-accordion__details', className)}
      />
    );
  },
);
AccordionDetails.displayName = 'AccordionDetails';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevation' | 'outlined';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'elevation', className, ...props }, ref) => (
    <div {...props} ref={ref} className={cx('rd-material-card', `rd-material-card--${variant}`, className)} />
  ),
);
Card.displayName = 'Card';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div {...props} ref={ref} className={cx('rd-material-card__content', className)} />,
);
CardContent.displayName = 'CardContent';

export const CardActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { disableSpacing?: boolean }>(
  ({ className, disableSpacing = false, ...props }, ref) => (
    <div {...props} ref={ref} className={cx('rd-material-card__actions', disableSpacing && 'rd-material-card__actions--no-spacing', className)} />
  ),
);
CardActions.displayName = 'CardActions';

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  title?: React.ReactNode;
  subheader?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ avatar, action, title, subheader, className, ...props }, ref) => (
    <div {...props} ref={ref} className={cx('rd-material-card__header', className)}>
      {avatar && <div className="rd-material-card__header-avatar">{avatar}</div>}
      <div className="rd-material-card__header-content">
        {title != null && <div className="rd-material-card__header-title">{title}</div>}
        {subheader != null && <div className="rd-material-card__header-subheader">{subheader}</div>}
      </div>
      {action && <div className="rd-material-card__header-action">{action}</div>}
    </div>
  ),
);
CardHeader.displayName = 'CardHeader';

export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  image?: string;
  component?: React.ElementType;
  imageAlt?: string;
}

export const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
  ({ image, component: Component = 'div', imageAlt = '', className, style, ...props }, ref) => {
    const isImage = Component === 'img';
    return (
      <Component
        {...props}
        ref={ref}
        src={isImage ? image : undefined}
        alt={isImage ? imageAlt : undefined}
        role={image ? 'img' : props.role}
        aria-label={image && !isImage ? imageAlt : props['aria-label']}
        className={cx('rd-material-card__media', className)}
        style={{ ...(image && !isImage ? { backgroundImage: `url("${image}")` } : {}), ...style }}
      />
    );
  },
);
CardMedia.displayName = 'CardMedia';

export type ImageListVariant = 'standard' | 'quilted' | 'woven' | 'masonry';

export interface ImageListProps extends React.HTMLAttributes<HTMLUListElement> {
  cols?: number;
  rowHeight?: number | string;
  gap?: number | string;
  variant?: ImageListVariant;
}

const cssLength = (value: number | string) => typeof value === 'number' ? `${value}px` : value;

export const ImageList = React.forwardRef<HTMLUListElement, ImageListProps>(
  ({ cols = 3, rowHeight = 120, gap = 4, variant = 'standard', className, style, ...props }, ref) => (
    <ul
      {...props}
      ref={ref}
      role="list"
      data-variant={variant}
      data-cols={Math.max(1, cols)}
      className={cx('rd-material-image-list', `rd-material-image-list--${variant}`, className)}
      style={{
        ...style,
        '--rd-material-image-cols': Math.max(1, cols),
        '--rd-material-image-row-height': cssLength(rowHeight),
        '--rd-material-image-gap': cssLength(gap),
      } as React.CSSProperties}
    />
  ),
);
ImageList.displayName = 'ImageList';

export interface ImageListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  cols?: number;
  rows?: number;
}

export const ImageListItem = React.forwardRef<HTMLLIElement, ImageListItemProps>(
  ({ cols, rows, className, style, ...props }, ref) => (
    <li
      {...props}
      ref={ref}
      className={cx('rd-material-image-list__item', className)}
      style={{
        ...style,
        ...(cols === undefined ? {} : { '--rd-material-image-item-cols': Math.max(1, cols) }),
        ...(rows === undefined ? {} : { '--rd-material-image-item-rows': Math.max(1, rows) }),
      } as React.CSSProperties}
    />
  ),
);
ImageListItem.displayName = 'ImageListItem';

export interface ImageListItemBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actionIcon?: React.ReactNode;
  position?: 'top' | 'bottom' | 'below';
  actionPosition?: 'left' | 'right';
}

export const ImageListItemBar = React.forwardRef<HTMLDivElement, ImageListItemBarProps>(
  ({ title, subtitle, actionIcon, position = 'bottom', actionPosition = 'right', className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={cx(
        'rd-material-image-list__bar',
        `rd-material-image-list__bar--${position}`,
        `rd-material-image-list__bar--action-${actionPosition}`,
        className,
      )}
    >
      <div className="rd-material-image-list__bar-text">
        {title != null && <div className="rd-material-image-list__title">{title}</div>}
        {subtitle != null && <div className="rd-material-image-list__subtitle">{subtitle}</div>}
      </div>
      {actionIcon != null && <div className="rd-material-image-list__action">{actionIcon}</div>}
    </div>
  ),
);
ImageListItemBar.displayName = 'ImageListItemBar';

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode;
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
  expandText?: string;
}

export function Breadcrumbs({
  separator = '/', maxItems = 8, itemsBeforeCollapse = 1, itemsAfterCollapse = 1,
  expandText = 'Show path', className, children, ...props
}: BreadcrumbsProps) {
  const [expanded, setExpanded] = React.useState(false);
  const items = React.Children.toArray(children);
  const collapse = !expanded && maxItems > 0 && items.length > maxItems;
  const visible = collapse
    ? [...items.slice(0, itemsBeforeCollapse), <button key="ellipsis" type="button" className="rd-material-breadcrumbs__expand" aria-label={expandText} onClick={() => setExpanded(true)}>…</button>, ...items.slice(-itemsAfterCollapse)]
    : items;
  return (
    <nav {...props} aria-label={props['aria-label'] ?? 'Breadcrumb'} className={cx('rd-material-breadcrumbs', className)}>
      <ol className="rd-material-breadcrumbs__list">
        {visible.map((item, index) => (
          <li key={(item as React.ReactElement).key ?? index} className="rd-material-breadcrumbs__item">
            {item}
            {index < visible.length - 1 && <span className="rd-material-breadcrumbs__separator" aria-hidden>{separator}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface SpeedDialAction {
  icon: React.ReactNode;
  name: string;
  tooltipTitle?: React.ReactNode;
  tooltipOpen?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface SpeedDialProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  ariaLabel: string;
  icon?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpen?: (event: React.SyntheticEvent) => void;
  onClose?: (event: React.SyntheticEvent) => void;
  direction?: 'up' | 'down' | 'left' | 'right';
  actions: SpeedDialAction[];
  FabProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export function SpeedDial({
  ariaLabel, icon, open: controlledOpen, defaultOpen = false, onOpen, onClose,
  direction = 'up', actions, FabProps, className, onKeyDown, ...props
}: SpeedDialProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const fabRef = React.useRef<HTMLButtonElement>(null);
  const toggle = (event: React.SyntheticEvent) => {
    const next = !open;
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    (next ? onOpen : onClose)?.(event);
  };
  return (
    <div
      {...props}
      className={cx('rd-material-speed-dial', `rd-material-speed-dial--${direction}`, open && 'rd-material-speed-dial--open', className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === 'Escape' && open && !event.defaultPrevented) {
          event.preventDefault();
          if (controlledOpen === undefined) setUncontrolledOpen(false);
          onClose?.(event);
          fabRef.current?.focus();
        }
      }}
    >
      <button
        {...FabProps}
        ref={fabRef}
        type="button"
        className={cx('rd-material-speed-dial__fab', FabProps?.className)}
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={(event) => { FabProps?.onClick?.(event); if (!event.defaultPrevented) toggle(event); }}
      >
        <span className={cx('rd-material-speed-dial__fab-icon', !icon && open && 'rd-material-speed-dial__fab-icon--open')}>
          {icon ?? (
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden focusable="false">
              <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </span>
      </button>
      <div className={cx('rd-material-speed-dial__actions', open && 'rd-material-speed-dial__actions--open')} aria-hidden={!open}>
        {actions.map((action, index) => (
          <button
            key={action.name}
            type="button"
            className="rd-material-speed-dial__action"
            aria-label={action.name}
            tabIndex={open ? 0 : -1}
            style={{ '--rd-speed-dial-delay': `${(open ? index : actions.length - index - 1) * 35}ms` } as React.CSSProperties}
            title={action.tooltipTitle == null ? action.name : String(action.tooltipTitle)}
            disabled={action.disabled}
            onClick={(event) => {
              action.onClick?.(event);
              if (!event.defaultPrevented) {
                if (controlledOpen === undefined) setUncontrolledOpen(false);
                onClose?.(event);
              }
            }}
          >
            {action.icon}
            {action.tooltipOpen && <span className="rd-material-speed-dial__tooltip">{action.tooltipTitle ?? action.name}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export interface StepperStep {
  label: React.ReactNode;
  optional?: React.ReactNode;
  description?: React.ReactNode;
  completed?: boolean;
  error?: boolean;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepperStep[];
  activeStep?: number;
  orientation?: 'horizontal' | 'vertical';
  alternativeLabel?: boolean;
  nonLinear?: boolean;
  onStepClick?: (event: React.MouseEvent<HTMLButtonElement>, step: number) => void;
}

export function Stepper({
  steps, activeStep = 0, orientation = 'horizontal', alternativeLabel = false,
  nonLinear = false, onStepClick, className, ...props
}: StepperProps) {
  return (
    <div
      {...props}
      className={cx('rd-material-stepper', `rd-material-stepper--${orientation}`,
        alternativeLabel && 'rd-material-stepper--alternative', className)}
      role="list"
      aria-orientation={orientation}
    >
      {steps.map((step, index) => {
        const completed = step.completed ?? index < activeStep;
        const active = index === activeStep;
        const clickable = nonLinear && !!onStepClick;
        const content = (
          <>
            <span className="rd-material-stepper__icon" aria-hidden>{completed ? '✓' : step.error ? '!' : index + 1}</span>
            <span className="rd-material-stepper__label-wrap">
              <span className="rd-material-stepper__label">{step.label}</span>
              {step.optional && <span className="rd-material-stepper__optional">{step.optional}</span>}
              {step.description && orientation === 'vertical' && <span className="rd-material-stepper__description">{step.description}</span>}
            </span>
          </>
        );
        return (
          <React.Fragment key={index}>
            {index > 0 && <span className="rd-material-stepper__connector" aria-hidden />}
            <div
              role="listitem"
              aria-current={active ? 'step' : undefined}
              aria-label={`${step.label}${completed ? ', completed' : active ? ', current' : ''}${step.error ? ', error' : ''}`}
              className={cx('rd-material-stepper__step', active && 'rd-material-stepper__step--active',
                completed && 'rd-material-stepper__step--completed', step.error && 'rd-material-stepper__step--error')}
            >
              {clickable
                ? <button type="button" className="rd-material-stepper__button" onClick={(event) => onStepClick?.(event, index)}>{content}</button>
                : <div className="rd-material-stepper__content">{content}</div>}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
