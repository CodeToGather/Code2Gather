/* eslint-disable jsx-a11y/interactive-supports-focus */
import { FC, useState } from 'react';

import Typography from 'components/typography';

import './Modals.scss';

interface Props {
  onRate: (rating: number) => void;
}

const RatingModal: FC<Props> = ({ onRate }) => {
  const [rating, setRating] = useState(0);
  return (
    <>
      <Typography className="is-bold" size="large">
        Well done on completing the mock interview!
      </Typography>
      <Typography className="modal-instruction" size="regular">
        We would appreciate it if you could take some time to rate your partner.
        Please rate based on how much you enjoyed the interview, and not their
        proficiency as an interviewee.
      </Typography>
      <Typography className="modal-rating-container" size="large">
        <div className="modal-rating">
          <i
            className={`${rating >= 1 ? 'fas' : 'far'} fa-star`}
            onClick={(): void => setRating(1)}
            onKeyDown={(): void => setRating(1)}
            role="button"
          />
          <i
            className={`${rating >= 2 ? 'fas' : 'far'} fa-star`}
            onClick={(): void => setRating(2)}
            onKeyDown={(): void => setRating(2)}
            role="button"
          />
          <i
            className={`${rating >= 3 ? 'fas' : 'far'} fa-star`}
            onClick={(): void => setRating(3)}
            onKeyDown={(): void => setRating(3)}
            role="button"
          />
          <i
            className={`${rating >= 4 ? 'fas' : 'far'} fa-star`}
            onClick={(): void => setRating(4)}
            onKeyDown={(): void => setRating(4)}
            role="button"
          />
          <i
            className={`${rating >= 5 ? 'fas' : 'far'} fa-star`}
            onClick={(): void => setRating(5)}
            onKeyDown={(): void => setRating(5)}
            role="button"
          />
        </div>
      </Typography>
      <div className="modal-buttons">
        <button
          className="border-button is-success"
          disabled={rating === 0}
          onClick={(): void => onRate(rating)}
        >
          <Typography size="regular">Confirm</Typography>
        </button>
      </div>
    </>
  );
};

export default RatingModal;
