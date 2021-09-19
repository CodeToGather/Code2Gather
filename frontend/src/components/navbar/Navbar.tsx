import { FC } from 'react';

import './Navbar.scss';

/**
 * Navbar component to be used at the top of the screen.
 *
 * Will automatically display the profile picture on the right
 * if the user is logged in.
 */
const Navbar: FC = () => {
  // TODO: Add profile picture once user information has been
  // added to application.
  return (
    <nav className="navbar">
      <h1 className="navbar__title">Code2Gather</h1>
    </nav>
  );
};

export default Navbar;
