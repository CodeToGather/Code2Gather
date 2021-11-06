import { FC } from 'react';

import Typography from 'components/typography';

interface Props {
  output: string;
}

const CodeOutput: FC<Props> = ({ output }) => {
  return (
    <Typography size="regular">
      <code className="code-output">{output}</code>
    </Typography>
  );
};

export default CodeOutput;
