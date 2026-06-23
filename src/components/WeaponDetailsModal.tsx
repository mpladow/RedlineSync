import type { MouseEvent } from 'react';
import { ChevronUp } from 'lucide-react';
import type { Weapon } from '../types';

type WeaponDetailsModalProps = {
  weapon: Weapon | null;
  onClose: () => void;
};

export function WeaponDetailsModal({ weapon, onClose }: WeaponDetailsModalProps) {
  if (!weapon) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="rules-modal weapon-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="weapon-details-title"
        onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">{weapon.slot} weapon</p>
            <h2 id="weapon-details-title">{weapon.name}</h2>
          </div>
          <button className="icon-action" type="button" onClick={onClose} aria-label="Close weapon details">
            <ChevronUp size={20} />
          </button>
        </div>
        <div className="weapon-modal-body">
          <div className="weapon-stats modal-weapon-stats">
            <span>Attack Die {weapon.attackDie}</span>
            <span>Dmg {weapon.damage}</span>
            <span>
              {weapon.minRange}/{weapon.maxRange}MD
            </span>
          </div>
          <div className="modal-rule-list">
            {weapon.specialRules.length ? (
              weapon.specialRules.map((rule) => (
                <div className="weapon-rule" key={rule.name}>
                  <strong>{rule.name}</strong>
                  <p>{rule.text}</p>
                </div>
              ))
            ) : (
              <p>No special rules.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
