import { BookOpen, ChevronLeft, ChevronRight, Shield, Swords, X } from 'lucide-react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { useState } from 'react';
import type { RulesCombatRole, RulesReferenceBlock, RulesReferenceListItem, RulesReferencePage } from '../types';
import { GlossaryText } from './GlossaryText';

type RulesReferenceModalProps = {
  page: RulesReferencePage | null;
  onClose: () => void;
};

export function RulesReferenceModal({ page, onClose }: RulesReferenceModalProps) {
  const [sectionIndex, setSectionIndex] = useState(0);

  if (!page) return null;

  const activeSection = page.sections[sectionIndex] ?? page.sections[0];
  const hasPreviousSection = sectionIndex > 0;
  const hasNextSection = sectionIndex < page.sections.length - 1;

  const goToPreviousSection = () => {
    setSectionIndex((current) => Math.max(0, current - 1));
  };

  const goToNextSection = () => {
    setSectionIndex((current) => Math.min(page.sections.length - 1, current + 1));
  };

  return (
    <div className="modal-backdrop rules-reference-backdrop" role="presentation" onClick={onClose}>
      <section
        className="rules-reference-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rules-reference-title"
        onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
      >
        <header className="rules-reference-header">
          <div>
            <p className="eyebrow">Rules Reference</p>
            <h2 id="rules-reference-title">{page.title}</h2>
            <p>{page.summary}</p>
          </div>
          <button className="icon-action" type="button" onClick={onClose} aria-label="Close rules reference">
            <X size={20} />
          </button>
        </header>

        <SectionNav
          currentTitle={activeSection.title}
          currentIndex={sectionIndex}
          totalSections={page.sections.length}
          hasPreviousSection={hasPreviousSection}
          hasNextSection={hasNextSection}
          onPrevious={goToPreviousSection}
          onNext={goToNextSection}
        />

        <div className="rules-reference-body">
          {page.overviewBlocks && page.overviewBlocks.length > 0 && (
            <article className="rules-reference-chapter-overview" aria-label={`${page.title} chapter overview`}>
              {page.overviewBlocks.map((block, index) => (
                <RulesReferenceBlockRenderer block={block} key={`${page.id}-overview-${index}`} />
              ))}
            </article>
          )}
          <article className="rules-reference-section">
            <h3>{activeSection.title}</h3>
            {activeSection.blocks.map((block, index) => (
              <RulesReferenceBlockRenderer block={block} key={`${activeSection.id}-${index}`} />
            ))}
          </article>
        </div>
      </section>
    </div>
  );
}

function SectionNav({
  currentTitle,
  currentIndex,
  totalSections,
  hasPreviousSection,
  hasNextSection,
  onPrevious,
  onNext,
  isBottom = false
}: {
  currentTitle: string;
  currentIndex: number;
  totalSections: number;
  hasPreviousSection: boolean;
  hasNextSection: boolean;
  onPrevious: () => void;
  onNext: () => void;
  isBottom?: boolean;
}) {
  return (
    <nav className={`rules-section-nav ${isBottom ? 'bottom' : 'top'}`} aria-label="Rules section navigation">
      <button type="button" className="secondary-action" onClick={onPrevious} disabled={!hasPreviousSection}>
        <ChevronLeft size={18} />
        <span>Previous</span>
      </button>
      <div>
        <span>
          {currentIndex + 1} / {totalSections}
        </span>
        <strong>{currentTitle}</strong>
      </div>
      <button type="button" className="secondary-action" onClick={onNext} disabled={!hasNextSection}>
        <span>Next</span>
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}

function RulesReferenceBlockRenderer({ block }: { block: RulesReferenceBlock }) {
  if (block.type === 'heading') {
    return (
      <h4 className={block.combatRole ? 'rules-reference-role-line' : undefined}>
        <CombatRoleIcons role={block.combatRole} />
        <span>{block.text}</span>
      </h4>
    );
  }

  if (block.type === 'paragraph') {
    return (
      <RoleBlock role={block.combatRole}>
        <p>
          <GlossaryText text={block.text} />
        </p>
      </RoleBlock>
    );
  }

  if (block.type === 'list') {
    return (
      <ul>
        {block.items.map((item) => {
          const listItem = normalizeListItem(item);
          return (
            <li
              className={(listItem.combatRole ?? block.combatRole) ? 'rules-reference-role-line' : undefined}
              key={listItem.text}
            >
              <CombatRoleIcons role={listItem.combatRole ?? block.combatRole} />
              <span>
                <GlossaryText text={listItem.text} />
              </span>
            </li>
          );
        })}
      </ul>
    );
  }

  if (block.type === 'table') {
    const tableColumns = {
      '--rules-table-columns': `repeat(${block.columns.length}, minmax(0, 1fr))`
    } as CSSProperties;

    return (
      <RoleBlock role={block.combatRole}>
        <div className="rules-reference-table" style={tableColumns}>
          <div className="rules-reference-table-head">
            {block.columns.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>
          {block.rows.map((row) => (
            <div className="rules-reference-table-row" key={row.join('-')}>
              {row.map((cell) => (
                <span key={cell}>
                  <GlossaryText text={cell} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </RoleBlock>
    );
  }

  if (block.type === 'callout') {
    return (
      <RoleBlock role={block.combatRole}>
        <aside className="rules-reference-callout">
          <BookOpen size={18} aria-hidden="true" />
          <div>
            <strong>{block.title}</strong>
            <p>
              <GlossaryText text={block.text} />
            </p>
          </div>
        </aside>
      </RoleBlock>
    );
  }

  if (!block.src) {
    return (
      <RoleBlock role={block.combatRole}>
        <figure className="rules-reference-image-placeholder">
          <div aria-label={block.alt}>
            <BookOpen size={28} aria-hidden="true" />
          </div>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      </RoleBlock>
    );
  }

  return (
    <RoleBlock role={block.combatRole}>
      <figure className="rules-reference-image">
        <img src={block.src} alt={block.alt} />
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>
    </RoleBlock>
  );
}

function normalizeListItem(item: RulesReferenceListItem) {
  return typeof item === 'string' ? { text: item } : item;
}

function RoleBlock({ role, children }: { role?: RulesCombatRole; children: ReactNode }) {
  if (!role) return <>{children}</>;

  return (
    <div className="rules-reference-role-block">
      <CombatRoleIcons role={role} />
      <div>{children}</div>
    </div>
  );
}

function CombatRoleIcons({ role }: { role?: RulesCombatRole }) {
  if (!role) return null;

  return (
    <span className={`rules-reference-role-icons ${role}`} aria-hidden="true">
      {(role === 'attacker' || role === 'both') && <Swords size={17} />}
      {(role === 'defender' || role === 'both') && <Shield size={17} />}
      {/* {(role === 'reaction') && <Clock size={17} />} */}
    </span>
  );
}
