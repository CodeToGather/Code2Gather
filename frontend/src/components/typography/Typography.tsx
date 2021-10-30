import { FC } from 'react';

import './Typography.scss';

interface Props {
  size: 'small' | 'regular' | 'medium' | 'large' | 'extra-large';
  className?: string;
}

const Typography: FC<Props> = ({ children, size, className }) => {
  return (
    <div className={`typography-${size}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
};

export default Typography;
