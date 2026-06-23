import { WEAPONS } from '../constants/weapons';

export function WeaponSlot({ label, slot, selectedWeapon, onChange, onOpen }) {
  const options = WEAPONS.filter((weapon) => weapon.slot === slot);

  return (
    <article className="weapon-slot" onClick={() => onOpen(selectedWeapon)} role="button" tabIndex={0}>
      <div className="weapon-slot-header">
        <span>{label}</span>
        <select
          value={selectedWeapon.id}
          onChange={(event) => onChange(slot, event.target.value)}
          onClick={(event) => event.stopPropagation()}
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
