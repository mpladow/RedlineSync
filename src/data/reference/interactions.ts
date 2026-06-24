import type { RuleTrigger } from '../../types';

export const RULE_TRIGGERS = [
  'after-movement',
  'before-weapon-attack',
  'after-attack-roll',
  'after-weapon-hit',
  'after-structure-damage',
  'before-weapon-reflex',
  'after-weapon-reflex',
  'after-heat-gained',
  'after-token-applied',
  'when-token-present',
  'when-support-call-used',
  'when-neural-focus-spent',
  'when-major-damage-interacted',
  'when-heat-state-entered',
  'when-system-damage-assigned',
  'after-cockpit-allocation',
  'when-round-started',
  'when-focus-assigned',
  'before-system-action',
  'when-charge-token-spent',
  'when-support-orders-reassigned',
  'when-harried-applied',
  'when-lock-on-applied'
] as const satisfies readonly RuleTrigger[];
