import { FC, ReactElement, useState } from 'react';

import Tabs from 'components/tabs';
import Typography from 'components/typography';
import { Question } from 'types/crud/question';

import CodeOutput from './CodeOutput';
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
    label: 'Interviewer Notes',
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
}) => {
  const [tab, setTab] = useState(
    isInterviewer ? RightPanelTab.QUESTION : RightPanelTab.OUTPUT,
  );

  const renderBody = (): string | ReactElement => {
    switch (tab) {
      case RightPanelTab.QUESTION:
        return 'Question';
      case RightPanelTab.OUTPUT:
        return <CodeOutput output={output} />;
      case RightPanelTab.NOTES:
        return 'Notes';
    }
  };

  return (
    <div className="right-panel">
      <div className="right-panel__tabs">
        <Tabs
          onClick={setTab}
          selected={tab}
          tabs={isInterviewer ? interviewerTabs : intervieweeTabs}
        />
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
