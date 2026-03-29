import { type FC, type JSX, Fragment, useState, useId } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Button, Card, CardContent, CardHeader, Alert } from '@nab/shared-ui';
import { Input } from '@nab/shared-ui';
import { formatCurrency, formatAccountNumber } from '@nab/shared-utils';
import { RoutesApp } from '../../constants/route';
import styles from './Transfer.module.scss';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

interface MockAccount {
  id: string;
  name: string;
  number: string;
  balance: number;
}

const MOCK_ACCOUNTS: MockAccount[] = [
  { id: 'acc-001', name: 'Tài khoản thanh toán', number: '0123456789', balance: 15_000_000 },
  { id: 'acc-002', name: 'Tài khoản tiết kiệm', number: '9876543210', balance: 50_000_000 },
  { id: 'acc-003', name: 'Tài khoản lương',     number: '1112223334', balance: 8_500_000  },
];

const QUICK_AMOUNTS = [100_000, 500_000, 1_000_000, 2_000_000, 5_000_000];

const QUICK_AMOUNT_LABELS: Record<number, string> = {
  100_000:   '100K',
  500_000:   '500K',
  1_000_000: '1M',
  2_000_000: '2M',
  5_000_000: '5M',
};

const TRANSFER_FEE = 0;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormData {
  fromAccountId: string;
  toAccountNumber: string;
  amount: string;          // raw string while user types
  description: string;
}

interface TransferResult {
  success: boolean;
  transactionId?: string;
  timestamp?: Date;
  errorMessage?: string;
}

// ---------------------------------------------------------------------------
// Progress indicator
// ---------------------------------------------------------------------------

interface ProgressProps {
  currentStep: 1 | 2 | 3;
}

const STEP_LABELS = ['Nhập thông tin', 'Xác nhận', 'Kết quả'];

