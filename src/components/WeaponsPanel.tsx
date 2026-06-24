import { ChevronDown, ChevronUp, Swords } from 'lucide-react';
import type { Weapon, WeaponSlotName } from '../types';
import { WeaponSlot } from './WeaponSlot';

type WeaponsPanelProps = {
  meleeWeapon: Weapon;
  rangedWeapon: Weapon;
  onWeaponChange: (slot: WeaponSlotName, weaponId: string) => void;
  onOpenWeaponDetails: (weapon: Weapon) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
};

export function WeaponsPanel({
  meleeWeapon,
  rangedWeapon,
  onWeaponChange,
  onOpenWeaponDetails,
  isExpanded,
  onToggleExpand
}: WeaponsPanelProps) {
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
      <div className={`collapsible-region weapon-slots-region ${isExpanded ? 'open' : 'closed'}`}>
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
      </div>
    </section>
  );
}
