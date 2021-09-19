import { FC, ReactElement } from 'react';

import Navbar from 'components/navbar';

import './Container.scss';

type Props = {
  hasBackground?: boolean;
};

/**
 * Container that wraps around the given children, giving it padding on the
 * left and right sides, as well as a navbar on top.
 */
const Container: FC<Props> = ({ hasBackground = false, children }) => {
  const backgroundWrap = (content: ReactElement): ReactElement => {
    if (hasBackground) {
      return (
        <div
          className="container-background"
          data-testid="container-background"
        >
          {content}
        </div>
      );
    }
    return content;
  };

  return backgroundWrap(
    <div className="container">
      <Navbar />
      <div>{children}</div>
    </div>,
  );
};

export default Container;
