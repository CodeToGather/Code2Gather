import { FC } from 'react';

import Typography from 'components/typography';

import './Home.scss';

const PracticePanel: FC = () => {
  return (
    <div className="practice-panel">
      <Typography className="is-bold practice-panel__title" size="medium">
        Practice
      </Typography>
      <Typography className="practice-panel__instruction" size="regular">
        First, select a question difficulty:
      </Typography>
      <button className="border-button practice-panel__button">
        <Typography size="regular">Easy Question</Typography>
      </button>
      <button className="border-button practice-panel__button">
        <Typography size="regular">Medium Question</Typography>
      </button>
      <button className="border-button practice-panel__button">
        <Typography size="regular">Hard Question</Typography>
      </button>
      <Typography className="practice-panel__instruction bottom" size="regular">
        Then, just press &quot;Practice Now&quot; and we will find someone to do
        a mock interview with you!
      </Typography>
      <button className="primary-button practice-panel__button">
        Practice Now
      </button>
      <button className="secondary-button practice-panel__button new-to-process">
        I&apos;m new to the process.
      </button>
    </div>
  );
};

export default PracticePanel;
