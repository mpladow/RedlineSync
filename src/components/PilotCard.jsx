import { ChevronDown, ChevronUp, Gauge } from 'lucide-react';
import { PILOT_CARD } from '../constants/pilotCard';
import { Stepper } from './Stepper';

export function PilotCard({ focusPool, remainingFocus, isExpanded, onToggleExpand, onFocusPoolChange }) {
  return (
    <section className={`meter-card focus-meter pilot-card ${isExpanded ? 'expanded' : ''}`}>
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
            <button
              className="collapse-toggle"
              type="button"
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? 'Hide' : 'Show'} pilot details`}
              onClick={onToggleExpand}
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
          <div className="pilot-ability-summary">
            <strong>{PILOT_CARD.specialAbility.name}</strong>
          </div>
          {isExpanded && (
            <div className="pilot-card-details">
              <div className="pilot-focus-controls">
                <Stepper value={focusPool} min={0} max={12} onChange={onFocusPoolChange} label="focus pool" />
                <p>{remainingFocus} remaining</p>
              </div>
              <p>{PILOT_CARD.specialAbility.text}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
