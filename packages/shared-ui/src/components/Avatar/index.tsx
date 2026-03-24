import { HTMLAttributes } from "react";
import styles from "./Avatar.module.scss";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#14b8a6",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
  ];
  const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  className,
  style,
  ...props
}: AvatarProps) {
  const initials = name ? getInitials(name) : "?";
  const bgColor = name ? getColorFromName(name) : "#94a3b8";

  return (
    <div
      className={`${styles.avatar} ${styles[size]} ${className || ""}`}
      style={{ backgroundColor: src ? undefined : bgColor, ...style }}
      role="img"
      aria-label={alt || name || "Avatar"}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt || name || "Avatar"} className={styles.image} />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
    </div>
  );
}
