import { type JSX } from 'react';
import { BrowserRouter } from 'react-router';
import AppRoute from './routes/AppRoute';

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <AppRoute />
    </BrowserRouter>
  );
}
