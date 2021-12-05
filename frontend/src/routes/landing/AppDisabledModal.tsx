import { FC } from 'react';

import Typography from 'components/typography';
import { HELP } from 'constants/routes';

interface Props {
  onClose: () => void;
}

const AppDisabledModal: FC<Props> = ({ onClose }) => {
  return (
    <>
      <Typography className="is-bold" size="large">
        Code2Gather is currently disabled.
      </Typography>
      <Typography className="modal-instruction" size="regular">
        The application is currently unavailable for usage. This may be due to
        maintenance or due to services taken down for costs saving purposes.
        We&apos;re really sorry for any inconvenience caused.
      </Typography>
      <div className="modal-buttons">
        <button className="border-button" onClick={onClose}>
          <Typography size="regular">Close</Typography>
        </button>
        <button
          className="border-button is-success"
          onClick={(): void => {
            window.location.href = HELP;
          }}
        >
          <Typography size="regular">Check out the Help page</Typography>
        </button>
      </div>
    </>
  );
};

export default AppDisabledModal;
