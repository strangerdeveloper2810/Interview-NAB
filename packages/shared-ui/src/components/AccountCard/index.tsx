import { HTMLAttributes } from "react";
import styles from "./AccountCard.module.scss";
import { AmountDisplay } from "../AmountDisplay";

export interface Account {
  id: string;
  name: string;
  type: "savings" | "checking" | "credit";
  balance: number;
  currency: string;
  accountNumber?: string;
}

export interface AccountCardProps extends HTMLAttributes<HTMLDivElement> {
  account: Account;
  onAccountSelect?: (account: Account) => void;
  selected?: boolean;
}

const TYPE_LABELS: Record<Account["type"], string> = {
  savings: "Tiết kiệm",
  checking: "Thanh toán",
  credit: "Tín dụng",
};

const TYPE_ICONS: Record<Account["type"], string> = {
  savings: "🏦",
  checking: "💳",
  credit: "💰",
};

export function AccountCard({
  account,
  onAccountSelect,
  selected = false,
  className,
  ...props
}: AccountCardProps) {
  const handleClick = () => {
    onAccountSelect?.(account);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onAccountSelect?.(account);
    }
  };

  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ""} ${onAccountSelect ? styles.clickable : ""} ${className || ""}`}
      onClick={onAccountSelect ? handleClick : undefined}
      onKeyDown={onAccountSelect ? handleKeyDown : undefined}
      role={onAccountSelect ? "button" : undefined}
      tabIndex={onAccountSelect ? 0 : undefined}
      aria-pressed={onAccountSelect ? selected : undefined}
      {...props}
    >
      <div className={styles.header}>
        <span className={styles.icon}>{TYPE_ICONS[account.type]}</span>
        <div className={styles.info}>
          <h3 className={styles.name}>{account.name}</h3>
          <span className={styles.type}>{TYPE_LABELS[account.type]}</span>
        </div>
      </div>

      <div className={styles.balance}>
        <span className={styles.balanceLabel}>Số dư</span>
        <AmountDisplay
          amount={account.balance}
          currency={account.currency}
          size="lg"
        />
      </div>

      {account.accountNumber && (
        <div className={styles.accountNumber}>
          •••• {account.accountNumber.slice(-4)}
        </div>
      )}
    </div>
  );
}
