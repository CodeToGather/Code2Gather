import { FC, useState } from 'react';

import Typography from 'components/typography';
import { Language } from 'types/crud/language';

import './LanguageDropdown.scss';

const languageNames: { [key: string]: string } = {
  [Language.JAVA]: 'Java',
  [Language.JAVASCRIPT]: 'JavaScript',
  [Language.PYTHON]: 'Python 3',
};

interface Props {
  language: Language;
  setLanguage: (language: Language) => void;
  className?: string;
}

const LanguageDropdown: FC<Props> = ({
  language,
  setLanguage,
  className = '',
}) => {
  const [isDropdownShown, setIsDropdownShown] = useState<boolean>(false);

  const handleSetLanguage = (language: Language): void => {
    setLanguage(language);
    setIsDropdownShown(false);
  };

  return (
    <div className="language-dropdown">
      <button
        className={`border-button${className !== '' ? ` ${className}` : ''}`}
        onClick={(): void => setIsDropdownShown((isShown) => !isShown)}
      >
        <Typography size="regular">
          <div>{languageNames[language]}</div>
          <i className="fas fa-caret-down" />
        </Typography>
      </button>
      {isDropdownShown ? (
        <div className="language-dropdown__dropdown">
          <button onClick={(): void => handleSetLanguage(Language.PYTHON)}>
            <Typography size="regular">Python</Typography>
          </button>
          <button onClick={(): void => handleSetLanguage(Language.JAVASCRIPT)}>
            <Typography size="regular">JavaScript</Typography>
          </button>
          <button onClick={(): void => handleSetLanguage(Language.JAVA)}>
            <Typography size="regular">Java</Typography>
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default LanguageDropdown;
