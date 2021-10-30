import { FC } from 'react';

import './Avatar.scss';

interface Props {
  src: string;
  href: string;
  alt: string;
  dataTestId?: string;
}

const Avatar: FC<Props> = ({ src, href, alt, dataTestId }) => {
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