function ProgressIndicator({ currentStep }: ProgressProps): JSX.Element {
  return (
    <nav className={styles.progress} aria-label="Các bước chuyển khoản">
      <div className={styles.progress__list}>
        {([1, 2, 3] as const).map((step, idx) => {
          const isCompleted = step < currentStep;
          const isActive    = step === currentStep;

          return (
            <Fragment key={step}>
              {idx > 0 && (
                <span
                  className={`${styles.progress__line} ${isCompleted || isActive ? styles['progress__line--filled'] : ''}`}
                  aria-hidden="true"
                />
              )}
              <div className={styles.progress__item}>
                <span
                  className={`${styles.progress__circle} ${isActive ? styles['progress__circle--active'] : ''} ${isCompleted ? styles['progress__circle--completed'] : ''}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    step
                  )}
                </span>
                <span className={styles.progress__label}>{STEP_LABELS[idx]}</span>
              </div>
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Form
// ---------------------------------------------------------------------------

interface Step1Props {
  formData: FormData;
  onChange: (patch: Partial<FormData>) => void;
  onContinue: () => void;
}

function Step1Form({ formData, onChange, onContinue }: Step1Props): JSX.Element {
  const fromSelectId  = useId();
  const descriptionId = useId();

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const selectedAccount = MOCK_ACCOUNTS.find((a) => a.id === formData.fromAccountId) ?? null;
  const amountNumber    = Number(formData.amount.replace(/\D/g, '')) || 0;
  const balanceAfter    = selectedAccount ? selectedAccount.balance - amountNumber - TRANSFER_FEE : null;

  const validate = (): boolean => {
    const next: typeof errors = {};

    if (!formData.fromAccountId) {
      next.fromAccountId = 'Vui lòng chọn tài khoản nguồn.';
    }
    if (!formData.toAccountNumber.trim()) {
      next.toAccountNumber = 'Vui lòng nhập số tài khoản người nhận.';
    } else if (!/^\d{9,14}$/.test(formData.toAccountNumber.trim())) {
      next.toAccountNumber = 'Số tài khoản không hợp lệ (9–14 chữ số).';
    }
    if (!formData.amount || amountNumber <= 0) {
      next.amount = 'Vui lòng nhập số tiền cần chuyển.';
    } else if (selectedAccount && amountNumber > selectedAccount.balance) {
      next.amount = 'Số dư không đủ để thực hiện giao dịch.';
    } else if (amountNumber < 1_000) {
      next.amount = 'Số tiền tối thiểu là 1.000 ₫.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleContinue = () => {
    if (validate()) onContinue();
  };

  return (
    <section aria-labelledby="step1-heading">
      <h2 id="step1-heading" className={styles.stepTitle}>Thông tin chuyển khoản</h2>

      {/* From account */}
      <div className={styles.field}>
        <label htmlFor={fromSelectId} className={styles.field__label}>
          Từ tài khoản <span aria-hidden="true" className={styles.field__required}>*</span>
        </label>
        <select
          id={fromSelectId}
          className={`${styles.field__select} ${errors.fromAccountId ? styles['field__select--error'] : ''}`}
          value={formData.fromAccountId}
          aria-required="true"
          aria-invalid={!!errors.fromAccountId}
          aria-describedby={errors.fromAccountId ? `${fromSelectId}-error` : undefined}
          onChange={(e) => {
            onChange({ fromAccountId: e.target.value });
            setErrors((prev) => ({ ...prev, fromAccountId: undefined }));
          }}
        >
          <option value="">-- Chọn tài khoản --</option>
          {MOCK_ACCOUNTS.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name} — {formatAccountNumber(acc.number)} — {formatCurrency(acc.balance)}
            </option>
          ))}
        </select>
        {errors.fromAccountId && (
          <span id={`${fromSelectId}-error`} className={styles.field__error} role="alert">
            {errors.fromAccountId}
          </span>
        )}
      </div>

      {/* To account number */}
      <Input
        id="to-account-number"
        label="Số tài khoản người nhận *"
        placeholder="Nhập số tài khoản"
        inputMode="numeric"
        maxLength={14}
        value={formData.toAccountNumber}
        aria-required="true"
        error={errors.toAccountNumber}
        onChange={(e) => {
          onChange({ toAccountNumber: e.target.value.replace(/\D/g, '') });
          setErrors((prev) => ({ ...prev, toAccountNumber: undefined }));
        }}
      />

      {/* Amount */}
      <div className={styles.field}>
        <Input
          id="transfer-amount"
          label="Số tiền *"
          placeholder="0"
          inputMode="numeric"
          value={formData.amount ? Number(formData.amount.replace(/\D/g, '')).toLocaleString('vi-VN') : ''}
          aria-required="true"
          error={errors.amount}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, '');
            onChange({ amount: raw });
            setErrors((prev) => ({ ...prev, amount: undefined }));
          }}
        />

        {/* Quick amount buttons */}
        <div className={styles.quickAmounts} role="group" aria-label="Số tiền nhanh">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              className={`${styles.quickAmounts__btn} ${amountNumber === amt ? styles['quickAmounts__btn--active'] : ''}`}
              onClick={() => {
                onChange({ amount: String(amt) });
                setErrors((prev) => ({ ...prev, amount: undefined }));
              }}
            >
              {QUICK_AMOUNT_LABELS[amt]}
            </button>
          ))}
        </div>

        {/* Balance after */}
        {selectedAccount !== null && (
          <p className={`${styles.balanceAfter} ${balanceAfter !== null && balanceAfter < 0 ? styles['balanceAfter--negative'] : ''}`}>
            Số dư sau giao dịch:{' '}
            <strong>
              {balanceAfter !== null ? formatCurrency(Math.max(balanceAfter, 0)) : '—'}
            </strong>
            {balanceAfter !== null && balanceAfter < 0 && (
              <span className={styles.balanceAfter__warn}> (Không đủ số dư)</span>
            )}
          </p>
        )}
      </div>

      {/* Description */}
      <div className={styles.field}>
        <label htmlFor={descriptionId} className={styles.field__label}>
          Nội dung chuyển khoản
        </label>
        <textarea
          id={descriptionId}
          className={styles.field__textarea}
          maxLength={100}
          rows={3}
          placeholder="Nhập nội dung..."
          value={formData.description}
          aria-describedby={`${descriptionId}-counter`}
          onChange={(e) => onChange({ description: e.target.value })}
        />
        <span id={`${descriptionId}-counter`} className={styles.field__counter} aria-live="polite">
          {formData.description.length}/100
        </span>
      </div>

      <Button
        type="button"
        variant="primary"
        size="lg"
        className={styles.actionBtn}
        onClick={handleContinue}
      >
        Tiếp tục
      </Button>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Confirm
// ---------------------------------------------------------------------------

interface Step2Props {
  formData: FormData;
  onBack: () => void;
  onConfirm: () => void;
}

function Step2Confirm({ formData, onBack, onConfirm }: Step2Props): JSX.Element {
  const fromAccount  = MOCK_ACCOUNTS.find((a) => a.id === formData.fromAccountId)!;
  const amountNumber = Number(formData.amount) || 0;
  const total        = amountNumber + TRANSFER_FEE;

  const rows: { label: string; value: string; highlight?: boolean }[] = [
    { label: 'Từ tài khoản',    value: `${fromAccount.name} (${formatAccountNumber(fromAccount.number)})` },
    { label: 'Tài khoản nhận',  value: formatAccountNumber(formData.toAccountNumber) },
    { label: 'Số tiền',         value: formatCurrency(amountNumber), highlight: true },
    { label: 'Phí giao dịch',   value: formatCurrency(TRANSFER_FEE) },
    { label: 'Tổng thanh toán', value: formatCurrency(total), highlight: true },
    { label: 'Nội dung',        value: formData.description || '(không có)' },
  ];

  return (
    <section aria-labelledby="step2-heading">
      <h2 id="step2-heading" className={styles.stepTitle}>Xác nhận chuyển khoản</h2>

      <Card variant="outlined" padding="none" className={styles.summaryCard}>
        <CardContent>
          <dl className={styles.summaryList}>
            {rows.map(({ label, value, highlight }) => (
              <div key={label} className={styles.summaryList__row}>
                <dt className={styles.summaryList__label}>{label}</dt>
                <dd className={`${styles.summaryList__value} ${highlight ? styles['summaryList__value--highlight'] : ''}`}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Alert variant="info" className={styles.confirmAlert}>
        Vui lòng kiểm tra kỹ thông tin trước khi xác nhận. Giao dịch không thể hoàn tác.
      </Alert>

      <div className={styles.actionRow}>
        <Button type="button" variant="secondary" size="lg" onClick={onBack}>
          Quay lại
        </Button>
        <Button type="button" variant="primary" size="lg" onClick={onConfirm}>
          Xác nhận chuyển khoản
        </Button>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Result
// ---------------------------------------------------------------------------

interface Step3Props {
  result: TransferResult;
  formData: FormData;
  onNewTransfer: () => void;
  onHome: () => void;
  onRetry: () => void;
}

function Step3Result({ result, formData, onNewTransfer, onHome, onRetry }: Step3Props): JSX.Element {
  const amountNumber = Number(formData.amount) || 0;

  if (result.success) {
    return (
      <section aria-labelledby="step3-heading" className={styles.result}>
        <div className={styles.result__icon} aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="var(--color-success, #22c55e)" />
            <path d="M13 24l8 8 14-16" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 id="step3-heading" className={styles.result__title}>
          Chuyển khoản thành công!
        </h2>

        <dl className={styles.result__details}>
          <div className={styles.result__row}>
            <dt>Mã giao dịch</dt>
            <dd><code>{result.transactionId}</code></dd>
          </div>
          <div className={styles.result__row}>
            <dt>Thời gian</dt>
            <dd>
              {result.timestamp
                ? result.timestamp.toLocaleString('vi-VN', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })
                : '—'}
            </dd>
          </div>
          <div className={styles.result__row}>
            <dt>Số tiền</dt>
            <dd className={styles.result__amount}>{formatCurrency(amountNumber)}</dd>
          </div>
          <div className={styles.result__row}>
            <dt>Tài khoản nhận</dt>
            <dd>{formatAccountNumber(formData.toAccountNumber)}</dd>
          </div>
        </dl>

        <div className={styles.actionRow}>
          <Button type="button" variant="secondary" size="lg" onClick={onNewTransfer}>
            Chuyển khoản mới
          </Button>
          <Button type="button" variant="primary" size="lg" onClick={onHome}>
            Về trang chủ
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="step3-heading" className={styles.result}>
      <div className={`${styles.result__icon} ${styles['result__icon--error']}`} aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="24" fill="var(--color-error, #ef4444)" />
          <path d="M16 16l16 16M32 16L16 32" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      <h2 id="step3-heading" className={styles.result__title}>
        Chuyển khoản thất bại
      </h2>

      <Alert variant="error" className={styles.result__errorMsg}>
        {result.errorMessage ?? 'Đã xảy ra lỗi. Vui lòng thử lại sau.'}
      </Alert>

      <div className={styles.actionRow}>
        <Button type="button" variant="secondary" size="lg" onClick={onRetry}>
          Thử lại
        </Button>
        <Button type="button" variant="primary" size="lg" onClick={onHome}>
          Về trang chủ
        </Button>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main Transfer page
// ---------------------------------------------------------------------------

const INITIAL_FORM: FormData = {
  fromAccountId:   '',
  toAccountNumber: '',
  amount:          '',
  description:     '',
};

const Transfer: FC = (): JSX.Element => {
  console.log('%c[Remote: Transfer] rendered', 'color: #dc2626; font-weight: bold');
  const [searchParams] = useSearchParams();
  const navigate        = useNavigate();

  const preselectedId = searchParams.get('from') ?? '';
  const defaultForm: FormData = {
    ...INITIAL_FORM,
    fromAccountId: MOCK_ACCOUNTS.some((a) => a.id === preselectedId) ? preselectedId : '',
  };

  const [step, setStep]       = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [result, setResult]    = useState<TransferResult | null>(null);

  const patchForm = (patch: Partial<FormData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  // Simulate a transfer (mock — no real API)
  const handleConfirm = () => {
    const fakeSuccess = Math.random() > 0.2; // 80% success rate for demo
    const fakeResult: TransferResult = fakeSuccess
      ? {
          success:       true,
          transactionId: `TXN${Date.now()}`,
          timestamp:     new Date(),
        }
      : {
          success:      false,
          errorMessage: 'Hệ thống đang bảo trì, vui lòng thử lại sau ít phút.',
        };

    setResult(fakeResult);
    setStep(3);
  };

  const handleNewTransfer = () => {
    setStep(1);
    setFormData(defaultForm);
    setResult(null);
  };

  return (
    <main className={styles.page} aria-label="Chuyển khoản">
      <div className={styles.container}>
        <Card padding="lg">
          <CardHeader>
            <h1 className={styles.pageTitle}>Chuyển khoản</h1>
            <ProgressIndicator currentStep={step} />
          </CardHeader>

          <CardContent>
            {step === 1 && (
              <Step1Form
                formData={formData}
                onChange={patchForm}
                onContinue={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <Step2Confirm
                formData={formData}
                onBack={() => setStep(1)}
                onConfirm={handleConfirm}
              />
            )}

            {step === 3 && result && (
              <Step3Result
                result={result}
                formData={formData}
                onNewTransfer={handleNewTransfer}
                onRetry={() => setStep(2)}
                onHome={() => navigate(RoutesApp.HOME)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Transfer;
