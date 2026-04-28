// components/ui/glass-button.tsx
//
// A reusable glass-effect button component.
// By default wraps content in a Next.js <Link>. Pass `asButton` to render
// a standalone <button> element with no link wrapper.
//
// ── Link mode (default) ───────────────────────────────────────────────────────
//   <GlassButton href="/download" label="Download Now" icon={<Download />} />
//
// ── Button mode ───────────────────────────────────────────────────────────────
//   <GlassButton asButton onClick={handleClick} label="Download Now" icon={<Download />} />
//
// Variants:
//   "default"  — bg-foreground text-background (primary action)
//   "cyan"     — bg-cyan-500 hover:bg-cyan-600 text-white (Telegram / secondary)
//   "custom"   — supply your own `className` for the inner content div
import { CSSProperties, ReactNode } from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type GlassButtonVariant = 'default' | 'cyan' | 'custom';

/** Shared props regardless of link vs button mode */
interface GlassButtonBaseProps {
  /** Button label text */
  label: string;

  /** Optional leading icon (e.g. <Download className="w-4 h-4" />) */
  icon?: ReactNode;

  /** Visual variant. Defaults to "default". */
  variant?: GlassButtonVariant;

  /**
   * Border radius applied to the glass card CSS var and inner rounded class.
   * Defaults to "12px".
   */
  borderRadius?: string;

  /**
   * Extra classes forwarded to the inner content `<div>`.
   * Meaningful only when variant="custom"; ignored otherwise.
   */
  className?: string;

  /** Classes forwarded to the outermost wrapper element. */
  wrapperClassName?: string;

  /**
   * When true the component renders nothing.
   * Mirrors the `is_enabled` flag pattern from API settings.
   */
  disabled?: boolean;

  /** Accessible label override. Falls back to `label`. */
  ariaLabel?: string;
}

/** Link mode — `href` is required, `asButton` must be absent/false */
interface GlassButtonLinkProps extends GlassButtonBaseProps {
  asButton?: false;
  href: string;
  /** Link target. Defaults to "_self". `rel` is added automatically for "_blank". */
  target?: '_blank' | '_self' | '_parent' | '_top';
  onClick?: never;
  type?: never;
}

/** Button mode — `asButton` must be true, no `href` */
interface GlassButtonButtonProps extends GlassButtonBaseProps {
  asButton: true;
  href?: never;
  target?: never;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
}

export type GlassButtonProps = GlassButtonLinkProps | GlassButtonButtonProps;

// ─── Variant styles ───────────────────────────────────────────────────────────

const variantStyles: Record<Exclude<GlassButtonVariant, 'custom'>, string> = {
  default: 'bg-foreground hover:opacity-90 text-background',
  cyan: 'bg-cyan-500 hover:bg-cyan-600 text-white',
};

// ─── Shared inner content ─────────────────────────────────────────────────────

function GlassButtonInner({
  icon,
  label,
  variant,
  borderRadius,
  className,
}: Pick<
  GlassButtonBaseProps,
  'icon' | 'label' | 'variant' | 'borderRadius' | 'className'
>) {
  const innerClassName =
    variant === 'custom'
      ? cn(
          'flex items-center justify-center gap-3 text-sm font-bold p-4',
          className
        )
      : cn(
          'flex items-center justify-center gap-3 text-sm font-bold p-4',
          variantStyles[variant ?? 'default']
        );

  return (
    <div style={{ borderRadius: borderRadius }} className={innerClassName}>
      {icon && <span aria-hidden='true'>{icon}</span>}
      {label}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GlassButton(props: GlassButtonProps): React.JSX.Element | null {
  const {
    label,
    icon,
    variant = 'default',
    borderRadius = '12px',
    className,
    wrapperClassName,
    disabled = false,
    ariaLabel,
  } = props;

  if (disabled) return null;

  const cssVars = { '--glass-border-radius': borderRadius } as CSSProperties;

  const innerContent = (
    <GlassButtonInner
      icon={icon}
      label={label}
      variant={variant}
      borderRadius={borderRadius}
      className={className}
    />
  );

  // ── Button mode ─────────────────────────────────────────────────────────────
  if (props.asButton) {
    return (
      <div
        className={cn('glass-card-effect-wrapper', wrapperClassName)}
        style={cssVars}
      >
        <button
          type={props.type ?? 'button'}
          onClick={props.onClick}
          aria-label={ariaLabel ?? label}
          className='glass-card'
          style={cssVars}
        >
          {innerContent}
        </button>
        <div className='glass-card-shadow' />
      </div>
    );
  }

  // ── Link mode (default) ─────────────────────────────────────────────────────
  return (
    <Link
      href={props.href}
      target={props.target ?? '_self'}
      rel={props.target === '_blank' ? 'noopener noreferrer' : undefined}
      aria-label={ariaLabel ?? label}
      className={cn('glass-card-effect-wrapper', wrapperClassName)}
      style={cssVars}
    >
      <button
        type='button'
        className='glass-card'
        style={cssVars}
        tabIndex={-1}
        aria-hidden='true'
      >
        {innerContent}
      </button>
      <div className='glass-card-shadow' />
    </Link>
  );
}
