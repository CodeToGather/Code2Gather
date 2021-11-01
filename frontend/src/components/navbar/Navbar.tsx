import { FC, useState } from 'react';

import Avatar from 'components/avatar';
import AvatarPlaceholder from 'components/avatar/AvatarPlaceholder';
import LogoutDropdown from 'components/logoutDropdown';
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
  const [isDropdownShown, setIsDropdownShown] = useState(false);
  return (
    <nav className="navbar">
      <Typography className="is-bold" size="large">
        Code2Gather
      </Typography>
      {user ? (
        <div style={{ position: 'relative' }}>
          <Avatar
            alt="Profile"
            dataTestId="profile-picture-anchor"
            onClick={(): void =>
              setIsDropdownShown((isDropdownShown) => !isDropdownShown)
            }
            src={user.photoUrl}
          />
          <LogoutDropdown
            className="navbar__dropdown"
            isDropdownShown={isDropdownShown}
            profileUrl={user.profileUrl}
            setIsDropdownShown={setIsDropdownShown}
          />
        </div>
      ) : (
        <AvatarPlaceholder />
      )}
    </nav>
  );
};

export default Navbar;
