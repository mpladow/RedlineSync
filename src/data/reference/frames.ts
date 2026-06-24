import type { RuleInteractions } from '../../types';

export type FrameConfiguration = {
  name: string;
  signatureSystem: RuleInteractions & {
    name: string;
    description: string;
    rules: string[];
  };
};

export const FRAME_CONFIGURATIONS = [
  {
    name: 'Prototype Frame',
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
