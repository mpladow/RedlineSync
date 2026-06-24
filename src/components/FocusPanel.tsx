import { Activity, CheckCircle2, ChevronRight, Dice6, Gauge, Radar, Shield } from 'lucide-react';
import { getFrameConfiguration, SYSTEMS } from '../data/reference';
import type {
  DamageSelectionMap,
  ExpansionMap,
  FocusMap,
  FocusedDamageMarker,
  StructureMap,
  SystemId
} from '../types';
import { SystemCard } from './SystemCard';

type FocusPanelProps = {
  frameName: string;
  structure: StructureMap;
  maximumStructure: StructureMap;
  focus: FocusMap;
  focusPool: number;
  cockpitFocus: FocusMap;
  expandedSystems: ExpansionMap;
  expandedDamageTables: ExpansionMap;
  selectedDamageMarkers: DamageSelectionMap;
  focusedDamageMarker: FocusedDamageMarker | null;
  onFocusChange: (systemId: SystemId, value: number) => void;
  onStructureChange: (systemId: SystemId, value: number) => void;
  onToggleSystem: (systemId: SystemId) => void;
  onToggleDamageTable: (systemId: SystemId) => void;
  onToggleDamageMarker: (systemId: SystemId, markerName: string) => void;
  onShowDamageMarker: (systemId: SystemId, markerName: string) => void;
  showCockpitAlert: boolean;
  onShowOvercommittedWarning: (systemName: string) => void;
  onAdvancePhase: () => void;
  focusAllocationComplete: boolean;
  showFocusAssignments: boolean;
  isCockpitPhase: boolean;
  isActivationPhase: boolean;
};

export function FocusPanel({
  frameName,
  structure,
  maximumStructure,
  focus,
  focusPool,
  cockpitFocus,
  expandedSystems,
  expandedDamageTables,
  selectedDamageMarkers,
  focusedDamageMarker,
  onFocusChange,
  onStructureChange,
  onToggleSystem,
  onToggleDamageTable,
  onToggleDamageMarker,
  onShowDamageMarker,
  showCockpitAlert,
  onShowOvercommittedWarning,
  onAdvancePhase,
  focusAllocationComplete,
  showFocusAssignments,
  isCockpitPhase,
  isActivationPhase
}: FocusPanelProps) {
  const remainingFocus = focusPool - Object.values(focus).reduce((total, value) => total + value, 0);
  const frame = getFrameConfiguration(frameName);

  return (
    <section className={`panel focus-panel ${showCockpitAlert ? 'attention' : ''}`}>
      <div className="focus-panel-heading">
        <div className="focus-panel-title-row">
          <div className="section-title">
            <Activity size={20} />
            <h2>Systems</h2>
          </div>
          <div className="systems-frame-stats" aria-label="Frame stats">
            <span>
              <Gauge size={15} aria-hidden="true" />
              <small>Mobility</small>
              <strong>{frame.mobility} MD</strong>
            </span>
            <span>
              <Radar size={15} aria-hidden="true" />
              <small>Sensor Range</small>
              <strong>{frame.sensorRange} MD</strong>
            </span>
            <span>
              <Dice6 size={15} aria-hidden="true" />
              <small>Defence Die</small>
              <strong>D{frame.defenceDie}</strong>
            </span>
            <span className="systems-armour-stat">
              <Shield size={15} aria-hidden="true" />
              <small>Armour</small>
              <strong>{frame.armour}</strong>
            </span>
          </div>
        </div>
        {showCockpitAlert &&
          (focusAllocationComplete ? (
            <button className="focus-alert complete" type="button" onClick={onAdvancePhase}>
              <CheckCircle2 size={16} />
              <span>Focus assigned. Continue to Support Phase</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <div className="focus-alert">
              <span>Assign your Focus to your Systems.</span>
              <strong className="focus-alert-remaining">{remainingFocus} Focus remaining</strong>
            </div>
          ))}
      </div>
      <div className="focus-grid">
        {SYSTEMS.map((system) => {
          const selectedDamage = selectedDamageMarkers[system.id] ?? [];

          return (
            <SystemCard
              key={system.id}
              system={system}
              damageMarkers={frame.damageMarkers[system.id]}
              structureValue={structure[system.id]}
              maximumStructureValue={maximumStructure[system.id]}
              focusValue={focus[system.id]}
              focusPool={focusPool}
              assignedFocusValue={cockpitFocus[system.id] ?? 0}
              showFocusAssignment={showFocusAssignments}
              selectedDamage={selectedDamage}
              expandedActions={Boolean(expandedSystems[system.id])}
              expandedDamage={Boolean(expandedDamageTables[system.id])}
              focusedMarker={focusedDamageMarker}
              onFocusChange={onFocusChange}
              onStructureChange={onStructureChange}
              onToggleActions={onToggleSystem}
              onToggleDamage={onToggleDamageTable}
              onToggleMarker={onToggleDamageMarker}
              onShowDamageMarker={onShowDamageMarker}
              onShowOvercommittedWarning={onShowOvercommittedWarning}
              isCockpitPhase={isCockpitPhase}
              isActivationPhase={isActivationPhase}
            />
          );
        })}
      </div>
    </section>
  );
}
