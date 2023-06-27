import { render, screen } from '@testing-library/react';
import App from '..//app';

test('App has h1', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { level: 1 });
  expect(heading).toHaveTextContent(/^App$/);
});



