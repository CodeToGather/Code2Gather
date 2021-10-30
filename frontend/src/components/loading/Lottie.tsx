import { PureComponent, ReactNode } from 'react';
import lottiePlayer, { AnimationConfig, AnimationItem } from 'lottie-web';

import {
  ReactLottieConfig,
  ReactLottieConfigWithData,
  ReactLottieConfigWithPath,
  ReactLottieEvent,
  ReactLottieOwnProps,
  ReactLottiePlayingState,
  ReactLottieState,
} from './lottieInterface';

const CONTAINER_ID_ATTRIBUTE = 'data-lottie-container-id';

class Lottie extends PureComponent<ReactLottieOwnProps, ReactLottieState> {
  private config: ReactLottieConfig | undefined;
  private containerRef: Element | undefined;
  private animationItem: AnimationItem | undefined;
  private defaultLottieConfig: Partial<AnimationConfig> = {
    renderer: 'svg',
    loop: false,
    autoplay: true,
  };

  private static generateUuid = (): string =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  private ensureContainerId = (): void => {
    if (!this.containerRef?.getAttribute(CONTAINER_ID_ATTRIBUTE)) {
      this.containerRef?.setAttribute(
        CONTAINER_ID_ATTRIBUTE,
        Lottie.generateUuid(),
      );
    }
  };

  private destroy = (): void => {
    const id = this.containerRef?.getAttribute(CONTAINER_ID_ATTRIBUTE);
    if (id == null) {
      return;
    }
    this.animationItem?.destroy(id);
    this.containerRef?.removeAttribute(CONTAINER_ID_ATTRIBUTE);
  };

  public static defaultProps = {
    lottieEventListeners: [],
    playingState: 'playing',
    speed: 1,
    height: '100%',
    width: '100%',
  };

  override componentDidMount(): void {
    const {
      config: configFromProps,
      animationRef,
      lottieEventListeners,
    } = this.props;
    this.config = {
      ...this.defaultLottieConfig,
      ...configFromProps,
      container: this.containerRef,
    };
    this.animationItem = lottiePlayer.loadAnimation(
      this.config as AnimationConfig,
    );
    if (animationRef) {
      animationRef.current = this.animationItem;
    }
    this.ensureContainerId();
    if (lottieEventListeners) {
      this.addEventListeners(lottieEventListeners);
    }
    this.configureAnimationItem();
  }

  override componentDidUpdate(prevProps: ReactLottieOwnProps): void {
    const animationDataChanged =
      (this.config as ReactLottieConfigWithData).animationData !==
      (this.props.config as ReactLottieConfigWithData).animationData;
    const animationPathChanged =
      (this.config as ReactLottieConfigWithPath).path !==
      (this.props.config as ReactLottieConfigWithPath).path;
    if (animationDataChanged || animationPathChanged) {
      if (prevProps.lottieEventListeners) {
        this.removeEventListeners(prevProps.lottieEventListeners);
      }
      this.destroy();
      this.config = { ...this.config, ...this.props.config };
      this.animationItem = lottiePlayer.loadAnimation(
        this.config as AnimationConfig,
      );
      if (this.props.lottieEventListeners) {
        this.addEventListeners(this.props.lottieEventListeners);
      }
    }

    this.configureAnimationItem();
  }

  override componentWillUnmount(): void {
    if (this.props.lottieEventListeners) {
      this.removeEventListeners(this.props.lottieEventListeners);
    }
    this.destroy();
    (this.config as ReactLottieConfigWithData).animationData = null;
    (this.config as ReactLottieConfigWithPath).path = '';
    this.animationItem = undefined;
  }

  private configureAnimationItem(): void {
    const { playingState, speed, direction } = this.props;
    if (playingState) {this.setAnimationPlayingState(playingState);}
    if (speed) {this.animationItem?.setSpeed(speed);}
    if (direction) {this.animationItem?.setDirection(direction);}
  }

  private setAnimationPlayingState = (state: ReactLottiePlayingState): void => {
    switch (state) {
      case 'playing': {
        this.triggerPlayBasedOnSegments();
        return;
      }
      case 'stopped': {
        this.animationItem?.stop();
        return;
      }
      case 'paused': {
        this.animationItem?.pause();
        return;
      }
      default: {
        throw new Error('Playing state not specified.');
      }
    }
  };

  private triggerPlayBasedOnSegments(): void {
    const { segments } = this.props;
    if (segments) {
      this.animationItem?.playSegments(segments, true);
    } else {
      this.animationItem?.play();
    }
  }

  private addEventListeners(reactLottieEvents: ReactLottieEvent[]): void {
    reactLottieEvents.forEach(({ name, callback }) => {
      this.animationItem?.addEventListener(name, callback);
    });
  }

  private removeEventListeners(reactLottieEvents: ReactLottieEvent[]): void {
    reactLottieEvents.forEach(({ name, callback }) => {
      this.animationItem?.removeEventListener(name, callback);
    });
  }

  private setContainerRef = (element: HTMLElement | null): void => {
    this.containerRef = element ?? undefined;
  };

  override render(): ReactNode {
    const { width, height, style, className } = this.props;

    const lottieStyle = {
      width: width,
      height: height,
      ...style,
    };

    return (
      <div
        className={className}
        ref={this.setContainerRef}
        style={lottieStyle}
      />
    );
  }
}

export default Lottie;
