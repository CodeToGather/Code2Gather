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

test('renders profile', () => {
  authUserContextRender(<Navbar />, { data: testUser });
  const imageAnchorElement = screen.getByTestId(/profile-picture-anchor/i);
  expect(imageAnchorElement).toBeInTheDocument();
  expect(imageAnchorElement).toHaveAttribute('href', testUser.profileUrl);
  expect(imageAnchorElement).toHaveAttribute('rel', 'noopener noreferrer');
  expect(imageAnchorElement).toHaveAttribute('target', '_blank');

  const imageElement = screen.getByAltText('Profile');
  expect(imageElement).toBeInTheDocument();
  expect(imageElement).toHaveAttribute('src', testUser.photoUrl);
});
