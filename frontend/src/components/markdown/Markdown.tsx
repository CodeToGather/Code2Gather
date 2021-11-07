import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkFootnotes from 'remark-footnotes';
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
      rehypePlugins={[
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeKatex,
        [rehypePrismPlus, { ignoreMissing: true }],
      ]}
      remarkPlugins={[
        [remarkGfm],
        [remarkFootnotes, { inlineNotes: true }],
        remarkMath,
      ]}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default Markdown;
