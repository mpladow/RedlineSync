import { AlertTriangle, Clock3, Heart, Minus, Plus } from 'lucide-react';
import type { CSSProperties, MouseEvent } from 'react';
import { useState } from 'react';
import type { DamageMarker, FocusedDamageMarker, SystemDefinition, SystemId } from '../types';
import { SYSTEM_PRESENTATION } from '../ui/systemPresentation';
import { getDamageMarkerId, getDamageSeverity } from '../utils/helpers';
import { GlossaryText } from './GlossaryText';
import { Stepper } from './Stepper';

type SystemCardProps = {
  system: SystemDefinition;
  damageMarkers: DamageMarker[];
  structureValue: number;
  maximumStructureValue: number;
  focusValue: number;
  focusPool: number;
  assignedFocusValue: number;
  showFocusAssignment: boolean;
  selectedDamage: string[];
  expandedActions: boolean;
  expandedDamage: boolean;
  focusedMarker: FocusedDamageMarker | null;
  onFocusChange: (systemId: SystemId, value: number) => void;
  onStructureChange: (systemId: SystemId, value: number) => void;
  onToggleActions: (systemId: SystemId) => void;
  onToggleDamage: (systemId: SystemId) => void;
  onToggleMarker: (systemId: SystemId, markerName: string) => void;
  onShowDamageMarker: (systemId: SystemId, markerName: string) => void;
  onShowOvercommittedWarning: (systemName: string) => void;
  isCockpitPhase: boolean;
  isActivationPhase: boolean;
  isReadOnly?: boolean;
  allowReadOnlyDetailToggle?: boolean;
};

