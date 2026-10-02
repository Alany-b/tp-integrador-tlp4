import type { ReactNode } from "react";

export type StateVariant = "loading" | "error" | "empty" | "denied";

interface StateMessageProps {
  variant: StateVariant;
  title: string;
  text?: string;
  onRetry?: () => void;
  children?: ReactNode;
}

const LOADING_TEXT = "Esto puede demorar unos segundos.";

export function StateMessage({ variant, title, text, onRetry, children }: StateMessageProps) {
  let role = "status";
  if (variant === "error" || variant === "denied") {
    role = "alert";
  }

  let message = text;
  if (message === undefined && variant === "loading") {
    message = LOADING_TEXT;
  }

  const hasActions = onRetry !== undefined || children !== undefined;

  return (
    <div className={`state state--${variant}`} role={role}>
      {variant === "loading" && <div className="state__spinner"></div>}
      <p className="state__title">{title}</p>
      {message !== undefined && <p className="state__text">{message}</p>}
      {hasActions && (
        <div className="state__actions">
          {onRetry !== undefined && (
            <button className="btn btn--secondary btn--small" type="button" onClick={onRetry}>
              Reintentar
            </button>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
