import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Wrappers from '../TestWrappers';

import App from '../components/App';

test('Renders the main page', () => {
  render(<App />, { wrapper: Wrappers });

  expect(true).toBeTruthy();
});
