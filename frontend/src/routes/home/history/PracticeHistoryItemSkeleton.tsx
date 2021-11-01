import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import Typography from 'components/typography';

const PracticeHistoryItemSkeleton: FC = () => {
  return (
    <button className="border-button practice-history-item">
      <div className="practice-history-item--top">
        <div className="practice-history-item--top-left">
          <Typography className="is-gray" size="regular">
            <Skeleton width="120px" />
          </Typography>
          <Typography size="medium">
            <Skeleton width="200px" />
          </Typography>
        </div>
        <Typography className="is-gray" size="regular">
          <Skeleton width="50px" />
        </Typography>
      </div>
      <div className="practice-history-item--bottom">
        <div className="practice-history-item--bottom-left">
          <Typography
            className="is-grey practice-history-item--bottom-title"
            size="regular"
          >
            <Skeleton width="150px" />
          </Typography>
          <div style={{ width: '100%' }}>
            <Skeleton height="300px" width="100%" />
          </div>
        </div>
        <div className="practice-history-item--bottom-right">
          <Typography
            className="is-grey practice-history-item--bottom-title"
            size="regular"
          >
            <Skeleton width="125px" />
          </Typography>
          <Typography
            className="practice-history-item--bottom-right__notes-wrapper"
            size="regular"
          >
            <Skeleton height="300px" width="100%" />
          </Typography>
        </div>
      </div>
    </button>
  );
};

export default PracticeHistoryItemSkeleton;
