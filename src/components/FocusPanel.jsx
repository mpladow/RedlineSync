import { Activity } from 'lucide-react';
import { SYSTEMS } from '../constants/systems';
import { SystemCard } from './SystemCard';

export function FocusPanel({
  focus,
  focusPool,
  expandedSystems,
  expandedDamageTables,
  selectedDamageMarkers,
  focusedDamageMarker,
  onFocusChange,
  onToggleSystem,
  onToggleDamageTable,
  onToggleDamageMarker,
  onShowDamageMarker
}) {
  return (
    <section className="panel focus-panel">
      <div className="section-title">
        <Activity size={20} />
        <h2>Allocate Focus</h2>
      </div>
      <div className="focus-grid">
        {SYSTEMS.map((system) => {
          const selectedDamage = Array.isArray(selectedDamageMarkers[system.id])
            ? selectedDamageMarkers[system.id]
            : selectedDamageMarkers[system.id]
              ? [selectedDamageMarkers[system.id]]
              : [];

          return (
            <SystemCard
              key={system.id}
              system={system}
              focusValue={focus[system.id]}
              focusPool={focusPool}
              selectedDamage={selectedDamage}
              expandedActions={Boolean(expandedSystems[system.id])}
              expandedDamage={Boolean(expandedDamageTables[system.id])}
              focusedMarker={focusedDamageMarker}
              onFocusChange={onFocusChange}
              onToggleActions={onToggleSystem}
              onToggleDamage={onToggleDamageTable}
              onToggleMarker={onToggleDamageMarker}
              onShowDamageMarker={onShowDamageMarker}
            />
          );
        })}
      </div>
    </section>
  );
}
