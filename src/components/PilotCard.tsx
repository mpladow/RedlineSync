import type { KeyboardEvent, MouseEvent } from 'react';
import { ChevronUp, Gauge } from 'lucide-react';
import { DEFAULT_FOCUS_POOL, PILOT_CARD } from '../constants/pilotCard';
import { Stepper } from './Stepper';

type PilotCardProps = {
  focusPool: number;
  remainingFocus: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onFocusPoolChange: (value: number) => void;
};

type PilotCardModalProps = {
  isOpen: boolean;
  focusPool: number;
  remainingFocus: number;
  onFocusPoolChange: (value: number) => void;
  onClose: () => void;
};

export function PilotCard({ focusPool, remainingFocus, isExpanded, onToggleExpand, onFocusPoolChange }: PilotCardProps) {
  void remainingFocus;
  void isExpanded;
  void onFocusPoolChange;

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
        <div className="pilot-card-left">
          <div className="pilot-portrait" aria-hidden="true">
            <Gauge size={28} />
          </div>
          <div className="pilot-stat-grid" aria-label="Pilot frame stats">
            <span>Mob {PILOT_CARD.mobility}</span>
            <span>Def {PILOT_CARD.defence}</span>
          </div>
          <div className="pilot-focus-compact">
            <span>Focus Pool</span>
            <strong>{focusPool}</strong>
          </div>
        </div>
        <div className="pilot-card-info">
          <div className="pilot-card-heading">
            <div>
              <p className="eyebrow">Pilot</p>
              <h2>{PILOT_CARD.pilotName}</h2>
              <span>{PILOT_CARD.mechName}</span>
            </div>
          </div>
          <div className="pilot-ability-summary">
            <strong>{PILOT_CARD.specialAbility.name}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PilotCardModal({ isOpen, focusPool, remainingFocus, onFocusPoolChange, onClose }: PilotCardModalProps) {
  if (!isOpen) return null;
  const hasAdjustedFocusPool = focusPool !== DEFAULT_FOCUS_POOL;

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
              <Gauge size={42} />
            </div>
            <div className="pilot-stat-grid" aria-label="Pilot frame stats">
              <span>Mob {PILOT_CARD.mobility}</span>
              <span>Def {PILOT_CARD.defence}</span>
            </div>
          </div>
          <div className="pilot-id-body">
            <div className="pilot-id-header">
              <div>
                <p className="eyebrow">Pilot ID</p>
                <h2 id="pilot-id-title">{PILOT_CARD.pilotName}</h2>
                <span>{PILOT_CARD.mechName}</span>
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
            <article className="pilot-id-ability">
              <strong>{PILOT_CARD.specialAbility.name}</strong>
              <p>{PILOT_CARD.specialAbility.text}</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
