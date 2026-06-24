import { DEFAULT_FRAME, FRAME_CONFIGURATIONS, FRAME_OPTIONS, getFrameConfiguration } from './frames';
import { GAME_PHASES } from './game';
import { HANDLERS } from './handlers';
import { HEAT_RULES, HEAT_STATES } from './heat';
import { RULE_TRIGGERS } from './interactions';
import { DEFAULT_FOCUS, DEFAULT_FOCUS_POOL, PILOT_CARD } from './pilotDefaults';
import { DEFAULT_PILOT_TRAIT, PILOT_TRAITS, getPilotTrait, getPilotTraitText } from './pilotTraits';
import { SYSTEMS } from './systems';
import { DEFAULT_EQUIPPED_WEAPONS, WEAPONS } from './weapons';

export {
  DEFAULT_EQUIPPED_WEAPONS,
  DEFAULT_FOCUS,
  DEFAULT_FOCUS_POOL,
  DEFAULT_FRAME,
  DEFAULT_PILOT_TRAIT,
  FRAME_CONFIGURATIONS,
  FRAME_OPTIONS,
  GAME_PHASES,
  getFrameConfiguration,
  getPilotTrait,
  getPilotTraitText,
  HANDLERS,
  HEAT_RULES,
  HEAT_STATES,
  PILOT_CARD,
  PILOT_TRAITS,
  RULE_TRIGGERS,
  SYSTEMS,
  WEAPONS
};

/**
 * Serializable snapshot of the app's reference data.
 *
 * Keeping this object free of React components and browser APIs makes it
 * suitable for a future API response or database seed/migration source.
 */
export const REFERENCE_DATA = {
  interactionTriggers: RULE_TRIGGERS,
  systems: SYSTEMS,
  weapons: WEAPONS,
  handlers: HANDLERS,
  heat: {
    states: HEAT_STATES,
    rules: HEAT_RULES
  },
  pilotDefaults: {
    focus: DEFAULT_FOCUS,
    focusPool: DEFAULT_FOCUS_POOL,
    equippedWeapons: DEFAULT_EQUIPPED_WEAPONS,
    card: PILOT_CARD
  },
  pilotTraits: PILOT_TRAITS,
  game: {
    phases: GAME_PHASES,
    frames: FRAME_CONFIGURATIONS
  }
} as const;
