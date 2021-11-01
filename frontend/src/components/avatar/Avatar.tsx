import { FC } from 'react';

import './Avatar.scss';

interface Props {
  src: string;
  alt: string;
  href?: string;
  onClick?: () => void;
  dataTestId?: string;
}

const Avatar: FC<Props> = ({ src, href, alt, onClick, dataTestId }) => {
  if (onClick == null && href == null) {
    return (
      <img alt={alt} className="avatar" data-testid={dataTestId} src={src} />
    );
  }

  if (onClick != null) {
    return (
      <button className="avatar avatar__button" onClick={onClick}>
        <img alt={alt} className="avatar" data-testid={dataTestId} src={src} />
      </button>
    );
  }

  return (
    <a
      className="avatar"
      data-testid={dataTestId}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <img alt={alt} className="avatar" src={src} />
    </a>
  );
};

export default Avatar;
