import type { Handler } from '../types';

export const HANDLERS: Handler[] = [
  {
    id: 'tactical',
    label: 'Tactical',
    asset: 'Forward Relay Beacon',
    role: 'Targeting windows, Lock-On support, enemy movement prediction.',
    calls: [
      'Relay is online: place a beacon within 4 MD. Once per round, a friendly Frame nearby may spend Neural Link Focus to place Lock-On through line of sight.',
      'Attack now: after this Frame hits with a Weapon Action, spend 1 Neural Link Focus to place Exposed on the target.',
      'They are overextending: after an enemy completes movement within 6 MD, spend 1 Neural Link Focus to place Harried.'
    ]
  },
  {
    id: 'engineering',
    label: 'Engineering',
    asset: 'Repair Drone Cradle',
    role: 'Heat control, repairs, status clearing, emergency stability.',
    calls: [
      'Drone cradle inbound: place a cradle within 3 MD. Once per round, a friendly Frame at close range may clear Heat or a negative token.',
      'Keep moving, I will vent the excess: after this Frame moves at least 2 MD, spend 1 Neural Link Focus to remove 1 Heat.',
      'I can patch that: spend 2 Neural Link Focus to remove 1 Warning Major Damage effect. Critical damage cannot be removed this way.'
    ]
  },
  {
    id: 'ordnance',
    label: 'Ordnance',
    asset: 'Static Gun Emplacement',
    role: 'Fire support, mines, smoke, emplacements, area control.',
    calls: [
      'Gun emplacement online: place an emplacement within 3 MD. Once per round, a friendly Frame within 6 MD may spend Neural Link Focus to fire it.',
      'Draw them into the kill zone: after moving at least 2 MD and ending near an enemy, place a mine or strike marker close to this Frame.',
      'Smoke out: place 2 Smoke Markers within 6 MD. Lines of fire through smoke grant the defender +1 Defence die.'
    ]
  }
];
