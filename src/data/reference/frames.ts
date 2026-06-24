import type { DamageMarker, RuleInteractions, SystemId } from '../../types';

export type FrameDamageMarkers = Record<SystemId, DamageMarker[]>;

export type FrameConfiguration = {
  name: string;
  damageMarkers: FrameDamageMarkers;
  signatureSystem: RuleInteractions & {
    name: string;
    description: string;
    rules: string[];
  };
};

export const SHARED_FRAME_DAMAGE_MARKERS: FrameDamageMarkers = {
  mobility: [
    {
      roll: '1',
      name: 'LEG SYNC DAMAGE',
      effect: 'Combat Move is reduced by 1 MD, to a minimum of 1 MD. Max Mobility Focus reduced by 1.',
      isCritical: true
    },
    {
      roll: '2-4',
      name: 'ACTUATOR LAG',
      effect: 'Combat Move is reduced by 1 MD, to a minimum of 1 MD. Max Mobility Focus reduced to 1.',
      isCritical: false
    },
    {
      roll: '5-6',
      name: 'GYRO_DESYNC',
      effect: 'Combat Sprint does not remove Lock-On while this card is active.',
      isCritical: false
    }
  ],
  weapons: [
    {
      roll: '1',
      name: 'ARMOUR FRACTURE',
      effect: 'Choose one weapon; it rolls -1 die until repaired. Max Weapons Focus reduced to 1.',
      isCritical: true
    },
    {
      roll: '4',
      name: 'SHIELD DESYNC',
      effect: 'Shield Flare provides no bonus unless you also spend 1 Reactor Focus.',
      isCritical: false
    },
    {
      roll: '5-6',
      name: 'DEFENCE SYNC ERROR',
      effect: 'Brace requires 1 Reactor Focus in addition to its normal cost.',
      isCritical: false
    }
  ],
  neural: [
    {
      roll: '1-2',
      name: 'Signal Lag',
      effect: 'Handler Calls require line of sight from this Frame.',
      isCritical: true
    },
    {
      roll: '3-4',
      name: 'Feedback Spike',
      effect: 'After a Support Call, roll 1d6; on 1, gain 1 Heat.',
      isCritical: false
    },
    { roll: '5-6', name: 'Link Burn', effect: 'Sync Surge cannot be used.', isCritical: false }
  ],
  defence: [
    {
      roll: '1-2',
      name: 'Armour Gap',
      effect: 'First incoming hit each round gains +1 damage on a 6.',
      isCritical: true
    },
    { roll: '3-4', name: 'Shield Drop', effect: 'Brace costs 1 additional Focus.', isCritical: false },
    {
      roll: '5-6',
      name: 'Countermeasure Fault',
      effect: 'Countermeasure Burst clears only Lock-On.',
      isCritical: false
    }
  ],
  reactor: [
    {
      roll: '1-2',
      name: 'Coolant Leak',
      effect: 'Vent Heat removes no Heat on a roll of 1.',
      isCritical: true
    },
    {
      roll: '3-4',
      name: 'Power Flutter',
      effect: 'Power Route cannot move Focus into Weapons.',
      isCritical: false
    },
    {
      roll: '5-6',
      name: 'Core Warning',
      effect: 'At Heat 8+, all Heat costs increase by 1.',
      isCritical: false
    }
  ],
  sensors: [
    { roll: '1-2', name: 'Static Wash', effect: 'Scan range is reduced by 2 MD.', isCritical: true },
    {
      roll: '3-4',
      name: 'Bad Return',
      effect: 'Target Analysis requires line of sight.',
      isCritical: false
    },
    {
      roll: '5-6',
      name: 'Blind Sector',
      effect: 'Wide Spectrum Sweep can target only one enemy.',
      isCritical: false
    }
  ]
};

export const FRAME_CONFIGURATIONS = [
  {
    name: 'Prototype Frame',
    damageMarkers: SHARED_FRAME_DAMAGE_MARKERS,
    signatureSystem: {
      name: '',
      description: 'This Frame is an early production model, used for training and testing new Pilots.',
      rules: ['This Frame has no special rules and is the default Frame for all Pilots.'],
      systems: [],
      triggers: []
    }
  },
  {
    name: 'Agile Frame',
    damageMarkers: SHARED_FRAME_DAMAGE_MARKERS,
    signatureSystem: {
      name: 'Kinetic Recovery Array',
      description: 'This Frame converts high-speed movement into short bursts of stability.',
      rules: [
        'Once per round, after this Frame moves at least 2 MD during a single movement action, it may choose one:',
        'Stabilise: Ignore the -1 attack die penalty from High Speed for this Frame’s next attack this activation.',
        'Slip Free: Remove 1 Harried token from this Frame.',
        'After using this effect, gain +1 Heat.'
      ],
      systems: ['mobility', 'weapons', 'reactor', 'neural'],
      triggers: ['after-movement', 'before-weapon-attack', 'after-heat-gained']
    }
  },
  {
    name: 'Heavy Frame',
    damageMarkers: SHARED_FRAME_DAMAGE_MARKERS,
    signatureSystem: {
      name: 'Anchored Stabiliser Core',
      description: 'This Frame performs best when it plants itself and turns into a firing platform.',
      rules: [
        'Once per round, if this Frame has not moved during the current round, it may ignore 1 attack die penalty affecting a ranged Weapon Action.',
        'This may ignore penalties from Heavy weapon handling, High Speed, Smoke, minor Warning effects, or the Weapon Reflex penalty when using a non-Heavy weapon.',
        'It cannot ignore Armour, Exposed, Critical Major Damage, range restrictions, or line of sight restrictions.',
        'After using this effect, this Frame cannot use Reflexive Step until its next Focus Activation.'
      ],
      systems: ['mobility', 'weapons'],
      triggers: ['after-movement', 'before-weapon-attack']
    }
  },
  {
    name: 'Duelist Frame',
    damageMarkers: SHARED_FRAME_DAMAGE_MARKERS,
    signatureSystem: {
      name: 'Duel-Pattern Actuators',
      description: 'This Frame is tuned for weapon clashes and close-range timing.',
      rules: [
        'Once per round, when this Frame uses Weapon Reflex against a melee attack, it may reduce the Weapon Reflex penalty by 1.',
        'A non-Heavy melee weapon’s normal -1 attack die penalty is reduced to no penalty.',
        'A Heavy melee weapon’s normal -2 attack dice penalty is reduced to -1 attack die.',
        'If this Frame loses the Weapon Reflex contest, the incoming attack deals +1 damage.'
      ],
      systems: ['weapons'],
      triggers: ['before-weapon-reflex', 'after-weapon-reflex']
    }
  }
] as const satisfies readonly FrameConfiguration[];

export const DEFAULT_FRAME = FRAME_CONFIGURATIONS[0];

export const FRAME_OPTIONS = FRAME_CONFIGURATIONS.map((frame) => frame.name);

export function getFrameConfiguration(frameName: string) {
  return FRAME_CONFIGURATIONS.find((frame) => frame.name === frameName) ?? DEFAULT_FRAME;
}
