import { screen } from '@testing-library/react';

import { authUserContextRender } from 'utils/testUtils';

import Container from './Container';

test('renders navbar title', () => {
  authUserContextRender(<Container />);
  const titleTextElement = screen.getByText(/code2gather/i);
  expect(titleTextElement).toBeInTheDocument();
});

test('renders background when hasBackground is true', () => {
  authUserContextRender(<Container hasBackground={true} />);
  const backgroundElement = screen.getByTestId(/container-background/i);
  expect(backgroundElement).toBeInTheDocument();
});
