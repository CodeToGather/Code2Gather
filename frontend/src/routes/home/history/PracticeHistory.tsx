import { FC, ReactElement } from 'react';

import Typography from 'components/typography';

import { PracticeHistoryState } from '../states';

import { mockMeetingRecords } from './mockData';
import PracticeHistoryItem from './PracticeHistoryItem';
import './PracticeHistory.scss';

type Props = PracticeHistoryState;

const PracticeHistory: FC<Props> = ({ isLoading, isError }) => {
  const renderBody = (): ReactElement => {
    if (isLoading) {
      return <>Loading...</>;
    }
    if (isError) {
      return <>Error</>;
    }
    // if (records.length === 0) {
    //   return <>No records found!</>;
    // }

    return (
      <>
        {mockMeetingRecords.map((record) => (
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
