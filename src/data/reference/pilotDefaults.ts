import type { FocusMap } from '../../types';
import { DEFAULT_PILOT_TRAIT, getPilotTraitText } from './pilotTraits';

export const DEFAULT_FOCUS: FocusMap = {
  mobility: 1,
  weapons: 2,
  neural: 2,
  defence: 1,
  reactor: 0,
  sensors: 0
};

export const DEFAULT_FOCUS_POOL = 6;

export const PILOT_CARD = {
  pilotName: 'Callsign Vantage',
  mechName: 'IC-07 Redline Frame',
  mobility: 3,
  defence: 2,
  specialAbility: {
    name: DEFAULT_PILOT_TRAIT.name,
    text: getPilotTraitText(DEFAULT_PILOT_TRAIT),
    systems: [...DEFAULT_PILOT_TRAIT.systems],
    triggers: [...DEFAULT_PILOT_TRAIT.triggers]
  }
};
