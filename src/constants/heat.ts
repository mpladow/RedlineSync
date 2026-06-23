import type { HeatClassName, HeatState } from '../types';

export const HEAT_STATES: HeatState[] = [
  { label: 'Steady', range: '0-3', className: 'steady' },
  { label: 'Hot', range: '4-5', className: 'hot' },
  { label: 'Redline', range: '6-8', className: 'redline' }
];

export const HEAT_RULES: Record<HeatClassName, string[]> = {
  steady: ['No additional Steady heat rules yet.'],
  hot: ['Some weapons, pilot traits, and enemy effects may interact with Hot mechs.'],
  redline: [
    'Choose one bonus: +1 MD to one Mobility action OR +1 Attack die to one attack this activation.',
    'Then, roll 1d6. On a 1-2, assign 1 Structure damage to a random system.',
    'Gaining Heat at 6+: roll 1d6 for each Heat gained. On a 1-2, assign 1 Structure damage to a random system.'
  ]
};
