import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { match, RouteComponentProps } from 'react-router-dom';

import CodeEditor from 'components/codeEditor';
import LanguageDropdown from 'components/languageDropdown';
import { GUEST } from 'constants/routes';
import { SITE_URL } from 'constants/urls';
import { useCodingSocket } from 'contexts/CodingSocketContext';
import { changeLanguage, joinRoom, updateCode } from 'lib/codingSocketService';
import { RootState } from 'reducers/rootReducer';
import { Language } from 'types/crud/language';

import './Guest.scss';

const Guest: FC<RouteComponentProps<{ id: string }>> = ({
  match,
}: {
  match: match<{ id: string }>;
}) => {
  const { socket } = useCodingSocket();
  const { doc, language } = useSelector((state: RootState) => state.coding);
  const guestRoomId = match.params.id;
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    joinRoom(socket, guestRoomId);
  }, [socket, guestRoomId]);

  const onCodeChange = (code: string): void => {
    updateCode(socket, doc, code);
  };

  const onCopyInviteLink = async (): Promise<void> => {
    await navigator.clipboard.writeText(`${SITE_URL}${GUEST}/${guestRoomId}`);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 1000);
  };

  return (
    <div className="guest">
      <div className="guest--top">
        <div className="guest--top__left-buttons">
          <LanguageDropdown
            className="guest--top__language-button"
            language={language}
            setLanguage={(language: Language): void => {
              changeLanguage(socket, language);
            }}
          />
          <button className="border-button guest--top__help-button">
            Help <i className="far fa-question-circle" />
          </button>
        </div>
        <div className="guest--top__right-buttons">
          <button
            className="border-button is-success guest--top__copy-button"
            onClick={onCopyInviteLink}
          >
            {hasCopied ? 'Copied!' : 'Copy Invite Link'}
          </button>
        </div>
      </div>
      <CodeEditor
        language={language}
        onChange={onCodeChange}
        value={doc.text.toString()}
        width="100vw"
      />
    </div>
  );
};

export default Guest;