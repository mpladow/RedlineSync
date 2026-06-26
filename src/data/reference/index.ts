import { DEFAULT_FRAME, FRAME_CONFIGURATIONS, FRAME_OPTIONS, getFrameConfiguration } from './frames';
import {
    FORWARD_RELAY_BEACON,
    GAME_PHASES,
    ORDINANCE_DIRECTIVES,
    STATIC_GUN_EMPLACEMENT,
    TACTICAL_DIRECTIVES
} from './game';
import {
    HANDLER_DEPLOYABLE_ASSETS,
    HANDLER_DIRECTIVE_TABLES,
    getHandlerDeployableAsset,
    getHandlerDirectives
} from './handlerRules';
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
    DEFAULT_PILOT_TRAIT, FORWARD_RELAY_BEACON, FRAME_CONFIGURATIONS,
    FRAME_OPTIONS,
    GAME_PHASES, HANDLERS, HANDLER_DEPLOYABLE_ASSETS,
    HANDLER_DIRECTIVE_TABLES, HEAT_RULES,
    HEAT_STATES, ORDINANCE_DIRECTIVES, PILOT_CARD,
    PILOT_TRAITS,
    RULE_TRIGGERS, STATIC_GUN_EMPLACEMENT, SYSTEMS, TACTICAL_DIRECTIVES, WEAPONS, getFrameConfiguration, getHandlerDeployableAsset,
    getHandlerDirectives, getPilotTrait,
    getPilotTraitText
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
    frames: FRAME_CONFIGURATIONS,
    directiveTables: HANDLER_DIRECTIVE_TABLES,
    deployableAssets: HANDLER_DEPLOYABLE_ASSETS
  }
} as const;
