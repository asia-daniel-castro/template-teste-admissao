import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import readmeContent from '../README.md?raw';

const MIN_HEIGHT = 160;
const EDGE_MARGIN = 160;
const HEIGHT_STORAGE_KEY = 'readme-drawer-height';

function getMaxHeight() {
  return window.innerHeight - EDGE_MARGIN;
}

function getInitialHeight() {
  const stored = Number(localStorage.getItem(HEIGHT_STORAGE_KEY));
  const fallback = Math.round(window.innerHeight * 0.55);
  const initial = stored > 0 ? stored : fallback;
  return Math.min(Math.max(initial, MIN_HEIGHT), getMaxHeight());
}

interface ListItem {
  text: string;
  children: ListItem[];
}

type Block =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; code: string }
  | { type: 'list'; ordered: boolean; items: ListItem[] };

function resolveImageSrc(src: string) {
  return src.startsWith('public/') ? `/${src.slice('public/'.length)}` : src;
}

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const startIndex = i;
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    const fenceMatch = line.match(/^```(\w*)\s*$/);
    if (fenceMatch) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: 'code', code: codeLines.join('\n') });
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length as 1 | 2 | 3,
        text: headingMatch[2].trim(),
      });
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const ordered = /^\d+\.\s+/.test(line);
      const topRe = ordered ? /^\d+\.\s+(.*)$/ : /^[-*]\s+(.*)$/;
      const nestedRe = /^\s+(?:[-*]|\d+\.)\s+(.*)$/;
      const indentedRe = /^\s+(.*)$/;

      const items: ListItem[] = [];
      let currentTop: ListItem | null = null;
      let currentChild: ListItem | null = null;

      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !/^#{1,3}\s+/.test(lines[i]) &&
        !lines[i].startsWith('```')
      ) {
        const current = lines[i];
        let match: RegExpMatchArray | null;

        if ((match = current.match(topRe))) {
          currentTop = { text: match[1], children: [] };
          items.push(currentTop);
          currentChild = null;
        } else if ((match = current.match(nestedRe))) {
          currentChild = { text: match[1], children: [] };
          currentTop?.children.push(currentChild);
        } else if ((match = current.match(indentedRe))) {
          const target = currentChild ?? currentTop;
          if (target) target.text += ` ${match[1]}`;
          else break;
        } else {
          break;
        }
        i++;
      }

      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,3}\s+/.test(lines[i]) &&
      !lines[i].startsWith('```') &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i])
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: 'paragraph', text: paraLines.join(' ') });

    if (i === startIndex) i++;
  }

  return blocks;
}

const INLINE_RE =
  /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]*)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  INLINE_RE.lastIndex = 0;
  while ((match = INLINE_RE.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));

    if (match[1] !== undefined) {
      nodes.push(
        <img
          key={key++}
          src={resolveImageSrc(match[2])}
          alt={match[1]}
          className="my-3 max-w-full rounded-lg border border-slate-800"
        />,
      );
    } else if (match[3] !== undefined) {
      nodes.push(
        <a
          key={key++}
          href={match[4]}
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 underline hover:text-blue-300"
        >
          {match[3]}
        </a>,
      );
    } else if (match[5] !== undefined) {
      nodes.push(
        <strong key={key++} className="font-semibold text-white">
          {match[5]}
        </strong>,
      );
    } else if (match[6] !== undefined) {
      nodes.push(
        <code
          key={key++}
          className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-emerald-300"
        >
          {match[6]}
        </code>,
      );
    }

    lastIndex = INLINE_RE.lastIndex;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function renderListItems(items: ListItem[]) {
  return items.map((item, index) => (
    <li key={index}>
      {renderInline(item.text)}
      {item.children.length > 0 && (
        <ul className="mt-1 list-disc space-y-1 pl-5">
          {renderListItems(item.children)}
        </ul>
      )}
    </li>
  ));
}

const HEADING_CLASSES: Record<1 | 2 | 3, string> = {
  1: 'mb-3 mt-0 text-xl font-bold text-white',
  2: 'mb-2 mt-6 text-lg font-semibold text-white',
  3: 'mb-2 mt-4 text-base font-semibold text-white',
};

function renderBlocks(blocks: Block[]) {
  return blocks.map((block, index) => {
    switch (block.type) {
      case 'heading': {
        const Tag = `h${block.level}` as 'h1' | 'h2' | 'h3';
        return (
          <Tag key={index} className={HEADING_CLASSES[block.level]}>
            {renderInline(block.text)}
          </Tag>
        );
      }
      case 'paragraph':
        return (
          <p key={index} className="mb-3">
            {renderInline(block.text)}
          </p>
        );
      case 'code':
        return (
          <pre
            key={index}
            className="mb-3 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs"
          >
            <code>{block.code}</code>
          </pre>
        );
      case 'list': {
        const ListTag = block.ordered ? 'ol' : 'ul';
        return (
          <ListTag
            key={index}
            className={`mb-3 space-y-1 pl-5 ${block.ordered ? 'list-decimal' : 'list-disc'}`}
          >
            {renderListItems(block.items)}
          </ListTag>
        );
      }
    }
  });
}

export function ReadmeDrawer() {
  const [open, setOpen] = useState(true);
  const [height, setHeight] = useState(getInitialHeight);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ y: 0, height: 0 });
  const blocks = parseBlocks(readmeContent);

  useEffect(() => {
    if (!dragging) return;

    function handlePointerMove(e: PointerEvent) {
      const delta = dragStart.current.y - e.clientY;
      const next = dragStart.current.height + delta;
      setHeight(Math.min(Math.max(next, MIN_HEIGHT), getMaxHeight()));
    }

    function handlePointerUp() {
      setDragging(false);
      setHeight((current) => {
        localStorage.setItem(HEIGHT_STORAGE_KEY, String(current));
        return current;
      });
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragging]);

  function handleDragStart(e: ReactPointerEvent) {
    dragStart.current = { y: e.clientY, height };
    setDragging(true);
  }

  return (
    <div
      className="fixed bottom-0 left-16 right-0 z-40 flex flex-col bg-slate-900 border-t border-slate-800 shadow-[0_-8px_24px_rgba(0,0,0,0.35)]"
      style={dragging ? { cursor: 'row-resize', userSelect: 'none' } : undefined}
    >
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
        <>
          <div
            onPointerDown={handleDragStart}
            className="group relative h-2 w-full shrink-0 cursor-row-resize border-t border-slate-800"
          >
            <div className="absolute left-1/2 top-1/2 h-1 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-700 transition-colors group-hover:bg-blue-400" />
          </div>
          <div
            style={{ height }}
            className="overflow-y-auto px-8 pb-6 pt-2"
          >
            <article className="mx-auto max-w-3xl text-sm leading-relaxed text-slate-300">
              {renderBlocks(blocks)}
            </article>
          </div>
        </>
      )}
    </div>
  );
}
