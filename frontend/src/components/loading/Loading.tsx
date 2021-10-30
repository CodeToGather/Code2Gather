import { HTMLAttributes, ReactElement } from 'react';
import FadeIn from 'react-fade-in';

import animationData from 'assets/animations/loading.json';

import Lottie from './Lottie';
import './Loading.scss';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const Loading = ({
  className = '',
}: HTMLAttributes<HTMLDivElement>): ReactElement<
  HTMLAttributes<HTMLDivElement>,
  'div'
> => {
  return (
    <div className={`loading ${className}`}>
      <FadeIn>
        <Lottie config={defaultOptions} height="10rem" width="auto" />
      </FadeIn>
    </div>
  );
};

export default Loading;
