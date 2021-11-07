import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypePrismPlus from 'rehype-prism-plus';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import './Markdown.scss';

interface Props {
  content: string;
  className?: string;
}

const Markdown: FC<Props> = ({ content, className = '' }) => (
  <div className={`markdown${className ? ` ${className}` : ''}`}>
    <ReactMarkdown
      rehypePlugins={[rehypeKatex, [rehypePrismPlus, { ignoreMissing: true }]]}
      remarkPlugins={[[remarkGfm], remarkMath]}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default Markdown;
