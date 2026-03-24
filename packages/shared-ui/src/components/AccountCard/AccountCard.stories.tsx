import type { Meta, StoryObj } from "@storybook/react";
import { AccountCard, Account } from "./index";

const meta: Meta<typeof AccountCard> = {
  title: "Banking/AccountCard",
  component: AccountCard,
  tags: ["autodocs"],
  parameters: {
    backgrounds: {
      default: "light",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AccountCard>;

const savingsAccount: Account = {
  id: "acc-1",
  name: "Tài khoản tiết kiệm",
  type: "savings",
  balance: 25000000,
  currency: "VND",
  accountNumber: "1234567890",
};

const checkingAccount: Account = {
  id: "acc-2",
  name: "Tài khoản thanh toán",
  type: "checking",
  balance: 8500000,
  currency: "VND",
  accountNumber: "0987654321",
};

const creditAccount: Account = {
  id: "acc-3",
  name: "Thẻ tín dụng",
  type: "credit",
  balance: -2500000,
  currency: "VND",
  accountNumber: "5555123456789012",
};

export const Savings: Story = {
  args: {
    account: savingsAccount,
  },
};

export const Checking: Story = {
  args: {
    account: checkingAccount,
  },
};

export const Credit: Story = {
  args: {
    account: creditAccount,
  },
};

export const Clickable: Story = {
  args: {
    account: savingsAccount,
    onAccountSelect: (account) => alert(`Selected: ${account.name}`),
  },
};

export const Selected: Story = {
  args: {
    account: savingsAccount,
    selected: true,
    onAccountSelect: (account) => alert(`Selected: ${account.name}`),
  },
};

export const AccountList: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
      <AccountCard account={savingsAccount} />
      <AccountCard account={checkingAccount} />
      <AccountCard account={creditAccount} />
    </div>
  ),
};
