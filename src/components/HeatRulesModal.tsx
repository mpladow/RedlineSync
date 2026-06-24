import type { MouseEvent } from 'react';
import { ChevronUp } from 'lucide-react';
import { HEAT_RULES } from '../data/reference';
import type { HeatState } from '../types';

type HeatRulesModalProps = {
  isOpen: boolean;
  heatState: HeatState | null;
  onClose: () => void;
};

export function HeatRulesModal({ isOpen, heatState, onClose }: HeatRulesModalProps) {
  if (!isOpen || !heatState) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="rules-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="heat-rules-title"
        onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">Heat rules</p>
            <h2 id="heat-rules-title">{heatState.label}</h2>
          </div>
          <button className="icon-action" type="button" onClick={onClose} aria-label="Close heat rules">
            <ChevronUp size={20} />
          </button>
        </div>
        <div className="modal-rule-list">
          {HEAT_RULES[heatState.className].map((rule) => (
            <p key={rule.text}>{rule.text}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
