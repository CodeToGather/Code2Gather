import { FC, useEffect, useState } from 'react';
import FadeIn from 'react-fade-in';

import './Modal.scss';

interface Props {
  isVisible: boolean;
  className?: string;
}

const Modal: FC<Props> = ({ isVisible, className, children }) => {
  const [isActuallyVisible, setIsActuallyVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsActuallyVisible(true);
    }
  }, [isVisible]);

  return (
    <FadeIn
      className="modal-fade-in"
      onComplete={(): void => {
        if (isActuallyVisible && !isVisible) {
          setIsActuallyVisible(false);
        }
      }}
      visible={isVisible}
    >
      {isActuallyVisible ? (
        <div className="modal-container">
          <div className={`modal${className ? ` ${className}` : ''}`}>
            {children}
          </div>
          <div
            className="modal-background"
            data-backdrop="static"
            data-keyboard="false"
          />
        </div>
      ) : null}
    </FadeIn>
  );
};

export default Modal;
