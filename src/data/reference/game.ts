import type { DeployableAsset, HandlerDirective } from '../../types';

export const GAME_PHASES = ['Handler Phase', 'Cockpit Phase', 'Support Phase', 'Activation Phase', 'End Phase'] as const;

export const TACTICAL_DIRECTIVES: HandlerDirective[] = [
  {
    roll: 1,
    name: 'Radio silence.',
    timing: 'None',
    effect: 'No effect this round.'
  },
  {
    roll: 2,
    name: 'Hold position. Watch their line.',
    timing: 'Passive Directive',
    effect:
      'If this Frame makes no voluntary movement before its next Focus Activation, reveal this during that activation. The first ranged Weapon Action this Frame makes during that activation may reroll 1 attack die.'
  },
  {
    roll: 3,
    name: 'Attack now!',
    timing: 'Passive Directive',
    effect:
      'After this Frame hits an enemy Frame with a Weapon Action, reveal this after damage is resolved. Place 1 Exposed on the target.'
  },
  {
    roll: 4,
    name: 'They’re overextending.',
    timing: 'Reaction Directive',
    effect:
      'After an enemy Frame completes a voluntary movement action within 6 MD and line of sight of this Frame, reveal this to place 1 Harried on that enemy Frame.'
  },
  {
    roll: 5,
    name: 'I have a firing solution.',
    timing: 'Handler Call',
    effect:
      'During this Frame’s Focus Activation, spend 1 Neural Link Focus to place 1 Lock-On on one visible enemy Frame within 8 MD.'
  },
  {
    roll: 6,
    name: 'Track their movement.',
    timing: 'Passive Directive',
    effect:
      'After this Frame moves at least 2 MD during its Focus Activation, reveal this to place 1 Lock-On on one visible enemy Frame within 8 MD.'
  },
  {
    roll: 7,
    name: 'Break their lock.',
    timing: 'Reaction Directive',
    effect:
      'When this Frame or an allied Frame within 6 MD is targeted by an attack, reveal this before dice are rolled. Remove 1 Lock-On from the defending Frame.'
  },
  {
    roll: 8,
    name: 'Relay authorised.',
    timing: 'Neural Link Action',
    effect: 'Spend 2 Neural Link Focus to deploy a Forward Relay Beacon within 3 MD.'
  },
  {
    roll: 9,
    name: 'Call the shot.',
    timing: 'Passive Directive',
    effect:
      'When this Frame declares an Exerted Attack, reveal this before dice are rolled. That attack gains +1 attack die.'
  },
  {
    roll: 10,
    name: 'Target priority updated.',
    timing: 'Handler Call',
    effect:
      'During this Frame’s Focus Activation, choose one visible enemy Frame. Until the end of the round, the first friendly attack against that Frame may reroll 1 attack die.'
  }
];

export const ORDINANCE_DIRECTIVES: HandlerDirective[] = [
  {
    roll: 1,
    name: 'Radio silence.',
    timing: 'None',
    effect: 'No effect this round.'
  },
  {
    roll: 2,
    name: 'No fire window. Hold.',
    timing: 'None',
    effect: 'No effect this round.'
  },
  {
    roll: 3,
    name: 'Smoke out.',
    timing: 'Neural Link Action',
    effect: 'Spend 1 Neural Link Focus to place 2 Smoke Markers within 6 MD and line of sight.'
  },
  {
    roll: 4,
    name: 'Minefield active.',
    timing: 'Neural Link Action',
    effect:
      'Spend 1 Neural Link Focus to place 1 Mine Marker within 4 MD and line of sight. The Mine Marker cannot be placed within 1/2 MD of an enemy Frame.'
  },
  {
    roll: 5,
    name: 'Danger close!',
    timing: 'Neural Link Action',
    effect:
      'Spend 2 Neural Link Focus to place 1 Strike Marker within 6 MD and line of sight. This Strike Marker uses Support Dice 4 instead of Support Dice 3.'
  },
  {
    roll: 6,
    name: 'Draw them into the kill zone.',
    timing: 'Passive Directive',
    effect:
      'After this Frame moves at least 2 MD and ends that movement within 4 MD of an enemy Frame, reveal this to place 1 Mine Marker within 2 MD of this Frame. The Mine Marker cannot be placed within 1/2 MD of an enemy Frame.'
  },
  {
    roll: 7,
    name: 'Gun emplacement online.',
    timing: 'Neural Link Action',
    effect: 'Spend 2 Neural Link Focus to deploy a Static Gun Emplacement within 3 MD.'
  },
  {
    roll: 8,
    name: 'Suppressing angle ready.',
    timing: 'Reaction Directive',
    effect:
      'After an enemy Frame ends a movement action within 6 MD and line of sight of this Frame, reveal this to place 1 Harried on that enemy Frame.'
  },
  {
    roll: 9,
    name: 'Fire mission prepared.',
    timing: 'Passive Directive',
    effect:
      'After this Frame hits an enemy Frame with a Weapon Action, reveal this after damage is resolved. Place 1 Strike Marker within 1 MD of the target. Resolve it at the end of the Activation Phase.'
  },
  {
    roll: 10,
    name: 'Cut off their retreat.',
    timing: 'Reaction Directive',
    effect:
      'After an enemy Frame completes a voluntary movement action, reveal this to place either 1 Smoke Marker or 1 Mine Marker within 2 MD of that enemy Frame. A Mine Marker cannot be placed within 1/2 MD of an enemy Frame.'
  }
];

export const FORWARD_RELAY_BEACON: DeployableAsset = {
  name: 'Forward Relay Beacon',
  deployment: 'Tactical Directive 8',
  cost: '2 Neural Link Focus',
  type: 'Fixed Asset',
  effect:
    'Once per game, during a friendly Frame’s Focus Activation, a friendly Frame within 4 MD of the Forward Relay Beacon may spend 1 Neural Link Focus to place 1 Lock-On on an enemy Frame in line of sight of the Beacon.',
  stats: [
    { label: 'Defence', value: '2' },
    { label: 'Armour', value: '0' },
    { label: 'Durability', value: 'Removed after suffering 1 damage' }
  ]
};

export const STATIC_GUN_EMPLACEMENT: DeployableAsset = {
  name: 'Static Gun Emplacement',
  deployment: 'Ordinance Directive 7',
  cost: '2 Neural Link Focus',
  type: 'Fixed Asset',
  effect:
    'Once per game, during a friendly Frame\'s Focus Activation, a friendly Frame within 6 MD of the Static Gun Emplacement may spend 1 Neural Link Focus to fire it. Resolve the shot as a Support Attack. The target does not roll Defence dice and cannot use Reactions. Compare Support Attack successes against the target\'s Defence value. If the attack hits, resolve damage normally.',
  stats: [
    { label: 'Support Dice', value: '3' },
    { label: 'Range', value: '6 MD' },
    { label: 'Damage', value: '2' },
    { label: 'Defence', value: '2' },
    { label: 'Armour', value: '0' },
    { label: 'Durability', value: 'Removed after suffering 1 damage' }
  ]
};
