import { screen } from '@testing-library/react';

import { User } from 'types/crud/user';
import { authUserContextRender } from 'utils/testUtils';

import Navbar from './Navbar';

const testUser: User = {
  id: 'testing',
  createdAt: new Date(),
  updatedAt: new Date(),
  githubUsername: 'cs3219-team-32',
  photoUrl: 'https://fakephotourl.com',
  profileUrl: 'https://github.com/fakeprofile',
};

test('renders title', () => {
  authUserContextRender(<Navbar />, { data: testUser });
  const titleTextElement = screen.getByText(/code2gather/i);
  expect(titleTextElement).toBeInTheDocument();
});

test('renders avatar and dropdown button', () => {
  authUserContextRender(<Navbar />, { data: testUser });
  const imageButtonElement = screen.getByTestId(/profile-picture-anchor/i);
  expect(imageButtonElement).toBeInTheDocument();

  const imageElement = screen.getByAltText('Profile');
  expect(imageElement).toBeInTheDocument();
  expect(imageElement).toHaveAttribute('src', testUser.photoUrl);
});

test('renders dropdown on clicking avatar', () => {
  authUserContextRender(<Navbar />, { data: testUser });
  const imageButtonElement = screen.getByTestId(/profile-picture-anchor/i);
  expect(imageButtonElement).toBeInTheDocument();
  imageButtonElement.click();
  const dropdownElement = screen.getByTestId(/logout-dropdown/);
  expect(dropdownElement).toBeInTheDocument();
});
