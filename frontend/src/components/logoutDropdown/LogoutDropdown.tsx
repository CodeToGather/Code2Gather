import { FC } from 'react';

import Typography from 'components/typography';
import { useAuth } from 'contexts/AuthContext';

import './LogoutDropdown.scss';

interface Props {
  profileUrl: string;
  isDropdownShown: boolean;
  setIsDropdownShown: (isDropdownShown: boolean) => void;
  className?: string;
}

const LogoutDropdown: FC<Props> = ({
  profileUrl,
  isDropdownShown,
  setIsDropdownShown,
  className = '',
}) => {
  const { logout } = useAuth();

  const handleLogout = (): void => {
    setIsDropdownShown(false);
    logout();
  };

  return isDropdownShown ? (
    <div className={`logout-dropdown${className ? ` ${className}` : ''}`}>
      <button
        onClick={(): void => {
          window.open(profileUrl);
        }}
      >
        <Typography size="regular">GitHub Profile</Typography>
      </button>
      <button onClick={handleLogout}>
        <Typography size="regular">Logout</Typography>
      </button>
    </div>
  ) : null;
};

export default LogoutDropdown;
