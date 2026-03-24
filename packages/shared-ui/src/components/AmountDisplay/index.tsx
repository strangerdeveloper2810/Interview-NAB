import styles from "./AmountDisplay.module.scss";

export interface AmountDisplayProps {
  amount: number;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSign?: boolean;
  className?: string;
}

export function AmountDisplay({
  amount,
  currency = "VND",
  size = "md",
  showSign = false,
  className,
}: AmountDisplayProps) {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const formatted = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absAmount);

  const sign = showSign ? (isNegative ? "-" : "+") : isNegative ? "-" : "";
  const colorClass = showSign
    ? isNegative
      ? styles.negative
      : styles.positive
    : "";

  return (
    <span
      className={`${styles.amount} ${styles[size]} ${colorClass} ${className || ""}`}
    >
      {sign}
      {formatted}
    </span>
  );
}
