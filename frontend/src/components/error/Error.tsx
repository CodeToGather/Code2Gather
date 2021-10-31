import { FC } from 'react';

import Typography from 'components/typography';
import { GITHUB_ISSUES_PAGE } from 'constants/urls';

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
        window.open(GITHUB_ISSUES_PAGE);
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
