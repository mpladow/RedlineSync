import type { CSSProperties } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { FocusedDamageMarker, SystemDefinition, SystemId } from '../types';
import { SYSTEM_PRESENTATION } from '../ui/systemPresentation';
import { getDamageSeverity } from '../utils/helpers';
import { Stepper } from './Stepper';

type SystemCardProps = {
  system: SystemDefinition;
  focusValue: number;
  focusPool: number;
  assignedFocusValue: number;
  showFocusAssignment: boolean;
  selectedDamage: string[];
  expandedActions: boolean;
  expandedDamage: boolean;
  focusedMarker: FocusedDamageMarker | null;
  onFocusChange: (systemId: SystemId, value: number) => void;
  onToggleActions: (systemId: SystemId) => void;
  onToggleDamage: (systemId: SystemId) => void;
  onToggleMarker: (systemId: SystemId, markerName: string) => void;
  onShowDamageMarker: (systemId: SystemId, markerName: string) => void;
  onShowOvercommittedWarning: (systemName: string) => void;
  isCockpitPhase: boolean;
  isActivationPhase: boolean;
};

export function SystemCard({
  system,
  focusValue,
  focusPool,
  assignedFocusValue,
  showFocusAssignment,
  selectedDamage,
  expandedActions,
  expandedDamage,
  focusedMarker,
  onFocusChange,
  onToggleActions,
  onToggleDamage,
  onToggleMarker,
  onShowDamageMarker,
  onShowOvercommittedWarning,
  isCockpitPhase,
  isActivationPhase
}: SystemCardProps) {
  const { id, label, actions, damageMarkers } = system;
  const { icon: Icon, accent } = SYSTEM_PRESENTATION[id];
  const overcommittedFocusValue = showFocusAssignment ? assignedFocusValue : focusValue;
  const isOvercommitted = overcommittedFocusValue > 3;
  const focusLimit = showFocusAssignment ? assignedFocusValue : focusPool;
  return (
    <article
      id={`focus-system-${id}`}
      className={`system-card ${selectedDamage.length ? 'damaged' : ''}`}
      key={id}
      style={{ '--accent': accent } as CSSProperties}
    >
      <div className="system-header">
        <div className="system-copy">
          <Icon size={22} />
          <span>{label}</span>
          {isOvercommitted && (
            <button
              className="system-status-badge overcommitted"
              type="button"
              onClick={() => onShowOvercommittedWarning(label)}
              aria-label={`Show ${label} overcommitted warning`}
            >
              Overcommitted
            </button>
          )}
          {selectedDamage.map((markerName) => {
            const marker = damageMarkers.find((item) => item.name === markerName);
            const severity = marker ? getDamageSeverity(marker) : 'warning';
            return (
              <button
                className={`system-damage-badge ${severity}`}
                key={markerName}
                type="button"
                onClick={() => onShowDamageMarker(id, markerName)}
                aria-label={`Show ${label} damage marker ${markerName}`}
              >
                {severity === 'critical' ? <AlertTriangle size={14} /> : null}
                {markerName}
              </button>
            );
          })}
        </div>
        <div className="system-controls">
          <Stepper
            value={focusValue}
            max={focusLimit}
            onChange={(value) => onFocusChange(id, value)}
            label={`${label} focus`}
            assignedValue={showFocusAssignment ? assignedFocusValue : null}
            disableDecrement={isActivationPhase && focusValue === 0}
            emptyDisplay={isActivationPhase && focusValue === 0}
            dotDisplay={isCockpitPhase || isActivationPhase}
            dotCount={isActivationPhase ? assignedFocusValue : 6}
          />
        </div>
      </div>

      <div className="system-mode-toggle" aria-label={`${label} detail mode`}>
        <button
          className={expandedActions ? 'selected' : ''}
          type="button"
          aria-pressed={expandedActions}
          aria-label={`Show ${label} actions`}
          onClick={() => onToggleActions(id)}
        >
          Actions
        </button>
        <button
          className={expandedDamage ? 'selected' : ''}
          type="button"
          aria-pressed={expandedDamage}
          aria-label={`Show ${label} damage markers`}
          onClick={() => onToggleDamage(id)}
        >
          Damage
        </button>
      </div>

      <div className="system-detail-panel">
        {expandedActions && (
          <div className="data-table action-table" aria-label={`${label} actions`}>
            <div className="table-head">
              <span>Cost</span>
              <span>Action</span>
              <span>Description</span>
            </div>
            {actions.map((action) => (
              <div className="table-row" key={action.name}>
                <span className="cost-pill">{action.cost}</span>
                <strong>{action.name}</strong>
                <span>{action.description}</span>
              </div>
            ))}
          </div>
        )}
        {expandedDamage && (
          <div className="data-table marker-table" aria-label={`${label} damage markers`}>
            <div className="table-head">
              <span>Roll</span>
              <span>Name</span>
              <span>Effect</span>
            </div>
            {damageMarkers.map((marker) => {
              const isSelected = selectedDamage.includes(marker.name);
              const severity = getDamageSeverity(marker);
              const isFocused = focusedMarker?.systemId === id && focusedMarker?.markerName === marker.name;
              return (
                <button
                  className={`table-row marker-row ${severity} ${isSelected ? 'selected' : ''} ${isFocused ? 'focused' : ''}`}
                  key={marker.name}
                  type="button"
                  aria-pressed={isSelected}
                  data-system-id={id}
                  data-marker-name={marker.name}
                  onClick={() => onToggleMarker(id, marker.name)}
                >
                  <span className="roll-pill">{marker.roll}</span>
                  <strong className="marker-name">
                    {severity === 'critical' ? <AlertTriangle size={16} /> : null}
                    {marker.name}
                  </strong>
                  <span>{marker.effect}</span>
                </button>
              );
            })}
          </div>
        )}
        {!expandedActions && !expandedDamage && <p className="system-detail-empty">Select Actions or Damage.</p>}
      </div>
    </article>
  );
}
