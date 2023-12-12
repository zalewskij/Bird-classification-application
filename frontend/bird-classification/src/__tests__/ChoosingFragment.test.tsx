import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Wrappers from '../TestWrappers';

import ChoosingFragment from '../components/ChoosingFragment';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual("react-router-dom"),
  useSubmit: jest.fn().mockReturnValue({ id: '123' }),
}));

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
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

test('Renders the ChoosingFragment page', () => {
  render(<ChoosingFragment />, { wrapper: Wrappers });

  expect(screen.getByText(/To analyze the recording, select the relevant fragment using the slider below the spectrogram./i)).toBeInTheDocument();
});

test('The button is disabled if the recoding is too short', () => {
  render(<ChoosingFragment />, { wrapper: Wrappers });

  const button = screen.getByText('Analyze recording').parentElement;
  expect(button).toBeDisabled();
});
