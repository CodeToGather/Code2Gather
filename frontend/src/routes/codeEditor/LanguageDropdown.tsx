import { FC, useState } from 'react';

export enum ProgrammingLanguage {
  JAVA = 'java',
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
}

const languageNames: { [key: string]: string } = {
  [ProgrammingLanguage.JAVA]: 'Java',
  [ProgrammingLanguage.JAVASCRIPT]: 'JavaScript',
  [ProgrammingLanguage.PYTHON]: 'Python 3',
};

type Props = {
  language: ProgrammingLanguage;
  setLanguage: (language: ProgrammingLanguage) => void;
  className?: string;
};

const LanguageDropdown: FC<Props> = ({
  language,
  setLanguage,
  className = '',
}) => {
  const [isDropdownShown, setIsDropdownShown] = useState<boolean>(false);

  const handleSetLanguage = (language: ProgrammingLanguage): void => {
    setLanguage(language);
    setIsDropdownShown(false);
  };

  return (
    <div className="language-dropdown">
      <button
        className={`border-button${className !== '' ? ` ${className}` : ''}`}
        onClick={() => setIsDropdownShown((isShown) => !isShown)}
      >
        <div>{languageNames[language]}</div>
        <i className="fas fa-caret-down" />
      </button>
      {isDropdownShown ? (
        <div className="language-dropdown__dropdown">
          <button onClick={() => handleSetLanguage(ProgrammingLanguage.PYTHON)}>
            Python
          </button>
          <button
            onClick={() => handleSetLanguage(ProgrammingLanguage.JAVASCRIPT)}
          >
            JavaScript
          </button>
          <button onClick={() => handleSetLanguage(ProgrammingLanguage.JAVA)}>
            Java
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default LanguageDropdown;
