import type { EquippedWeapons, Weapon } from '../types';

export const WEAPONS: Weapon[] = [
  {
    id: 'burst-carbine-br2',
    slot: 'ranged',
    name: '"BURST-CARBINE" BR-2 Rifle',
    attackDie: 3,
    damage: 2,
    minRange: 2,
    maxRange: 6,
    specialRules: [
      {
        name: 'Overcharge - Damage',
        text: 'When attacking, you can choose to gain +1 Heat to add +1 Damage to the attack.'
      },
      {
        name: 'Reliable',
        text: 'When attacking with this weapon, reroll 1 attack die. The second result must be kept.'
      },
      {
        name: 'Suppressive Pattern',
        text: 'Condition: Target has at least 1 Lock-On token or 1 Harried token. Effect: If this attack hits, place 1 Harried token on the target.'
      }
    ]
  },
  {
    id: 'compact-rail-pistol',
    slot: 'ranged',
    name: 'Compact Rail Pistol',
    attackDie: 2,
    damage: 1,
    minRange: 1,
    maxRange: 4,
    specialRules: []
  },
  {
    id: 'titan-cleaver',
    slot: 'melee',
    name: 'Titan Cleaver',
    attackDie: 3,
    damage: 2,
    minRange: 0,
    maxRange: 1,
    specialRules: [
      {
        name: 'Heavy Arc',
        text: 'When this attack deals Structure Damage, push the defender 1 MD.'
      }
    ]
  },
  {
    id: 'impact-knife',
    slot: 'melee',
    name: 'Impact Knife',
    attackDie: 2,
    damage: 1,
    minRange: 0,
    maxRange: 1,
    specialRules: []
  }
];

export const DEFAULT_EQUIPPED_WEAPONS: EquippedWeapons = {
  melee: 'titan-cleaver',
  ranged: 'burst-carbine-br2'
};
