import { HTMLAttributes } from "react";
import styles from "./Skeleton.module.scss";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  variant = "text",
  width,
  height,
  animation = "pulse",
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${styles[animation]} ${className || ""}`}
      style={{
        width: width,
        height: height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

// Preset skeletons for common use cases
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className={styles.textGroup}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? "60%" : "100%"}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <Skeleton variant="rectangular" height={120} />
      <div className={styles.cardContent}>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </div>
    </div>
  );
}
