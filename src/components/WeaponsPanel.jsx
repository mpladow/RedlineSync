import { ChevronDown, ChevronUp, Swords } from 'lucide-react';
import { WeaponSlot } from './WeaponSlot';

export function WeaponsPanel({ meleeWeapon, rangedWeapon, onWeaponChange, onOpenWeaponDetails, isExpanded, onToggleExpand }) {
  return (
    <section className="meter-card weapons-meter">
      <button
        className="panel-heading-toggle"
        type="button"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Hide' : 'Show'} equipped weapons`}
        onClick={onToggleExpand}
      >
        <span className="meter-heading">
          <Swords size={20} />
          <span>Equipped Weapons</span>
        </span>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isExpanded && (
        <div className="weapon-slots">
          <WeaponSlot
            label="Melee"
            slot="melee"
            selectedWeapon={meleeWeapon}
            onChange={onWeaponChange}
            onOpen={onOpenWeaponDetails}
          />
          <WeaponSlot
            label="Ranged"
            slot="ranged"
            selectedWeapon={rangedWeapon}
            onChange={onWeaponChange}
            onOpen={onOpenWeaponDetails}
          />
        </div>
      )}
    </section>
  );
}
