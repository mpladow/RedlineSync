import type { HeatClassName, HeatState } from '../../types';
import type { RuleInteractions } from '../../types';

export const HEAT_STATES: HeatState[] = [
  { label: 'Steady', range: '0-3', className: 'steady' },
  { label: 'Hot', range: '4-5', className: 'hot' },
  { label: 'Redline', range: '6-8', className: 'redline' }
];

export type HeatRule = RuleInteractions & {
  text: string;
};

export const HEAT_RULES: Record<HeatClassName, HeatRule[]> = {
  steady: [{ text: 'No additional Steady heat rules yet.', systems: [], triggers: [] }],
  hot: [
    {
      text: 'Some weapons, pilot traits, and enemy effects may interact with Hot Frames.',
      systems: ['weapons', 'reactor', 'neural'],
      triggers: ['when-heat-state-entered']
    }
  ],
  redline: [
    {
      text: 'Choose one bonus: +1 MD to one Mobility action OR +1 Attack die to one attack this activation.',
      systems: ['mobility', 'weapons'],
      triggers: ['when-heat-state-entered', 'after-movement', 'before-weapon-attack']
    },
    {
      text: 'Then, roll 1d6. On a 1-2, assign 1 Structure damage to a random system.',
      systems: ['mobility', 'weapons', 'neural', 'defence', 'reactor', 'sensors'],
      triggers: ['when-heat-state-entered', 'when-system-damage-assigned']
    },
    {
      text: 'Gaining Heat at 6+: roll 1d6 for each Heat gained. On a 1-2, assign 1 Structure damage to a random system.',
      systems: ['mobility', 'weapons', 'neural', 'defence', 'reactor', 'sensors'],
      triggers: ['after-heat-gained', 'when-system-damage-assigned']
    }
  ]
};
