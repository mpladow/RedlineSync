import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { SYSTEMS } from '../data/reference';
import type { ExpansionMap, FocusMap, SystemId } from '../types';
import { SYSTEM_PRESENTATION } from '../ui/systemPresentation';

type FocusAllocationDockProps = {
  focus: FocusMap;
  focusCount: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onSelectSystem: (systemId: SystemId) => void;
  expandedSystems?: ExpansionMap;
  expandedDamageTables?: ExpansionMap;
};

export function FocusAllocationDock({
  focus,
  focusCount,
  isExpanded,
  onToggleExpanded,
  onSelectSystem,
  expandedSystems = {},
  expandedDamageTables = {}
}: FocusAllocationDockProps) {
  return (
    <aside className={`focus-dock ${isExpanded ? 'expanded' : 'collapsed'}`} aria-label="Focus allocation summary">
      <button
        className="focus-dock-toggle"
        type="button"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} focus allocation summary`}
        onClick={onToggleExpanded}
      >
        {isExpanded ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <div className="focus-dock-systems">
        {SYSTEMS.map((system) => {
          const isSelected = Boolean(expandedSystems[system.id] || expandedDamageTables[system.id]);
          const focusValue = focus[system.id] ?? 0;
          const { accent } = SYSTEM_PRESENTATION[system.id];
          return (
            <button
              key={system.id}
              type="button"
              className={isSelected ? 'selected' : ''}
              style={{ '--accent': accent } as CSSProperties}
              onClick={() => onSelectSystem(system.id)}
              tabIndex={isExpanded ? 0 : -1}
              aria-pressed={isSelected}
            >
              <span>{system.label}</span>
              <output className="focus-dots focus-dock-meter" aria-label={`${focusValue} ${system.label} focus`}>
                {Array.from({ length: focusValue }, (_, index) => (
                  <span className="filled" key={index} aria-hidden="true" />
                ))}
              </output>
            </button>
          );
        })}
      </div>

      <div className="focus-dock-remaining">
        <strong>{focusCount}</strong>
        <span>Focus</span>
      </div>
    </aside>
  );
}
