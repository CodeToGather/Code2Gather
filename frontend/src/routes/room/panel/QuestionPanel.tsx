import { FC } from 'react';

import Markdown from 'components/markdown';
import Typography from 'components/typography';
import { Question } from 'types/crud/question';
import { toTitleCase } from 'utils/stringUtils';

import './RightPanel.scss';

interface Props {
  question: Question | null;
}

const QuestionPanel: FC<Props> = ({ question }) => {
  if (question == null) {
    return (
      <Typography className="is-grey" size="regular">
        The question is loading. Do refresh the page if it doesn&apos;t load
        even after a long time.
      </Typography>
    );
  }
  return (
    <div className="question-panel">
      <Typography className="question-panel__difficulty" size="small">
        {toTitleCase(question.difficulty)}
      </Typography>
      <Typography className="question-panel__title is-bold" size="medium">
        {question.title}
      </Typography>
      <Markdown
        content={question.text.trim() + '\n### Hints\n' + question.hints.trim()}
      />
    </div>
  );
};

export default QuestionPanel;
