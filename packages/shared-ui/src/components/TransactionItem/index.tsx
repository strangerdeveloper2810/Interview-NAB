import { HTMLAttributes } from "react";
import styles from "./TransactionItem.module.scss";
import { AmountDisplay } from "../AmountDisplay";

export interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "transfer";
  amount: number;
  currency: string;
  description: string;
  createdAt: Date | string;
  category?: string;
}

export interface TransactionItemProps extends HTMLAttributes<HTMLDivElement> {
  transaction: Transaction;
}

const TYPE_CONFIG: Record<
  Transaction["type"],
  { icon: string; label: string; isIncome: boolean }
> = {
  deposit: { icon: "↓", label: "Nhận tiền", isIncome: true },
  withdraw: { icon: "↑", label: "Rút tiền", isIncome: false },
  transfer: { icon: "↔", label: "Chuyển khoản", isIncome: false },
};

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function TransactionItem({
  transaction,
  className,
  ...props
}: TransactionItemProps) {
  const config = TYPE_CONFIG[transaction.type];
  const displayAmount = config.isIncome
    ? transaction.amount
    : -transaction.amount;

  return (
    <div className={`${styles.item} ${className || ""}`} {...props}>
      <div
        className={`${styles.icon} ${config.isIncome ? styles.income : styles.expense}`}
      >
        {config.icon}
      </div>

      <div className={styles.details}>
        <span className={styles.description}>{transaction.description}</span>
        <span className={styles.meta}>
          {config.label} • {formatDate(transaction.createdAt)}
        </span>
      </div>

      <AmountDisplay
        amount={displayAmount}
        currency={transaction.currency}
        size="md"
        showSign
      />
    </div>
  );
}
