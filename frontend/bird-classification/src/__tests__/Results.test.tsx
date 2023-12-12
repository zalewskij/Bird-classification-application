import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Wrappers from '../TestWrappers';

import Results from '../components/Results';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual("react-router-dom"),
  useActionData: jest.fn().mockReturnValue({ id: '123' }),
}));

// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

test('Renders the Results page', () => {
  render(<Results />, { wrapper: Wrappers });

  expect(true).toBeTruthy();
});