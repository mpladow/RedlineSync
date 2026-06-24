import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SYSTEMS } from '../data/reference';
import type { ExpansionMap, FocusMap, SystemId } from '../types';

type FocusAllocationDockProps = {
  focus: FocusMap;
  remainingFocus: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onSelectSystem: (systemId: SystemId) => void;
  expandedSystems?: ExpansionMap;
  expandedDamageTables?: ExpansionMap;
};

export function FocusAllocationDock({
  focus,
  remainingFocus,
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
          return (
            <button
              key={system.id}
              type="button"
              className={isSelected ? 'selected' : ''}
              onClick={() => onSelectSystem(system.id)}
              tabIndex={isExpanded ? 0 : -1}
              aria-pressed={isSelected}
            >
              <span>{system.label}</span>
              <strong>{focus[system.id] ?? 0}</strong>
            </button>
          );
        })}
      </div>

      <div className="focus-dock-remaining">
        <strong>{remainingFocus}</strong>
        <span>Focus</span>
      </div>
    </aside>
  );
}
