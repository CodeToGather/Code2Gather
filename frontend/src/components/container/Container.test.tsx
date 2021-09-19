import { render, screen } from '@testing-library/react';

import Container from './Container';

test('renders navbar title', () => {
  render(<Container />);
  const titleTextElement = screen.getByText(/code2gather/i);
  expect(titleTextElement).toBeInTheDocument();
});

test('renders background when hasBackground is true', () => {
  render(<Container hasBackground={true} />);
  const backgroundElement = screen.getByTestId(/container-background/i);
  expect(backgroundElement).toBeInTheDocument();
});
