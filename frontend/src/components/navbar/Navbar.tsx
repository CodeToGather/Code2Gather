import { FC } from 'react';

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
      <h1 className="navbar__title">Code2Gather</h1>
      {user && (
        <a href={user.profileUrl} rel="noopenner noreferrer" target="_blank">
          <img alt="Profile" className="navbar__image" src={user.photoUrl} />
        </a>
      )}
    </nav>
  );
};

export default Navbar;
