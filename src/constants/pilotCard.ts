import type { FocusMap } from '../types';

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
    name: 'Ace Pilot',
    text: 'This pilot is skilled at converting targeting data into decisive shots. Once per round, when this pilot attacks a target with 2+ Lock-On tokens, they may reroll one additional attack die. This does not add a Lock-On token and does not remove Lock-On tokens.'
  }
};
