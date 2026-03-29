import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  ReactNode,
} from "react";
import styles from "./Toast.module.scss";

// ============================================================================
// Types
// ============================================================================

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  /** Internal flag: true when the toast is in its fade-out phase */
  exiting: boolean;
}

export interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

// ============================================================================
// Constants
// ============================================================================

const ICONS: Record<ToastVariant, string> = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  error: "❌",
};

const AUTO_DISMISS_MS = 3000;
const EXIT_ANIMATION_MS = 300;

// ============================================================================
// Context
// ============================================================================

const ToastContext = createContext<ToastContextValue | null>(null);

// ============================================================================
// Single Toast card
// ============================================================================

interface ToastCardProps {
  toast: ToastItem;
  onClose: (id: string) => void;
}

function ToastCard({ toast, onClose }: ToastCardProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`${styles.toast} ${styles[toast.variant]} ${
        toast.exiting ? styles["toast--exiting"] : ""
      }`}
    >
      <span className={styles.toast__icon} aria-hidden="true">
        {ICONS[toast.variant]}
      </span>

      <span className={styles.toast__message}>{toast.message}</span>

      <button
        type="button"
        className={styles.toast__close}
        onClick={() => onClose(toast.id)}
        aria-label="Đóng thông báo"
      >
        ×
      </button>
    </div>
  );
}

// ============================================================================
// ToastContainer — renders the fixed overlay
// ============================================================================

interface ToastContainerProps {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}

function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className={styles.container} aria-label="Thông báo">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>
  );
}

// ============================================================================
// ToastProvider
// ============================================================================

export interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Keep refs to auto-dismiss timers so they can be cleared on manual close
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const removeToast = useCallback((id: string) => {
    // Mark as exiting first to trigger fade-out animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );

    // Remove from DOM after animation completes
    const exitTimer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timersRef.current.delete(id);
    }, EXIT_ANIMATION_MS);

    // Store exit timer so it is cleaned up if the component unmounts
    timersRef.current.set(`${id}__exit`, exitTimer);
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      setToasts((prev) => [...prev, { id, message, variant, exiting: false }]);

      // Schedule auto-dismiss
      const timer = setTimeout(() => {
        removeToast(id);
        timersRef.current.delete(id);
      }, AUTO_DISMISS_MS);

      timersRef.current.set(id, timer);
    },
    [removeToast]
  );

  const handleClose = useCallback(
    (id: string) => {
      // Cancel the pending auto-dismiss if the user closes manually
      const pending = timersRef.current.get(id);
      if (pending !== undefined) {
        clearTimeout(pending);
        timersRef.current.delete(id);
      }
      removeToast(id);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={handleClose} />
    </ToastContext.Provider>
  );
}

// ============================================================================
// useToast hook
// ============================================================================

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}
