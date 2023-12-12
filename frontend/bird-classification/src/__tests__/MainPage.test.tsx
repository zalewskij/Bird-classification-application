import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Wrappers from '../TestWrappers';

import MainPage from '../components/MainPage';

test('Renders the MainPage page', () => {
  render(<MainPage />, { wrapper: Wrappers });

  expect(screen.getByText(/To classify a bird, start recording or upload a file./i)).toBeInTheDocument();
});

test('Informs if recording is unavaiable recording', async () => {
  const { getByText, queryByText } = render(<MainPage />, { wrapper: Wrappers });
  expect(queryByText('Stop')).toBeNull();
  const button1 = getByText('record');
  fireEvent.click(button1);
  const alert = getByText('Recording audio is not available on this device');
  expect(alert).toBeInTheDocument();
});
