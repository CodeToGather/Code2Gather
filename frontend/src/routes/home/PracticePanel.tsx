import { FC, useState } from 'react';

import Typography from 'components/typography';
import { ROOM } from 'constants/routes';
import { Difficulty } from 'types/crud/difficulty';

import './Home.scss';

interface Props {
  onPracticeNow: (difficulty: Difficulty) => void;
  isDisabled: boolean;
  isInRoom: boolean;
}

const PracticePanel: FC<Props> = ({ onPracticeNow, isDisabled, isInRoom }) => {
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(
    undefined,
  );

  return (
    <div className="practice-panel">
      <Typography
        className={`is-bold practice-panel__title${
          isInRoom ? ' is-faded' : ''
        }`}
        size="medium"
      >
        Practice
      </Typography>
      <Typography
        className={`practice-panel__instruction${isInRoom ? ' is-faded' : ''}`}
        size="regular"
      >
        First, select a question difficulty:
      </Typography>
      <button
        className={`border-button practice-panel__button${
          difficulty === Difficulty.EASY ? ' is-success' : ''
        }`}
        disabled={isDisabled || isInRoom}
        onClick={(): void => setDifficulty(Difficulty.EASY)}
      >
        <Typography size="regular">Easy Question</Typography>
      </button>
      <button
        className={`border-button practice-panel__button${
          difficulty === Difficulty.MEDIUM ? ' is-success' : ''
        }`}
        disabled={isDisabled || isInRoom}
        onClick={(): void => setDifficulty(Difficulty.MEDIUM)}
      >
        <Typography size="regular">Medium Question</Typography>
      </button>
      <button
        className={`border-button practice-panel__button${
          difficulty === Difficulty.HARD ? ' is-success' : ''
        }`}
        disabled={isDisabled || isInRoom}
        onClick={(): void => setDifficulty(Difficulty.HARD)}
      >
        <Typography size="regular">Hard Question</Typography>
      </button>
      <Typography
        className={`practice-panel__instruction bottom${
          isInRoom ? ' is-danger' : ''
        }`}
        size="regular"
      >
        {isInRoom
          ? "You're currently in the middle of an interview! Press the button below to re-join the room."
          : 'Then, just press "Practice Now" and we will find someone to do a mock interview with you!'}
      </Typography>
      <button
        className="primary-button practice-panel__button"
        disabled={(!isInRoom && difficulty == null) || isDisabled}
        onClick={(): void => {
          if (isInRoom) {
            window.location.href = ROOM;
            return;
          }
          if (difficulty == null) {
            return;
          }
          onPracticeNow(difficulty);
        }}
      >
        <Typography size="regular">
          {isInRoom ? 'Back to Room' : 'Practice Now'}
        </Typography>
      </button>
      <button
        className="secondary-button practice-panel__button new-to-process"
        disabled={isDisabled || isInRoom}
      >
        <Typography size="regular">I&apos;m new to the process.</Typography>
      </button>
    </div>
  );
};

export default PracticePanel;
