import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { match, RouteComponentProps, useHistory } from 'react-router-dom';

import CodeEditor from 'components/codeEditor';
import LanguageDropdown from 'components/languageDropdown';
import Typography from 'components/typography';
import { GUEST, ROOT } from 'constants/routes';
import { SITE_URL } from 'constants/urls';
import { useCodingSocket } from 'contexts/CodingSocketContext';
import {
  changeLanguage,
  joinCodingService,
  leaveCodingService,
  updateCode,
} from 'lib/codingSocketService';
import { RootState } from 'reducers/rootReducer';
import { Language } from 'types/crud/language';

import './Guest.scss';

const Guest: FC<RouteComponentProps<{ id: string }>> = ({
  match,
}: {
  match: match<{ id: string }>;
}) => {
  const { codingSocket } = useCodingSocket();
  const { doc, language } = useSelector((state: RootState) => state.coding);
  const guestRoomId = match.params.id;
  const [hasCopied, setHasCopied] = useState(false);
  const history = useHistory();

  useEffect(() => {
    joinCodingService(codingSocket, guestRoomId);

    return (): void => {
      leaveCodingService(codingSocket);
    };
  }, [codingSocket, guestRoomId]);

  const onCodeChange = (code: string): void => {
    updateCode(codingSocket, doc, code);
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
              changeLanguage(codingSocket, language);
            }}
          />
          <button className="border-button guest--top__help-button">
            <Typography size="regular">
              Help <i className="far fa-question-circle" />
            </Typography>
          </button>
        </div>
        <div className="guest--top__right-buttons">
          <button
            className="border-button is-success guest--top__copy-button"
            onClick={onCopyInviteLink}
          >
            <Typography size="regular">
              {hasCopied ? 'Copied!' : 'Copy Link'}
            </Typography>
          </button>
        </div>
      </div>
      <CodeEditor
        language={language}
        onChange={onCodeChange}
        value={doc.text.toString()}
        width="100vw"
      />
      <div className="guest--bottom">
        <button
          className="border-button is-danger guest--bottom__leave-button"
          onClick={(): void => {
            leaveCodingService(codingSocket);
            window.location.href = ROOT;
          }}
        >
          <Typography size="regular">Leave Playground</Typography>
        </button>
      </div>
    </div>
  );
};

export default Guest;
