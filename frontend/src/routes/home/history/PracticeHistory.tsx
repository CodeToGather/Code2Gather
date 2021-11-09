import { FC, ReactElement, useEffect, useState } from 'react';

import Error from 'components/error';
import Typography from 'components/typography';

import { PracticeHistoryState } from '../states';

import PracticeHistoryItem from './PracticeHistoryItem';
import PracticeHistoryItemSkeleton from './PracticeHistoryItemSkeleton';
import './PracticeHistory.scss';

interface Props extends PracticeHistoryState {
  onSeeMore: () => Promise<void>;
}

const PracticeHistory: FC<Props> = ({
  isLoading,
  isError,
  records,
  isLastPage,
  onSeeMore,
}) => {
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    setIsFetching(false);
  }, [records]);

  const renderBody = (): ReactElement => {
    if (isLoading) {
      return <PracticeHistoryItemSkeleton />;
    }
    if (isError) {
      return <Error />;
    }
    if (records.length === 0) {
      return (
        <Typography className="practice-history__empty" size="regular">
          There are currently no records! Practice now to create your first!
        </Typography>
      );
    }

    return (
      <>
        {records.map((record) => (
          <PracticeHistoryItem {...record} key={`record-${record.id}`} />
        ))}
        <div className="see-more">
          {isLastPage ? (
            <Typography className="is-grey" size="regular">
              No earlier practices to see.
            </Typography>
          ) : (
            <button
              className="secondary-button"
              disabled={isFetching}
              onClick={(): void => {
                setIsFetching(true);
                onSeeMore();
              }}
            >
              <Typography size="regular">
                {isFetching
                  ? 'Fetching your practices...'
                  : 'See earlier practices.'}
              </Typography>
            </button>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="practice-history">
      <Typography className="is-bold practice-history__title" size="medium">
        Practice History
      </Typography>
      {renderBody()}
    </div>
  );
};

export default PracticeHistory;
