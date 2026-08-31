import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { normalizeGeneratedMarkdown } from "@/lib/markdown-content";

type MarkdownContentProps = {
  content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="message-text markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          a: ({ children, ...props }) => (
            <a {...props} target="_blank" rel="noreferrer noopener">
              {children}
            </a>
          ),
          table: ({ children, ...props }) => (
            <div className="markdown-table-wrap">
              <table {...props}>{children}</table>
            </div>
          ),
        }}
      >
        {normalizeGeneratedMarkdown(content)}
      </ReactMarkdown>
    </div>
  );
}
