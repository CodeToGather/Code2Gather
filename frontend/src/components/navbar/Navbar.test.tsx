import { render, screen } from '@testing-library/react';

import Navbar from './Navbar';

test('renders title', () => {
  render(<Navbar />);
  const titleTextElement = screen.getByText(/code2gather/i);
  expect(titleTextElement).toBeInTheDocument();
});
