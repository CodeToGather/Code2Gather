/* eslint-disable jsx-a11y/interactive-supports-focus */
import { FC, useState } from 'react';

import LoadingAnimation from 'components/loading/LoadingAnimation';
import Typography from 'components/typography';
import { RatingSubmissionState } from 'reducers/roomDux';

import './Modals.scss';

interface Props {
  onRate: (rating: number) => void;
  ratingSubmissionStatus: RatingSubmissionState;
}

const RatingModal: FC<Props> = ({ onRate, ratingSubmissionStatus }) => {
  const [rating, setRating] = useState(0);
  const handleChangeRating = (newRating: number): void => {
    if (ratingSubmissionStatus !== RatingSubmissionState.NOT_SUBMITTING) {
      return;
    }
    setRating(newRating);
  };

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
            onClick={(): void => handleChangeRating(1)}
            onKeyDown={(): void => handleChangeRating(1)}
            role="button"
          />
          <i
            className={`${rating >= 2 ? 'fas' : 'far'} fa-star`}
            onClick={(): void => handleChangeRating(2)}
            onKeyDown={(): void => handleChangeRating(2)}
            role="button"
          />
          <i
            className={`${rating >= 3 ? 'fas' : 'far'} fa-star`}
            onClick={(): void => handleChangeRating(3)}
            onKeyDown={(): void => handleChangeRating(3)}
            role="button"
          />
          <i
            className={`${rating >= 4 ? 'fas' : 'far'} fa-star`}
            onClick={(): void => handleChangeRating(4)}
            onKeyDown={(): void => handleChangeRating(4)}
            role="button"
          />
          <i
            className={`${rating >= 5 ? 'fas' : 'far'} fa-star`}
            onClick={(): void => handleChangeRating(5)}
            onKeyDown={(): void => handleChangeRating(5)}
            role="button"
          />
        </div>
      </Typography>
      <div className="modal-buttons">
        <button
          className="border-button is-success"
          disabled={
            rating === 0 ||
            ratingSubmissionStatus !== RatingSubmissionState.NOT_SUBMITTING
          }
          onClick={(): void => onRate(rating)}
        >
          <Typography className="modal-submit-button-text" size="regular">
            {ratingSubmissionStatus === RatingSubmissionState.SUBMITTING
              ? 'Submitting'
              : 'Confirm'}{' '}
            {ratingSubmissionStatus === RatingSubmissionState.SUBMITTING ? (
              <LoadingAnimation height={0.7} />
            ) : null}
          </Typography>
        </button>
      </div>
    </>
  );
};

export default RatingModal;
