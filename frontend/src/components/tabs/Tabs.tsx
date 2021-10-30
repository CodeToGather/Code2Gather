import { ReactElement } from 'react';

import Typography from 'components/typography';

import './Tabs.scss';

interface Props<T> {
  tabs: {
    label: string;
    value: T;
  }[];
  selected: T;
  onClick: (value: T) => void;
}

const Tabs = <T,>({ tabs, selected, onClick }: Props<T>): ReactElement => {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          className={`tab${tab.value === selected ? ' is-selected' : ''}`}
          key={`tab-${tab.label}`}
          onClick={(): void => onClick(tab.value)}
        >
          <Typography size="regular">{tab.label}</Typography>
        </button>
      ))}
    </div>
  );
};

export default Tabs;
