import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import readmeContent from '../README.md?raw';

function resolveImageSrc(src?: string) {
  if (!src) return src;
  return src.startsWith('public/') ? `/${src.slice('public/'.length)}` : src;
}

export function ReadmeDrawer() {
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed bottom-0 left-16 right-0 z-40 flex flex-col bg-slate-900 border-t border-slate-800 shadow-[0_-8px_24px_rgba(0,0,0,0.35)]">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex h-11 w-full shrink-0 items-center justify-between px-6 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800/60"
      >
        <span className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-400" />
          Instruções do teste (README)
        </span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {open && (
        <div className="max-h-[55vh] overflow-y-auto border-t border-slate-800 px-8 py-6">
          <article className="mx-auto max-w-3xl text-sm leading-relaxed text-slate-300">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="mb-3 mt-0 text-xl font-bold text-white">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mb-2 mt-6 text-lg font-semibold text-white">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-2 mt-4 text-base font-semibold text-white">
                    {children}
                  </h3>
                ),
                p: ({ children }) => <p className="mb-3">{children}</p>,
                ul: ({ children }) => (
                  <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-3 list-decimal space-y-1 pl-5">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li>{children}</li>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 underline hover:text-blue-300"
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-white">
                    {children}
                  </strong>
                ),
                code: ({ className, children }) =>
                  className ? (
                    <code className="text-xs">{children}</code>
                  ) : (
                    <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-emerald-300">
                      {children}
                    </code>
                  ),
                pre: ({ children }) => (
                  <pre className="mb-3 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs">
                    {children}
                  </pre>
                ),
                img: ({ src, alt }) => (
                  <img
                    src={resolveImageSrc(src)}
                    alt={alt}
                    className="my-3 max-w-full rounded-lg border border-slate-800"
                  />
                ),
                hr: () => <hr className="my-4 border-slate-800" />,
              }}
            >
              {readmeContent}
            </ReactMarkdown>
          </article>
        </div>
      )}
    </div>
  );
}
