import { FC } from 'react';

import Avatar from 'components/avatar';
import AvatarPlaceholder from 'components/avatar/AvatarPlaceholder';
import Typography from 'components/typography';
import { useUser } from 'contexts/UserContext';

import './Navbar.scss';

/**
 * Navbar component to be used at the top of the screen.
 *
 * Will automatically display the profile picture on the right
 * if the user is logged in.
 */
const Navbar: FC = () => {
  const user = useUser();
  return (
    <nav className="navbar">
      <Typography className="is-bold" size="large">
        Code2Gather
      </Typography>
      {user ? (
        <Avatar
          alt="Profile"
          dataTestId="profile-picture-anchor"
          href={user.profileUrl}
          src={user.photoUrl}
        />
      ) : (
        <AvatarPlaceholder />
      )}
    </nav>
  );
};

export default Navbar;
