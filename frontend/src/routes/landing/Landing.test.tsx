import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';

import { AuthContext } from 'contexts/AuthContext';
import { emptyPromiseFunction } from 'utils/functionUtils';

import Landing from './Landing';

// Renders the UI within an AuthContext.
const contextRender = (ui: ReactElement, login: () => Promise<void>) => {
  return render(
    <AuthContext.Provider
      value={{ data: null, logout: emptyPromiseFunction, login }}
    >
      {ui}
    </AuthContext.Provider>,
  );
};

test('renders mock interviews text', () => {
  contextRender(<Landing />, emptyPromiseFunction);
  const mockInterviewsTextElement = screen.getByText(
    /mock interviews made easier./i,
  );
  expect(mockInterviewsTextElement).toBeInTheDocument();
});

test('renders excel text', () => {
  contextRender(<Landing />, emptyPromiseFunction);
  const excelTextElement = screen.getByText(
    /excel in your technical interviews today./i,
  );
  expect(excelTextElement).toBeInTheDocument();
});

test('renders github button', () => {
  contextRender(<Landing />, emptyPromiseFunction);
  const githubButtonElement = screen.getByText(/sign in with github/i);
  expect(githubButtonElement).toBeInTheDocument();
});

test('renders github button that logins via auth context', () => {
  let hasTriggeredLogin = false;
  const login = async (): Promise<void> => {
    hasTriggeredLogin = true;
  };
  contextRender(<Landing />, login);
  const githubButtonElement = screen.getByText(/sign in with github/i);
  githubButtonElement.click();
  expect(hasTriggeredLogin).toBe(true);
});

test('renders guest button', () => {
  contextRender(<Landing />, emptyPromiseFunction);
  const guestButtonElement = screen.getByText(/sign in as guest instead/i);
  expect(guestButtonElement).toBeInTheDocument();
});

test('renders demo image', () => {
  contextRender(<Landing />, emptyPromiseFunction);
  const imageElement = screen.getByAltText(/code2gather demo/i);
  expect(imageElement).toBeInTheDocument();
});
