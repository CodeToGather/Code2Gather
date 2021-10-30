import { FC, useState } from 'react';
import { Difficulty } from 'types/crud/difficulty';

import Typography from 'components/typography';

import './Home.scss';

interface Props {
  onPracticeNow: (difficulty: Difficulty) => void;
}

const PracticePanel: FC<Props> = ({ onPracticeNow }) => {
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(
    undefined,
  );

  return (
    <div className="practice-panel">
      <Typography className="is-bold practice-panel__title" size="medium">
        Practice
      </Typography>
      <Typography className="practice-panel__instruction" size="regular">
        First, select a question difficulty:
      </Typography>
      <button
        className={`border-button practice-panel__button${
          difficulty === Difficulty.EASY ? ' is-success' : ''
        }`}
        onClick={(): void => setDifficulty(Difficulty.EASY)}
      >
        <Typography size="regular">Easy Question</Typography>
      </button>
      <button
        className={`border-button practice-panel__button${
          difficulty === Difficulty.MEDIUM ? ' is-success' : ''
        }`}
        onClick={(): void => setDifficulty(Difficulty.MEDIUM)}
      >
        <Typography size="regular">Medium Question</Typography>
      </button>
      <button
        className={`border-button practice-panel__button${
          difficulty === Difficulty.HARD ? ' is-success' : ''
        }`}
        onClick={(): void => setDifficulty(Difficulty.HARD)}
      >
        <Typography size="regular">Hard Question</Typography>
      </button>
      <Typography className="practice-panel__instruction bottom" size="regular">
        Then, just press &quot;Practice Now&quot; and we will find someone to do
        a mock interview with you!
      </Typography>
      <button
        className="primary-button practice-panel__button"
        disabled={difficulty == null}
        onClick={(): void => {
          if (difficulty == null) {
            return;
          }
          onPracticeNow(difficulty);
        }}
      >
        <Typography size="regular">Practice Now</Typography>
      </button>
      <button className="secondary-button practice-panel__button new-to-process">
        <Typography size="regular">I&apos;m new to the process.</Typography>
      </button>
    </div>
  );
};

export default PracticePanel;
