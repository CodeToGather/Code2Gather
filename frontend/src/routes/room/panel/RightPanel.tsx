import { FC, ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Tabs from 'components/tabs';
import Typography from 'components/typography';
import { setHasNewExecutionOutputToFalse } from 'reducers/codingDux';
import { Question } from 'types/crud/question';

import CodeOutput from './CodeOutput';
import InterviewerNotes from './InterviewerNotes';
import QuestionPanel from './QuestionPanel';
import './RightPanel.scss';

enum RightPanelTab {
  QUESTION,
  NOTES,
  OUTPUT,
}

interface Props {
  isInterviewer: boolean;
  question: Question | null;
  // We'll keep track of the notes state in parent
  notes: string;
  onChangeNotes: (notes: string) => void;
  output: string;
  isExecutingCode: boolean;
  hasNewExecutionOutput: boolean;
  onClosePanel: () => void;
}

const intervieweeTabs = [
  {
    label: 'Output',
    value: RightPanelTab.OUTPUT,
  },
];

const interviewerTabs = [
  {
    label: 'Question',
    value: RightPanelTab.QUESTION,
  },
  {
    label: 'Notes',
    value: RightPanelTab.NOTES,
  },
  {
    label: 'Output',
    value: RightPanelTab.OUTPUT,
  },
];

const RightPanel: FC<Props> = ({
  isInterviewer,
  output,
  isExecutingCode,
  onClosePanel,
  notes,
  onChangeNotes,
  question,
  hasNewExecutionOutput,
}) => {
  const [tab, setTab] = useState(
    isInterviewer ? RightPanelTab.QUESTION : RightPanelTab.OUTPUT,
  );
  const [showBadge, setShowBadge] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isInterviewer && tab !== RightPanelTab.OUTPUT) {
      setTab(RightPanelTab.OUTPUT);
    }
  }, [isInterviewer, tab]);

  useEffect(() => {
    if (
      hasNewExecutionOutput &&
      isInterviewer &&
      tab !== RightPanelTab.OUTPUT
    ) {
      setShowBadge(true);
    }
  }, [hasNewExecutionOutput, isInterviewer, tab]);

  const renderBody = (): string | ReactElement => {
    switch (tab) {
      case RightPanelTab.QUESTION:
        return <QuestionPanel question={question} />;
      case RightPanelTab.OUTPUT:
        return <CodeOutput output={output} />;
      case RightPanelTab.NOTES:
        return <InterviewerNotes notes={notes} onChangeNotes={onChangeNotes} />;
    }
  };

  return (
    <div className="right-panel">
      <div className="right-panel__tabs">
        <div className="right-panel__tabs-container">
          <Tabs
            onClick={(newTab): void => {
              setTab(newTab);
              if (newTab === RightPanelTab.OUTPUT) {
                setShowBadge(false);
                dispatch(setHasNewExecutionOutputToFalse());
              }
            }}
            selected={tab}
            tabs={isInterviewer ? interviewerTabs : intervieweeTabs}
          />
          {showBadge ? <i className="fas fa-circle" /> : null}
        </div>
        <button
          className={`border-button${
            isInterviewer || isExecutingCode ? ' is-hidden' : ''
          }`}
          onClick={onClosePanel}
        >
          <Typography size="regular">
            Hide <i className="fas fa-times" />
          </Typography>
        </button>
      </div>
      <div className="right-panel__body">{renderBody()}</div>
    </div>
  );
};

export default RightPanel;
