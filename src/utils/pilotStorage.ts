import type { PilotRecord, SavedState } from '../types';
import { getFrameConfiguration } from '../data/reference';

export const PILOTS_STORAGE_KEY = 'redline-sync-pilots';
const EMPTY_FOCUS = { mobility: 0, weapons: 0, neural: 0, defence: 0, reactor: 0, sensors: 0 };

export function getPilotWorkspaceKey(pilotId: string) {
  return `redline-sync-state:${pilotId}`;
}

export function loadPilots(): PilotRecord[] {
  try {
    const raw = localStorage.getItem(PILOTS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((pilot) => {
      const frame = getFrameConfiguration(pilot.frame);

      return {
        ...pilot,
        mobility: frame.mobility,
        defenceDie: frame.defenceDie,
        armour: frame.armour,
        sensorRange: frame.sensorRange,
        structure: pilot.structure ?? { ...frame.structure }
      };
    }) as PilotRecord[];
  } catch {
    return [];
  }
}

export function persistPilots(pilots: PilotRecord[]) {
  localStorage.setItem(PILOTS_STORAGE_KEY, JSON.stringify(pilots));
}

export function persistPilotWorkspaceConfiguration(pilot: PilotRecord) {
  const key = getPilotWorkspaceKey(pilot.id);
  const savedState = loadPilotWorkspaceState(pilot.id);

  localStorage.setItem(
    key,
    JSON.stringify({
      ...savedState,
      focusPool: pilot.focusPool,
      handler: pilot.handler,
      equippedWeapons: pilot.equippedWeapons
    })
  );
}

export function loadPilotWorkspaceState(pilotId: string): SavedState {
  try {
    const raw = localStorage.getItem(getPilotWorkspaceKey(pilotId));
    return raw ? (JSON.parse(raw) as SavedState) : {};
  } catch {
    return {};
  }
}

export function resetPilotGameState(pilot: PilotRecord) {
  localStorage.setItem(
    getPilotWorkspaceKey(pilot.id),
    JSON.stringify({
      focusPool: pilot.focusPool,
      focus: EMPTY_FOCUS,
      cockpitFocus: EMPTY_FOCUS,
      structure: pilot.structure,
      equippedWeapons: pilot.equippedWeapons,
      heat: 3,
      handler: pilot.handler,
      hasSelectedHandler: false,
      phaseIndex: 0,
      round: 1,
      directiveRoll: null,
      isDirectiveRevealed: false,
      isDeployableAssetDeployed: false,
      selectedDamageMarkers: {}
    } satisfies SavedState)
  );
}

export function removePilotWorkspace(pilotId: string) {
  localStorage.removeItem(getPilotWorkspaceKey(pilotId));
}
