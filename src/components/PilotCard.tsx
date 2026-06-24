import { ChevronUp, UserRound } from 'lucide-react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { DEFAULT_FOCUS_POOL, getFrameConfiguration } from '../data/reference';
import type { PilotRecord } from '../types';
import { Stepper } from './Stepper';

type PilotCardProps = {
  pilot: PilotRecord;
  focusPool: number;
  remainingFocus: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onFocusPoolChange: (value: number) => void;
};

type PilotCardModalProps = {
  pilot: PilotRecord;
  isOpen: boolean;
  focusPool: number;
  remainingFocus: number;
  onFocusPoolChange: (value: number) => void;
  onClose: () => void;
};

export function PilotCard({
  pilot,
  focusPool,
  remainingFocus,
  isExpanded,
  onToggleExpand,
  onFocusPoolChange,
}: PilotCardProps) {
  void remainingFocus;
  void isExpanded;
  void onFocusPoolChange;
  const frame = getFrameConfiguration(pilot.frame);
  const pilotTraits = pilot.pilotTraits?.length ? pilot.pilotTraits : [pilot.specialAbility];

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggleExpand();
    }
  };

  return (
    <section
      className="meter-card focus-meter pilot-card"
      role="button"
      tabIndex={0}
      onClick={onToggleExpand}
      onKeyDown={handleKeyDown}
      aria-label="Show pilot ID"
    >
      <div className="pilot-card-main">
        <div className="pilot-card-info">
          <div className="pilot-card-heading">
            <div>
              <h2>{pilot.pilotName}</h2>
              <span>
                {pilot.frame} &quot;
                {pilot.mechName}
                &quot;
              </span>
            </div>
          </div>
          <div className="pilot-ability-summary">
            <strong>{pilotTraits.map((trait) => trait.name).join(' · ')}</strong>
          </div>
        </div>
        <div className="pilot-card-left">
          <div className="pilot-portrait" aria-label="Pilot portrait placeholder">
            <UserRound size={34} aria-hidden="true" />
          </div>
          <div className="pilot-stat-grid" aria-label="Pilot frame stats">
            <span>
              <small>Focus Pool</small>
              <strong>{focusPool}</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PilotCardModal({
  pilot,
  isOpen,
  focusPool,
  remainingFocus,
  onFocusPoolChange,
  onClose,
}: PilotCardModalProps) {
  if (!isOpen) return null;
  const hasAdjustedFocusPool = focusPool !== DEFAULT_FOCUS_POOL;
  const frame = getFrameConfiguration(pilot.frame);
  const pilotTraits = pilot.pilotTraits?.length ? pilot.pilotTraits : [pilot.specialAbility];

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="pilot-id-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pilot-id-title"
        onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
      >
        <div className="pilot-id-card">
          <div className="pilot-id-left">
            <div className="pilot-id-portrait" aria-hidden="true">
              <UserRound size={42} />
            </div>
            <div className="pilot-stat-grid" aria-label="Pilot frame stats">
              <span>
                <small>Mobility</small>
                <strong>{frame.mobility} MD</strong>
              </span>
              <span>
                <small>Defence Die</small>
                <strong>{frame.defenceDie}</strong>
              </span>
              <span className="sensor-range-stat">
                <small>Sensor Range</small>
                <strong>{frame.sensorRange} MD</strong>
              </span>
              <span>
                <small>Armour</small>
                <strong>{frame.armour}</strong>
              </span>
            </div>
          </div>
          <div className="pilot-id-body">
            <div className="pilot-id-header">
              <div>
                <p className="eyebrow">Pilot ID</p>
                <h2 id="pilot-id-title">{pilot.pilotName}</h2>
                <span>
                  {frame.name} &quot;
                  {pilot.mechName}
                  &quot;
                </span>
                <p className="pilot-id-frame">
                  <span>{frame.signatureSystem.name}</span>
                </p>
              </div>
              <button className="icon-action" type="button" onClick={onClose} aria-label="Close pilot ID">
                <ChevronUp size={20} />
              </button>
            </div>
            <div className="pilot-focus-control-group">
              <span>Focus Pool</span>
              <div className="pilot-focus-controls">
                <Stepper value={focusPool} min={0} max={12} onChange={onFocusPoolChange} label="focus pool" />
                <p>{remainingFocus} remaining</p>
              </div>
            </div>
            {hasAdjustedFocusPool && (
              <p className="pilot-focus-note">Focus Pool adjusted from default {DEFAULT_FOCUS_POOL}.</p>
            )}
            {pilotTraits.map((trait) => (
              <article className="pilot-id-ability" key={trait.name}>
                <strong>{trait.name}</strong>
                <p>{trait.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
