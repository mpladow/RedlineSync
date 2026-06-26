import type { DeployableAsset, HandlerDirective, HandlerId } from '../../types';
import { FORWARD_RELAY_BEACON, ORDNANCE_DIRECTIVES, STATIC_GUN_EMPLACEMENT, TACTICAL_DIRECTIVES } from './game';

export const HANDLER_DIRECTIVE_TABLES: Partial<Record<HandlerId, HandlerDirective[]>> = {
  tactical: TACTICAL_DIRECTIVES,
  ordnance: ORDNANCE_DIRECTIVES
};

export const HANDLER_DEPLOYABLE_ASSETS: Partial<Record<HandlerId, DeployableAsset>> = {
  tactical: FORWARD_RELAY_BEACON,
  ordnance: STATIC_GUN_EMPLACEMENT
};

export function getHandlerDirectives(handler: HandlerId) {
  return HANDLER_DIRECTIVE_TABLES[handler] ?? [];
}

export function getHandlerDeployableAsset(handler: HandlerId) {
  return HANDLER_DEPLOYABLE_ASSETS[handler] ?? null;
}
