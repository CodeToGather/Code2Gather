import { FC } from 'react';
import autosize from 'autosize';

import './RightPanel.scss';

interface Props {
  notes: string;
  onChangeNotes: (notes: string) => void;
}

const InterviewerNotes: FC<Props> = ({ notes, onChangeNotes }) => {
  return (
    <textarea
      className="interviewer-notes"
      onChange={(event): void => {
        onChangeNotes(event.target.value);
        autosize(document.querySelectorAll('textarea'));
      }}
      placeholder="Enter notes here for the interviewee. The interviewee will only see these notes at the end of the entire practice interview."
      value={notes}
    />
  );
};

export default InterviewerNotes;
