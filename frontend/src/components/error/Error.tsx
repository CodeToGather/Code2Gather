import { FC } from 'react';

import Typography from 'components/typography';

import './Error.scss';

interface Props {
  error?: string;
  className?: string;
}

const Error: FC<Props> = ({
  error = 'Something went wrong!',
  className = '',
}) => {
  return (
    <button
      className={`error border-button is-danger${
        className ? ` ${className}` : ''
      }`}
      onClick={(): void => {
        window.open(
          'https://github.com/CS3219-SE-Principles-and-Patterns/cs3219-project-ay2122-2122-s1-g32/issues/new',
        );
      }}
    >
      <Typography size="regular">
        <i className="fas fa-exclamation-triangle" /> {error} Click here to
        report this as an issue.
      </Typography>
    </button>
  );
};

export default Error;
