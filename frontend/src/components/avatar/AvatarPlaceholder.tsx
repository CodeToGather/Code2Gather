import { FC } from 'react';

import './Avatar.scss';

/**
 * A component simply to take up the space that
 * an avatar should take by default.
 */
const AvatarPlaceholder: FC = () => {
  return <div className="avatar">&nbsp;</div>;
};

export default AvatarPlaceholder;
