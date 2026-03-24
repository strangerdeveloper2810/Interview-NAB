import { type JSX } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  AccountCard,
  TransactionItem,
  Badge,
  Alert,
} from "@nab/shared-ui";

// Mock data
const mockAccount = {
  id: "acc-1",
  name: "Tài khoản tiết kiệm",
  type: "savings" as const,
  balance: 25000000,
  currency: "VND",
  accountNumber: "1234567890",
};

const mockTransactions = [
  {
    id: "txn-1",
    type: "deposit" as const,
    amount: 5000000,
    currency: "VND",
    description: "Lương tháng 3",
    createdAt: new Date(),
  },
  {
    id: "txn-2",
    type: "withdraw" as const,
    amount: 500000,
    currency: "VND",
    description: "Rút tiền ATM",
    createdAt: new Date(),
  },
  {
    id: "txn-3",
    type: "transfer" as const,
    amount: 1000000,
    currency: "VND",
    description: "Chuyển khoản cho Nguyễn Văn A",
    createdAt: new Date(),
  },
];

function Dashboard(): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Alert variant="info" title="Chào mừng!">
        Đây là demo NAB Banking Portal với shared-ui components.
      </Alert>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <AccountCard account={mockAccount} />

        <Card style={{ flex: 1, minWidth: 300 }}>
          <CardHeader>
            <h3>Giao dịch gần đây</h3>
          </CardHeader>
          <CardContent>
            {mockTransactions.map((txn) => (
              <TransactionItem key={txn.id} transaction={txn} />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3>Components Demo</h3>
        </CardHeader>
        <CardContent>
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Loading</Button>
            <Badge variant="success">Thành công</Badge>
            <Badge variant="warning">Đang xử lý</Badge>
            <Badge variant="error">Thất bại</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <h1>NAB Banking Portal</h1>
          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/accounts">Accounts</Link>
            <Link to="/transfer">Transfer</Link>
          </nav>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<div>Accounts Page</div>} />
            <Route path="/transfer" element={<div>Transfer Page</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
