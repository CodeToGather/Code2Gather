import { CSSProperties, FC } from 'react';

import animationData from 'assets/animations/loading.json';

import Lottie from './Lottie';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

interface Props {
  height?: number;
  style?: CSSProperties;
}

/**
 * Height is in em.
 */
const LoadingAnimation: FC<Props> = ({ height = 10, style = {} }) => {
  return (
    <div
      className="loading-animation"
      style={{ height: `${height}em`, width: `${height * 2.3}em`, ...style }}
    >
      <Lottie
        config={defaultOptions}
        height={`${height * 3.3}em`}
        width="auto"
      />
    </div>
  );
};

export default LoadingAnimation;
