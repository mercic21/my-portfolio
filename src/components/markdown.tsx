import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

// react-markdown does not render raw HTML, so stored Markdown can't inject scripts.
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("prose max-w-none prose-headings:font-semibold prose-headings:tracking-tight", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const external = href?.startsWith("http");
            return (
              <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {children}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
