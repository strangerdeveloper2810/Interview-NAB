import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './index';

describe('Input', () => {
  it('renders with label and getByLabelText works', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('fires onChange on typing', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Input label="Name" onChange={handleChange} />);
    await user.type(screen.getByLabelText('Name'), 'hello');
    expect(handleChange).toHaveBeenCalledTimes(5);
  });

  it('shows error message with role="alert" when error prop is set', () => {
    render(<Input label="Email" error="Required field" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required field');
  });

  it('sets aria-invalid true when error is present', () => {
    render(<Input label="Email" error="Invalid" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-invalid false when no error', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'false');
  });

  it('renders disabled state', () => {
    render(<Input label="Email" disabled />);
    expect(screen.getByLabelText('Email')).toBeDisabled();
  });

  it('displays helperText', () => {
    render(<Input label="Email" helperText="We will never share your email" />);
    expect(screen.getByText('We will never share your email')).toBeInTheDocument();
  });

  it('hides helperText when error is present', () => {
    render(<Input label="Email" helperText="Helper" error="Error" />);
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Error');
  });
});
