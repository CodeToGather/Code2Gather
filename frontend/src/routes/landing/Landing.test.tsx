import { screen } from '@testing-library/react';

import { authUserContextRender } from 'utils/testUtils';

import Landing from './Landing';

test('renders mock interviews text', () => {
  authUserContextRender(<Landing />);
  const mockInterviewsTextElement = screen.getByText(
    /mock interviews made easier./i,
  );
  expect(mockInterviewsTextElement).toBeInTheDocument();
});

test('renders excel text', () => {
  authUserContextRender(<Landing />);
  const excelTextElement = screen.getByText(
    /excel in your technical interviews today./i,
  );
  expect(excelTextElement).toBeInTheDocument();
});

test('renders github button', () => {
  authUserContextRender(<Landing />);
  const githubButtonElement = screen.getByText(/sign in with github/i);
  expect(githubButtonElement).toBeInTheDocument();
});

test('renders github button that logins via auth context', () => {
  let hasTriggeredLogin = false;
  const login = async (): Promise<void> => {
    hasTriggeredLogin = true;
  };
  authUserContextRender(<Landing />, { login });
  const githubButtonElement = screen.getByText(/sign in with github/i);
  githubButtonElement.click();
  expect(hasTriggeredLogin).toBe(true);
});

test('renders guest button', () => {
  authUserContextRender(<Landing />);
  const guestButtonElement = screen.getByText(/sign in as guest instead/i);
  expect(guestButtonElement).toBeInTheDocument();
});

test('renders demo image', () => {
  authUserContextRender(<Landing />);
  const imageElement = screen.getByAltText(/code2gather demo/i);
  expect(imageElement).toBeInTheDocument();
});
