import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import './Avatar.scss';

const AvatarSkeleton: FC = () => {
  return (
    <Skeleton
      circle={true}
      containerClassName="avatar"
      height="100%"
      width="100%"
    />
  );
};

export default AvatarSkeleton;