export function SystemCard({
  system,
  damageMarkers,
  structureValue,
  maximumStructureValue,
  focusValue,
  focusPool,
  assignedFocusValue,
  showFocusAssignment,
  selectedDamage,
  expandedActions,
  expandedDamage,
  focusedMarker,
  onFocusChange,
  onStructureChange,
  onToggleActions,
  onToggleDamage,
  onToggleMarker,
  onShowDamageMarker,
  onShowOvercommittedWarning,
  isCockpitPhase,
  isActivationPhase,
  isReadOnly = false,
  allowReadOnlyDetailToggle = false,
}: SystemCardProps) {
  const { id, label, actions } = system;
  const { icon: Icon, accent } = SYSTEM_PRESENTATION[id];
  const overcommittedFocusValue = showFocusAssignment ? assignedFocusValue : focusValue;
  const isOvercommitted = overcommittedFocusValue > 3;
  const focusLimit = showFocusAssignment ? assignedFocusValue : focusPool;
  const structureState =
    structureValue === 0 ? 'depleted' : structureValue === maximumStructureValue ? 'full' : 'damaged';
  const criticalDamageMarkers = damageMarkers.filter((marker) => marker.isCritical);
  const isCompromised =
    criticalDamageMarkers.length > 0 &&
    criticalDamageMarkers.every((marker) => {
      const markerId = getDamageMarkerId(marker);
      return selectedDamage.includes(markerId) || selectedDamage.includes(marker.name);
    });
  const [isMajorDamageModalOpen, setIsMajorDamageModalOpen] = useState(false);
  const [isReactionInfoOpen, setIsReactionInfoOpen] = useState(false);
  const [isRollingMajorDamage, setIsRollingMajorDamage] = useState(false);
  const availableDamageMarkers = damageMarkers.filter((marker) => {
    const markerId = getDamageMarkerId(marker);
    return !selectedDamage.includes(markerId) && !selectedDamage.includes(marker.name);
  });
  const canToggleDetailMode = !isReadOnly || allowReadOnlyDetailToggle;

  const closeMajorDamageModal = () => {
    if (!isRollingMajorDamage) {
      setIsMajorDamageModalOpen(false);
    }
  };

  const rollForMajorDamage = () => {
    if (isReadOnly || availableDamageMarkers.length === 0) return;

    setIsRollingMajorDamage(true);
    window.setTimeout(() => {
      const marker = availableDamageMarkers[Math.floor(Math.random() * availableDamageMarkers.length)];
      const markerId = getDamageMarkerId(marker);
      onToggleMarker(id, markerId);
      onShowDamageMarker(id, markerId);
      setIsRollingMajorDamage(false);
      setIsMajorDamageModalOpen(false);
    }, 2000);
  };

  return (
    <>
      <article
        id={`focus-system-${id}`}
        className={`system-card ${selectedDamage.length ? 'damaged' : ''} ${isReadOnly ? 'readonly' : ''}`}
        key={id}
        style={{ '--accent': accent } as CSSProperties}
      >
        <div className="system-header">
          <div className="system-copy">
            <Icon size={22} />
            <span>{label}</span>
            <span
              className={`system-structure-badge ${structureState}`}
              aria-label={`${label} structure ${structureValue} of ${maximumStructureValue}`}
            >
              <Heart size={14} aria-hidden="true" />
              {structureValue}/{maximumStructureValue}
            </span>
            {isOvercommitted &&
              (isReadOnly ? (
                <span className="system-status-badge overcommitted">Overcommitted</span>
              ) : (
                <button
                  className="system-status-badge overcommitted"
                  type="button"
                  onClick={() => onShowOvercommittedWarning(label)}
                  aria-label={`Show ${label} overcommitted warning`}
                >
                  Overcommitted
                </button>
              ))}
            {isCompromised && <span className="system-status-badge compromised">COMPROMISED</span>}
            {selectedDamage.map((markerId) => {
              const marker = damageMarkers.find(
                (item) => getDamageMarkerId(item) === markerId || item.name === markerId
              );
              const severity = marker ? getDamageSeverity(marker) : 'warning';
              const markerName = marker?.name ?? markerId;
              return isReadOnly ? (
                <span className={`system-damage-badge ${severity}`} key={markerId}>
                  {severity === 'critical' ? <AlertTriangle size={14} /> : null}
                  {markerName}
                </span>
              ) : (
                <button
                  className={`system-damage-badge ${severity}`}
                  key={markerId}
                  type="button"
                  onClick={() => onShowDamageMarker(id, markerId)}
                  aria-label={`Show ${label} damage marker ${markerName}`}
                >
                  {severity === 'critical' ? <AlertTriangle size={14} /> : null}
                  {markerName}
                </button>
              );
            })}
          </div>
          <div className="system-controls">
            {!isReadOnly && (
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
                readOnly={isReadOnly}
              />
            )}
          </div>
        </div>

        <div className="system-mode-toggle" aria-label={`${label} detail mode`}>
          <button
            className={expandedActions ? 'selected' : ''}
            type="button"
            aria-pressed={expandedActions}
            aria-label={`Show ${label} actions`}
            onClick={() => onToggleActions(id)}
            disabled={!canToggleDetailMode}
          >
            Actions
          </button>
          <button
            className={expandedDamage ? 'selected' : ''}
            type="button"
            aria-pressed={expandedDamage}
            aria-label={`Show ${label} damage markers`}
            onClick={() => onToggleDamage(id)}
            disabled={!canToggleDetailMode}
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
              {actions.map((action) => {
                const isReaction = action.name.startsWith('*');
                const actionName = isReaction ? action.name.slice(1) : action.name;

                return (
                  <div className="table-row" key={action.name}>
                    <span className="cost-pill">{action.cost}</span>
                    <strong className="action-name">
                      {isReaction && (
                        <button
                          className="reaction-info-button"
                          type="button"
                          onClick={() => setIsReactionInfoOpen(true)}
                          aria-label="Show reaction rule"
                        >
                          <Clock3 size={15} aria-hidden="true" />
                        </button>
                      )}
                      {actionName}
                    </strong>
                    <span>
                      <GlossaryText text={action.description} />
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          {expandedDamage && (
            <div className="data-table marker-table" aria-label={`${label} damage markers`}>
              <div className="structure-tracker">
                <div>
                  <span className="structure-tracker-label">Structure</span>
                  <output
                    className="structure-squares"
                    aria-label={`${label} has ${structureValue} of ${maximumStructureValue} structure points`}
                  >
                    {Array.from({ length: maximumStructureValue }, (_, index) => (
                      <span className={index < structureValue ? 'filled' : ''} key={index} aria-hidden="true" />
                    ))}
                  </output>
                  {structureValue === 0 &&
                    (isReadOnly ? (
                      <span className="system-major-damage-badge">Major Damage</span>
                    ) : (
                      <button
                        className="system-major-damage-badge"
                        type="button"
                        onClick={() => setIsMajorDamageModalOpen(true)}
                      >
                        Roll for Major Damage
                      </button>
                    ))}
                </div>
                {!isReadOnly && (
                  <div className="structure-controls">
                    <button
                      type="button"
                      onClick={() => onStructureChange(id, structureValue - 1)}
                      disabled={isReadOnly || structureValue === 0}
                      aria-label={`Decrease ${label} structure`}
                    >
                      <Minus size={16} />
                    </button>
                    <strong aria-hidden="true">
                      {structureValue}/{maximumStructureValue}
                    </strong>
                    <button
                      type="button"
                      onClick={() => onStructureChange(id, structureValue + 1)}
                      disabled={isReadOnly || structureValue === maximumStructureValue}
                      aria-label={`Increase ${label} structure`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="table-head">
                <span>Roll</span>
                <span>Name</span>
                <span>Effect</span>
              </div>
              {damageMarkers.map((marker) => {
                const markerId = getDamageMarkerId(marker);
                const isSelected = selectedDamage.includes(markerId) || selectedDamage.includes(marker.name);
                const severity = getDamageSeverity(marker);
                const isFocused = focusedMarker?.systemId === id && focusedMarker?.markerName === markerId;
                return (
                  <button
                    className={`table-row marker-row ${severity} ${isSelected ? 'selected' : ''} ${isFocused ? 'focused' : ''}`}
                    key={markerId}
                    type="button"
                    aria-pressed={isSelected}
                    data-system-id={id}
                    data-marker-name={markerId}
                    onClick={() => onToggleMarker(id, markerId)}
                    disabled={isReadOnly}
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

      {isMajorDamageModalOpen && (
        <div className="modal-backdrop" role="presentation" onClick={closeMajorDamageModal}>
          <section
            className="rules-modal phase-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`major-damage-title-${id}`}
            onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">{label}</p>
                <h2 id={`major-damage-title-${id}`}>Roll for Major Damage?</h2>
              </div>
            </div>
            <div className="phase-confirm-body">
              {isRollingMajorDamage ? (
                <div className="major-damage-rolling" role="status">
                  <div className="major-damage-signal" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <p>Assessing Damage</p>
                </div>
              ) : availableDamageMarkers.length > 0 ? (
                <div className="phase-confirm-actions">
                  <button type="button" className="secondary-action" onClick={closeMajorDamageModal}>
                    Cancel
                  </button>
                  <button type="button" className="primary-action" onClick={rollForMajorDamage}>
                    Roll
                  </button>
                </div>
              ) : (
                <>
                  <p>All damage options for this system are already selected.</p>
                  <div className="phase-confirm-actions">
                    <button type="button" className="primary-action" onClick={closeMajorDamageModal}>
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      )}

      {isReactionInfoOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsReactionInfoOpen(false)}>
          <section
            className="rules-modal phase-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`reaction-info-title-${id}`}
            onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">{label}</p>
                <h2 id={`reaction-info-title-${id}`}>Reaction</h2>
              </div>
            </div>
            <div className="phase-confirm-body">
              <p>A Reaction is used in response to an enemy action.</p>
              <div className="phase-confirm-actions">
                <button type="button" className="primary-action" onClick={() => setIsReactionInfoOpen(false)}>
                  Got it
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
