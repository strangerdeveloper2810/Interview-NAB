import type { Meta, StoryObj } from "@storybook/react";
import { TransactionItem, Transaction } from "./index";
import { Card, CardHeader, CardContent } from "../Card";

const meta: Meta<typeof TransactionItem> = {
  title: "Banking/TransactionItem",
  component: TransactionItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TransactionItem>;

const depositTransaction: Transaction = {
  id: "txn-1",
  type: "deposit",
  amount: 5000000,
  currency: "VND",
  description: "Lương tháng 3/2024",
  createdAt: new Date("2024-03-25T09:00:00"),
};

const withdrawTransaction: Transaction = {
  id: "txn-2",
  type: "withdraw",
  amount: 500000,
  currency: "VND",
  description: "Rút tiền ATM",
  createdAt: new Date("2024-03-24T14:30:00"),
};

const transferTransaction: Transaction = {
  id: "txn-3",
  type: "transfer",
  amount: 1000000,
  currency: "VND",
  description: "Chuyển khoản cho Nguyễn Văn A",
  createdAt: new Date("2024-03-23T11:15:00"),
};

export const Deposit: Story = {
  args: {
    transaction: depositTransaction,
  },
};

export const Withdraw: Story = {
  args: {
    transaction: withdrawTransaction,
  },
};

export const Transfer: Story = {
  args: {
    transaction: transferTransaction,
  },
};

export const TransactionList: Story = {
  render: () => (
    <Card style={{ maxWidth: 500 }}>
      <CardHeader>
        <h3>Giao dịch gần đây</h3>
      </CardHeader>
      <CardContent>
        <TransactionItem transaction={depositTransaction} />
        <TransactionItem transaction={withdrawTransaction} />
        <TransactionItem transaction={transferTransaction} />
        <TransactionItem
          transaction={{
            ...depositTransaction,
            id: "txn-4",
            description: "Tiền thưởng dự án",
            amount: 10000000,
          }}
        />
        <TransactionItem
          transaction={{
            ...transferTransaction,
            id: "txn-5",
            description: "Thanh toán hóa đơn điện",
            amount: 350000,
          }}
        />
      </CardContent>
    </Card>
  ),
};
