import { Activity, CheckCircle2 } from 'lucide-react';
import { SYSTEMS } from '../constants/systems';
import type { DamageSelectionMap, ExpansionMap, FocusMap, FocusedDamageMarker, SystemId } from '../types';
import { SystemCard } from './SystemCard';

type FocusPanelProps = {
  focus: FocusMap;
  focusPool: number;
  cockpitFocus: FocusMap;
  expandedSystems: ExpansionMap;
  expandedDamageTables: ExpansionMap;
  selectedDamageMarkers: DamageSelectionMap;
  focusedDamageMarker: FocusedDamageMarker | null;
  onFocusChange: (systemId: SystemId, value: number) => void;
  onToggleSystem: (systemId: SystemId) => void;
  onToggleDamageTable: (systemId: SystemId) => void;
  onToggleDamageMarker: (systemId: SystemId, markerName: string) => void;
  onShowDamageMarker: (systemId: SystemId, markerName: string) => void;
  showCockpitAlert: boolean;
  onShowOvercommittedWarning: (systemName: string) => void;
  focusAllocationComplete: boolean;
  showFocusAssignments: boolean;
  isActivationPhase: boolean;
};

export function FocusPanel({
  focus,
  focusPool,
  cockpitFocus,
  expandedSystems,
  expandedDamageTables,
  selectedDamageMarkers,
  focusedDamageMarker,
  onFocusChange,
  onToggleSystem,
  onToggleDamageTable,
  onToggleDamageMarker,
  onShowDamageMarker,
  showCockpitAlert,
  onShowOvercommittedWarning,
  focusAllocationComplete,
  showFocusAssignments,
  isActivationPhase
}: FocusPanelProps) {
  return (
    <section className={`panel focus-panel ${showCockpitAlert ? 'attention' : ''}`}>
      <div className="focus-panel-heading">
        <div className="section-title">
          <Activity size={20} />
          <h2>Allocate Focus</h2>
        </div>
        {showCockpitAlert && (
          <div className={`focus-alert ${focusAllocationComplete ? 'complete' : ''}`}>
            {focusAllocationComplete && <CheckCircle2 size={16} />}
            <span>Assign your Focus to your Systems.</span>
          </div>
        )}
      </div>
      <div className="focus-grid">
        {SYSTEMS.map((system) => {
          const selectedDamage = selectedDamageMarkers[system.id] ?? [];

          return (
            <SystemCard
              key={system.id}
              system={system}
              focusValue={focus[system.id]}
              focusPool={focusPool}
              assignedFocusValue={cockpitFocus[system.id] ?? 0}
              showFocusAssignment={showFocusAssignments}
              selectedDamage={selectedDamage}
              expandedActions={Boolean(expandedSystems[system.id])}
              expandedDamage={Boolean(expandedDamageTables[system.id])}
              focusedMarker={focusedDamageMarker}
              onFocusChange={onFocusChange}
              onToggleActions={onToggleSystem}
              onToggleDamage={onToggleDamageTable}
              onToggleMarker={onToggleDamageMarker}
              onShowDamageMarker={onShowDamageMarker}
              onShowOvercommittedWarning={onShowOvercommittedWarning}
              isActivationPhase={isActivationPhase}
            />
          );
        })}
      </div>
    </section>
  );
}
