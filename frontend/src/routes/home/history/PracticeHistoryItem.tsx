import { FC } from 'react';

import CodeEditor from 'components/codeEditor';
import Typography from 'components/typography';
import { Language } from 'types/crud/language';
import { MeetingRecord } from 'types/crud/meetingRecord';

type Props = MeetingRecord;

const languageMapping = {
  [Language.PYTHON]: 'Python',
  [Language.JAVA]: 'Java',
  [Language.JAVASCRIPT]: 'JavaScript',
};

const PracticeHistoryItem: FC<Props> = (props) => {
  const date = new Date(props.createdAt);
  const day = date.toLocaleDateString('en-US', { day: 'numeric' });
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.toLocaleDateString('en-US', { year: 'numeric' });
  return (
    <button className="border-button practice-history-item">
      <div className="practice-history-item--top">
        <div className="practice-history-item--top-left">
          <Typography className="is-gray" size="regular">
            {[day, month, year].join(' ')}{' '}
            <span className="practice-history-item--top-left-language">
              | {languageMapping[props.language]}
            </span>
          </Typography>
          <Typography size="medium">{props.questionTitle}</Typography>
        </div>
        <Typography
          className="is-gray practice-history-item--top-language"
          size="regular"
        >
          {languageMapping[props.language]}
        </Typography>
      </div>
      <div className="practice-history-item--bottom">
        <div className="practice-history-item--bottom-left">
          <Typography
            className="is-grey practice-history-item--bottom-title"
            size="regular"
          >
            Your Solution:{' '}
            {props.isSolved ? (
              <span className="is-success">Solved</span>
            ) : (
              <span className="is-danger">Unsolved</span>
            )}
          </Typography>
          <CodeEditor
            height="400px"
            language={props.language}
            onChange={(): void => undefined}
            readOnly={true}
            value={props.codeWritten}
            width="100%"
          />
        </div>
        <div className="practice-history-item--bottom-right">
          <Typography
            className="is-grey practice-history-item--bottom-title"
            size="regular"
          >
            Interviewer Notes
          </Typography>
          <Typography
            className="practice-history-item--bottom-right__notes-wrapper"
            size="regular"
          >
            <textarea
              className="practice-history-item--bottom-right__notes"
              readOnly={true}
              value={props.feedbackToInterviewee}
            />
          </Typography>
        </div>
      </div>
    </button>
  );
};

export default PracticeHistoryItem;
