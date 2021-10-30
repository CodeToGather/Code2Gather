import { FC } from 'react';

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
        <a
          data-testid="profile-picture-anchor"
          href={user.profileUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <img alt="Profile" className="navbar__image" src={user.photoUrl} />
        </a>
      ) : (
        <div className="navbar__image">&nbsp;</div>
      )}
    </nav>
  );
};

export default Navbar;
