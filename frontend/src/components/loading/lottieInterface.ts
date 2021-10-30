/* eslint-disable @typescript-eslint/no-explicit-any */
import CSS from 'csstype';
import {
  AnimationConfigWithData,
  AnimationConfigWithPath,
  AnimationDirection,
  AnimationEventCallback,
  AnimationEventName,
  AnimationItem,
  AnimationSegment,
} from 'lottie-web';

export interface ReactLottieEvent<T = any> {
  name: AnimationEventName;
  callback: AnimationEventCallback<T>;
}

export type ReactLottieConfigWithData = Partial<AnimationConfigWithData> & {
  animationData: any;
};

export type ReactLottieConfigWithPath = Partial<AnimationConfigWithPath> & {
  path: string;
};

export type ReactLottieConfig =
  | ReactLottieConfigWithData
  | ReactLottieConfigWithPath;

export interface ReactLottieState {
  config?: ReactLottieConfig;
  lottieEventListeners?: ReactLottieEvent[];
  height?: string;
  width?: string;
  playingState?: ReactLottiePlayingState;
  segments?: AnimationSegment | AnimationSegment[];
  speed?: number;
  style?: CSS.Properties;
  className?: string;
  direction?: AnimationDirection;
}

export interface ReactLottieOwnProps extends ReactLottieState {
  animationRef?: React.MutableRefObject<AnimationItem>;
  config: ReactLottieConfig;
}

export type ReactLottiePlayingState = 'playing' | 'paused' | 'stopped';
