import type { PilotTrait } from '../../types';

export const PILOT_TRAITS = [
  {
    id: 'ace-pilot',
    name: 'Ace Pilot',
    description: 'This pilot is skilled at converting targeting data into decisive shots.',
    rules: [
      'Once per round, when this pilot attacks a target with 2+ Lock-On tokens, they may reroll one additional attack die.',
      'This does not add a Lock-On token and does not remove Lock-On tokens.'
    ],
    systems: ['weapons', 'sensors'],
    triggers: ['when-token-present', 'after-attack-roll']
  },
  {
    id: 'cold-start-specialist',
    name: 'Cold Start Specialist',
    description: 'This pilot is calm during the first exchange.',
    rules: [
      'During Round 1, after Cockpit Allocation, choose one system.',
      'That system gains +1 temporary Focus this round.',
      'This may exceed the normal system cap by 1 and does not cause an Overcommitted penalty for being over 3 Focus.'
    ],
    systems: ['mobility', 'weapons', 'neural', 'defence', 'reactor', 'sensors'],
    triggers: ['when-round-started', 'after-cockpit-allocation', 'when-focus-assigned']
  },
  {
    id: 'heat-discipline',
    name: 'Heat Discipline',
    description: 'This pilot manages reactor load with practiced restraint.',
    rules: [
      'Once per round, when the mech would gain Heat from a Fast Mobility action or Combat Charge, roll 1d6.',
      'On a 5+, ignore that Heat.',
      'This cannot prevent Heat from weapons, Overcharge, Major Damage, or Critical Heat.'
    ],
    systems: ['mobility', 'reactor'],
    triggers: ['after-movement', 'after-heat-gained']
  },
  {
    id: 'duelist-reflex',
    name: 'Duelist Reflex',
    description: 'This pilot is dangerous in close combat.',
    rules: [
      'Once per round, when using Counterstrike Prep, if the defender wins the melee contest, the Counterstrike does not suffer the usual Damage -1 penalty.',
      'The Counterstrike uses the weapon’s full Damage.'
    ],
    systems: ['weapons'],
    triggers: ['before-weapon-reflex', 'after-weapon-reflex']
  },
  {
    id: 'snapfire-instinct',
    name: 'Snapfire Instinct',
    description: 'This pilot is trained to return fire immediately.',
    rules: ['Once per round, when using Fire Weapon Reflex, reroll 1 attack die.', 'Keep the second result.'],
    systems: ['weapons'],
    triggers: ['before-weapon-reflex', 'after-attack-roll']
  },
  {
    id: 'redline-temper',
    name: 'Redline Temper',
    description: 'This pilot becomes more aggressive as the cockpit overheats.',
    rules: [
      'While the mech is in Redline, if it chooses the Redline Surge Action that provides +1 Attack, it may add an additional +1 Attack.',
      'If that attack misses, the mech gains +1 Heat after the attack resolves.'
    ],
    systems: ['weapons', 'reactor', 'neural'],
    triggers: ['when-heat-state-entered', 'before-weapon-attack', 'after-attack-roll', 'after-heat-gained']
  },
  {
    id: 'systems-analyst',
    name: 'Systems Analyst',
    description: 'This pilot is skilled at reading damaged enemy frames.',
    rules: [
      'When making a Targeted Attack against a system that already has Structure damage, add +1 attack die.',
      'This bonus does not apply against undamaged systems.'
    ],
    systems: ['weapons', 'sensors'],
    triggers: ['before-weapon-attack', 'when-system-damage-assigned']
  },
  {
    id: 'battlefield-courier',
    name: 'Battlefield Courier',
    description: 'This pilot is excellent at coordinating support assets.',
    rules: [
      'When this pilot uses Reassign Support Orders, they may reassign one additional Support Unit for free.',
      'If they spend 1 Cockpit Frame Focus, they may reassign 2 Support Units instead of 1.'
    ],
    systems: ['neural'],
    triggers: ['when-support-orders-reassigned', 'when-neural-focus-spent']
  },
//   {
//     id: 'iron-nerve',
//     name: 'Iron Nerve',
//     description: 'This pilot holds position under pressure.',
//     rules: [
//       'The mech may ignore the first Harried token it would receive each round.',
//       'If the mech already has 2 Harried tokens, this trait has no effect until at least one is removed.'
//     ],
//     systems: ['defence', 'neural'],
//     triggers: ['when-round-started', 'when-harried-applied']
//   },
//   {
//     id: 'close-assault-pilot',
//     name: 'Close Assault Pilot',
//     description: 'This pilot commits fully to charge attacks.',
//     rules: [
//       'When this mech spends a Charge Token on a melee attack, it gains +1 attack die as normal and +1 damage if the attack deals Structure damage.',
//       'After the attack resolves, the mech gains +1 Heat.'
//     ],
//     systems: ['mobility', 'weapons', 'reactor', 'neural'],
//     triggers: ['when-charge-token-spent', 'before-weapon-attack', 'after-structure-damage', 'after-heat-gained']
//   },
  {
    id: 'emergency-reroute',
    name: 'Emergency Reroute',
    description: 'This pilot knows how to keep a damaged cockpit running.',
    rules: [
      'Once per round, when a WARNING Major Damage Effect would affect an action, roll 1d6.',
      'On a 4+, ignore that WARNING Effect for this action only.'
    ],
    systems: ['mobility', 'weapons', 'neural', 'defence', 'reactor', 'sensors'],
    triggers: ['when-major-damage-interacted', 'before-system-action']
  },
//   {
//     id: 'heavy-weapons-veteran',
//     name: 'Heavy Weapons Veteran',
//     description: 'This pilot is used to firing large weapons while repositioning.',
//     rules: [
//       'Once per round, ignore the Heavy penalty on one ranged attack.',
//       'This does not allow Heavy weapons to ignore other restrictions, such as special setup rules.'
//     ],
//     systems: ['weapons', 'mobility'],
//     triggers: ['before-weapon-attack']
//   },
  {
    id: 'reactor-gambler',
    name: 'Reactor Gambler',
    description: 'This pilot deliberately pushes unstable power spikes.',
    rules: [
      'Once per round, before making an attack, the pilot may gain +1 Heat to add +1 attack die.',
      'If the attack rolls two or more natural 1s, gain +1 additional Heat after the attack resolves.'
    ],
    systems: ['weapons', 'reactor', 'neural'],
    triggers: ['before-weapon-attack', 'after-attack-roll', 'after-heat-gained']
  },
  {
    id: 'ghost-signal-sensitivity',
    name: 'Ghost-Signal Sensitivity',
    description: 'This pilot can read hostile targeting patterns.',
    rules: [
      'Once per round, when the enemy places a Lock-On token on this mech, roll 1d6.',
      'On a 5+, cancel that Lock-On.',
      'If cancelled, this pilot may immediately place 1 Harried token on the enemy that attempted the Lock-On, if it is within 8 MD.'
    ],
    systems: ['sensors', 'defence', 'neural'],
    triggers: ['when-lock-on-applied', 'after-token-applied', 'when-harried-applied']
  }
] as const satisfies readonly PilotTrait[];

export const DEFAULT_PILOT_TRAIT = PILOT_TRAITS[0];

export function getPilotTrait(traitName: string) {
  return PILOT_TRAITS.find((trait) => trait.name === traitName) ?? DEFAULT_PILOT_TRAIT;
}

export function getPilotTraitText(trait: PilotTrait) {
  return [trait.description, ...trait.rules].join(' ');
}
