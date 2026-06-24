import type { PilotRecord, SavedState } from '../types';
import { getFrameConfiguration } from '../data/reference';

export const PILOTS_STORAGE_KEY = 'redline-sync-pilots';

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
  const key = `redline-sync-state:${pilot.id}`;
  let savedState: SavedState = {};

  try {
    const raw = localStorage.getItem(key);
    savedState = raw ? (JSON.parse(raw) as SavedState) : {};
  } catch {
    savedState = {};
  }

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

export function removePilotWorkspace(pilotId: string) {
  localStorage.removeItem(`redline-sync-state:${pilotId}`);
}
