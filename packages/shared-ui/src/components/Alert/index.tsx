import { HTMLAttributes, ReactNode } from "react";
import styles from "./Alert.module.scss";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  onClose?: () => void;
}

const ICONS: Record<NonNullable<AlertProps["variant"]>, string> = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  error: "❌",
};

export function Alert({
  children,
  variant = "info",
  title,
  onClose,
  className,
  ...props
}: AlertProps) {
  return (
    <div
      className={`${styles.alert} ${styles[variant]} ${className || ""}`}
      role="alert"
      {...props}
    >
      <span className={styles.icon}>{ICONS[variant]}</span>

      <div className={styles.content}>
        {title && <strong className={styles.title}>{title}</strong>}
        <div className={styles.message}>{children}</div>
      </div>

      {onClose && (
        <button
          className={styles.close}
          onClick={onClose}
          aria-label="Đóng thông báo"
        >
          ×
        </button>
      )}
    </div>
  );
}
