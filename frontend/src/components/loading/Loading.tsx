import { HTMLAttributes, ReactElement } from 'react';
import FadeIn from 'react-fade-in';

import LoadingAnimation from './LoadingAnimation';
import './Loading.scss';

const Loading = ({
  className = '',
}: HTMLAttributes<HTMLDivElement>): ReactElement<
  HTMLAttributes<HTMLDivElement>,
  'div'
> => {
  return (
    <div className={`loading ${className}`}>
      <FadeIn>
        <LoadingAnimation height={5} />
      </FadeIn>
    </div>
  );
};

export default Loading;
