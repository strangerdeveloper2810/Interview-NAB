import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert } from './index';

describe('Alert', () => {
  it('renders with children content', () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it.each([
    ['info', 'ℹ️'],
    ['success', '✅'],
    ['warning', '⚠️'],
    ['error', '❌'],
  ] as const)('renders %s variant with %s icon', (variant, icon) => {
    render(<Alert variant={variant}>Message</Alert>);
    expect(screen.getByText(icon)).toBeInTheDocument();
  });

  it('has role="alert"', () => {
    render(<Alert>Notice</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('fires onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();
    render(<Alert onClose={handleClose}>Closeable</Alert>);
    await user.click(screen.getByRole('button', { name: /đóng thông báo/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not render close button when onClose is not provided', () => {
    render(<Alert>No close</Alert>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders title in a strong tag', () => {
    render(<Alert title="Important">Details here</Alert>);
    const title = screen.getByText('Important');
    expect(title.tagName).toBe('STRONG');
  });
});
