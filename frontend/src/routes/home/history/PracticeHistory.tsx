import { FC, ReactElement } from 'react';

import Error from 'components/error';
import Typography from 'components/typography';

import { PracticeHistoryState } from '../states';

import PracticeHistoryItem from './PracticeHistoryItem';
import './PracticeHistory.scss';

type Props = PracticeHistoryState;

const PracticeHistory: FC<Props> = ({ isLoading, isError, records }) => {
  const renderBody = (): ReactElement => {
    if (isLoading) {
      return <>Loading...</>;
    }
    if (!isError) {
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
