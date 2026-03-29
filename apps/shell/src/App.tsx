import { type JSX } from 'react';
import { BrowserRouter } from 'react-router';
import { ToastProvider } from '@nab/shared-ui';
import AppRoute from './routes';

export default function App(): JSX.Element {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppRoute />
      </BrowserRouter>
    </ToastProvider>
  );
}
