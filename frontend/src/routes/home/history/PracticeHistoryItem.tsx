import { FC, useLayoutEffect, useRef } from 'react';

import ReadOnlyCodeEditor from 'components/codeEditor/ReadOnlyCodeEditor';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (!textareaRef.current) {
      return;
    }
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      300,
    )}px`;
  }, [textareaRef]);

  const date = new Date(props.createdAt);
  const day = date.toLocaleDateString('en-US', { day: 'numeric' });
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.toLocaleDateString('en-US', { year: 'numeric' });

  return (
    <button className="border-button practice-history-item">
      <div className="practice-history-item--top">
        <div className="practice-history-item--top-left">
          <Typography className="is-gray" size="regular">
            {[day, month, year].join(' ')}
          </Typography>
          <Typography size="medium">{props.questionTitle}</Typography>
        </div>
        <Typography className="is-gray" size="regular">
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
          <ReadOnlyCodeEditor
            height="300px"
            language={props.language}
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
            {props.feedbackToInterviewee ? (
              <textarea
                className="practice-history-item--bottom-right__notes"
                readOnly={true}
                ref={textareaRef}
                value={props.feedbackToInterviewee}
              />
            ) : (
              <div>
                The interviewer did not leave any notes{' '}
                <span aria-label="sad-emoji" role="img">
                  😞
                </span>
              </div>
            )}
          </Typography>
        </div>
      </div>
    </button>
  );
};

export default PracticeHistoryItem;
