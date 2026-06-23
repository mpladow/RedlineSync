import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SYSTEMS } from '../constants/systems';

export function FocusAllocationDock({ focus, remainingFocus, isExpanded, onToggleExpanded, onSelectSystem }) {
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

      {isExpanded && (
        <div className="focus-dock-systems">
          {SYSTEMS.map((system) => (
            <button key={system.id} type="button" onClick={() => onSelectSystem(system.id)}>
              <span>{system.label}</span>
              <strong>{focus[system.id] ?? 0}</strong>
            </button>
          ))}
        </div>
      )}

      <div className="focus-dock-remaining">
        <strong>{remainingFocus}</strong>
        <span>Focus</span>
      </div>
    </aside>
  );
}
