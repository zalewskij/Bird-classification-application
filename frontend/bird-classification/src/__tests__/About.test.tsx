import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Wrappers from '../TestWrappers';

import About from '../components/About';

test('Renders the about page', () => {
  render(<About />, { wrapper: Wrappers });

  expect(screen.getByText(/bird classification application/i)).toBeInTheDocument();
});