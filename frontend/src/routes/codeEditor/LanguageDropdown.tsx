import { FC, useState } from 'react';
import { Language } from 'types/crud/language';

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
        <div>{languageNames[language]}</div>
        <i className="fas fa-caret-down" />
      </button>
      {isDropdownShown ? (
        <div className="language-dropdown__dropdown">
          <button onClick={(): void => handleSetLanguage(Language.PYTHON)}>
            Python
          </button>
          <button onClick={(): void => handleSetLanguage(Language.JAVASCRIPT)}>
            JavaScript
          </button>
          <button onClick={(): void => handleSetLanguage(Language.JAVA)}>
            Java
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default LanguageDropdown;
