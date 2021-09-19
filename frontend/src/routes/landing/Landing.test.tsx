import { render, screen } from '@testing-library/react';

import Landing from './Landing';

test('renders mock interviews text', () => {
  render(<Landing />);
  const mockInterviewsTextElement = screen.getByText(
    /mock interviews made easier./i,
  );
  expect(mockInterviewsTextElement).toBeInTheDocument();
});

test('renders excel text', () => {
  render(<Landing />);
  const excelTextElement = screen.getByText(
    /excel in your technical interviews today./i,
  );
  expect(excelTextElement).toBeInTheDocument();
});

test('renders github button', () => {
  render(<Landing />);
  const githubButtonElement = screen.getByText(/sign in with github/i);
  expect(githubButtonElement).toBeInTheDocument();
});

test('renders guest button', () => {
  render(<Landing />);
  const guestButtonElement = screen.getByText(/sign in as guest instead/i);
  expect(guestButtonElement).toBeInTheDocument();
});

test('renders demo image', () => {
  render(<Landing />);
  const imageElement = screen.getByAltText(/code2gather demo/i);
  expect(imageElement).toBeInTheDocument();
});
