import { FC } from 'react';

import Typography from 'components/typography';

import './Modals.scss';

interface Props {
  isInterviewer: boolean;
  onClose: () => void;
}

const HelpModal: FC<Props> = ({ isInterviewer, onClose }) => {
  const interviewerInstruction =
    'You have access to the question and some hints. Conduct an interview with this question and take down notes to help the interviewee improve!';
  const intervieweeInstruction =
    'You will need to get the question from the interviewer and solve it. Feel free to execute your code if necessary!';
  return (
    <>
      <Typography className="is-bold" size="large">
        {isInterviewer
          ? 'You are the interviewer!'
          : 'You are the interviewee!'}
      </Typography>
      <Typography className="modal-instruction" size="regular">
        {isInterviewer ? interviewerInstruction : intervieweeInstruction}
      </Typography>
      <div className="modal-buttons">
        <button className="border-button" onClick={onClose}>
          <Typography size="regular">Got it!</Typography>
        </button>
      </div>
    </>
  );
};

export default HelpModal;
