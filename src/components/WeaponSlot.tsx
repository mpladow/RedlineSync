import type { KeyboardEvent, MouseEvent } from 'react';
import { WEAPONS } from '../data/reference';
import type { Weapon, WeaponSlotName } from '../types';

type WeaponSlotProps = {
  label: string;
  slot: WeaponSlotName;
  selectedWeapon: Weapon;
  onChange: (slot: WeaponSlotName, weaponId: string) => void;
  onOpen: (weapon: Weapon) => void;
};

export function WeaponSlot({ label, slot, selectedWeapon, onChange, onOpen }: WeaponSlotProps) {
  const options = WEAPONS.filter((weapon) => weapon.slot === slot);
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen(selectedWeapon);
    }
  };

  return (
    <article className="weapon-slot" onClick={() => onOpen(selectedWeapon)} onKeyDown={handleKeyDown} role="button" tabIndex={0}>
      <div className="weapon-slot-header">
        <span>{label}</span>
        <select
          value={selectedWeapon.id}
          onChange={(event) => onChange(slot, event.target.value)}
          onClick={(event: MouseEvent<HTMLSelectElement>) => event.stopPropagation()}
          aria-label={`${label} weapon`}
        >
          {options.map((weapon) => (
            <option key={weapon.id} value={weapon.id}>
              {weapon.name}
            </option>
          ))}
        </select>
      </div>
      <div className="weapon-name">{selectedWeapon.name}</div>
      <div className="weapon-stats" aria-label={`${selectedWeapon.name} stats`}>
        <span>Attack Die {selectedWeapon.attackDie}</span>
        <span>Dmg {selectedWeapon.damage}</span>
        <span>
          {selectedWeapon.minRange}/{selectedWeapon.maxRange}MD
        </span>
      </div>
      <div className="weapon-tags" aria-label={`${selectedWeapon.name} tags`}>
        {selectedWeapon.specialRules.length ? (
          selectedWeapon.specialRules.map((rule) => <span key={rule.name}>{rule.name}</span>)
        ) : (
          <span>No special rules</span>
        )}
      </div>
    </article>
  );
}
