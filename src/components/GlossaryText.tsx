import { BookOpen, ChevronUp } from 'lucide-react';
import type { MouseEvent } from 'react';
import { Fragment, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { GLOSSARY_ENTRIES } from '../data/reference/glossary';
import type { GlossaryEntry } from '../types';

type GlossaryTextProps = {
  text: string;
};

type TextSegment =
  | {
      type: 'text';
      text: string;
    }
  | {
      type: 'keyword';
      text: string;
      entry: GlossaryEntry;
    };

type MatchRange = {
  start: number;
  end: number;
  entry: GlossaryEntry;
};

const sortedGlossaryEntries = [...GLOSSARY_ENTRIES].sort((first, second) => {
  return second.keyword.length - first.keyword.length;
});

function isWordCharacter(character: string | undefined) {
  return Boolean(character && /[a-z0-9]/i.test(character));
}

function hasPhraseBoundary(text: string, start: number, end: number) {
  return !isWordCharacter(text[start - 1]) && !isWordCharacter(text[end]);
}

function overlapsExistingRange(ranges: MatchRange[], start: number, end: number) {
  return ranges.some((range) => start < range.end && end > range.start);
}

function findFirstAvailableMatch(text: string, entry: GlossaryEntry, ranges: MatchRange[]) {
  const haystack = text.toLocaleLowerCase();
  const needle = entry.keyword.toLocaleLowerCase();
  let index = haystack.indexOf(needle);

  while (index !== -1) {
    const end = index + needle.length;

    if (hasPhraseBoundary(text, index, end) && !overlapsExistingRange(ranges, index, end)) {
      return { start: index, end, entry };
    }

    index = haystack.indexOf(needle, index + 1);
  }

  return null;
}

function buildGlossarySegments(text: string): TextSegment[] {
  const ranges = sortedGlossaryEntries
    .reduce<MatchRange[]>((currentRanges, entry) => {
      const match = findFirstAvailableMatch(text, entry, currentRanges);
      return match ? [...currentRanges, match] : currentRanges;
    }, [])
    .sort((first, second) => first.start - second.start);

  if (ranges.length === 0) {
    return [{ type: 'text', text }];
  }

  const segments: TextSegment[] = [];
  let cursor = 0;

  ranges.forEach((range) => {
    if (range.start > cursor) {
      segments.push({ type: 'text', text: text.slice(cursor, range.start) });
    }

    segments.push({ type: 'keyword', text: text.slice(range.start, range.end), entry: range.entry });
    cursor = range.end;
  });

  if (cursor < text.length) {
    segments.push({ type: 'text', text: text.slice(cursor) });
  }

  return segments;
}

export function GlossaryText({ text }: GlossaryTextProps) {
  const [selectedEntry, setSelectedEntry] = useState<GlossaryEntry | null>(null);
  const segments = useMemo(() => buildGlossarySegments(text), [text]);

  return (
    <>
      {segments.map((segment, index) =>
        segment.type === 'keyword' ? (
          <button
            key={`${segment.entry.id}-${index}`}
            type="button"
            className="glossary-keyword"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedEntry(segment.entry);
            }}
          >
            {segment.text}
          </button>
        ) : (
          <Fragment key={`text-${index}`}>{segment.text}</Fragment>
        )
      )}
      {selectedEntry && <GlossaryModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}
    </>
  );
}

function GlossaryModal({ entry, onClose }: { entry: GlossaryEntry; onClose: () => void }) {
  const modal = (
    <div className="modal-backdrop glossary-backdrop" role="presentation" onClick={onClose}>
      <section
        className="rules-modal glossary-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`glossary-title-${entry.id}`}
        onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">Glossary</p>
            <h2 id={`glossary-title-${entry.id}`}>{entry.keyword}</h2>
          </div>
          <button className="icon-action" type="button" onClick={onClose} aria-label="Close glossary definition">
            <ChevronUp size={20} />
          </button>
        </div>
        <div className="glossary-modal-body">
          <div className="glossary-summary">
            <BookOpen size={18} aria-hidden="true" />
            <p>{entry.summary}</p>
          </div>
          {entry.definition.map((block, index) => {
            if (block.type === 'paragraph') {
              return <p key={index}>{block.text}</p>;
            }

            if (block.type === 'list') {
              return (
                <ul key={index}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            }

            if (block.type === 'table') {
              return (
                <div className="glossary-definition-table" key={index}>
                  <div className="glossary-definition-table-head">
                    {block.columns.map((column) => (
                      <span key={column}>{column}</span>
                    ))}
                  </div>
                  {block.rows.map((row) => (
                    <div className="glossary-definition-table-row" key={row.join('-')}>
                      {row.map((cell) => (
                        <span key={cell}>{cell}</span>
                      ))}
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <figure key={index}>
                <img src={block.src} alt={block.alt} />
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            );
          })}
        </div>
      </section>
    </div>
  );

  return createPortal(modal, document.body);
}
