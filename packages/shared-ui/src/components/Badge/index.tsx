import { HTMLAttributes, ReactNode } from "react";
import styles from "./Badge.module.scss";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[variant]} ${styles[size]} ${className || ""}`}
      {...props}
    >
      {children}
    </span>
  );
}
