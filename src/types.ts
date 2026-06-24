export type SystemId = 'mobility' | 'weapons' | 'neural' | 'defence' | 'reactor' | 'sensors';

export type FocusMap = Record<SystemId, number>;

export type ExpansionMap = Partial<Record<SystemId, boolean>>;

export type DamageSelectionMap = Partial<Record<SystemId, string[]>>;

export type FocusedDamageMarker = {
  systemId: SystemId;
  markerName: string;
};

export type SystemAction = {
  cost: string;
  name: string;
  description: string;
};

export type DamageMarker = {
  roll: string;
  name: string;
  effect: string;
};

export type SystemDefinition = {
  id: SystemId;
  label: string;
  actions: SystemAction[];
  damageMarkers: DamageMarker[];
};

export type HeatClassName = 'steady' | 'hot' | 'redline';

export type HeatState = {
  label: string;
  range: string;
  className: HeatClassName;
};

export type WeaponSlotName = 'melee' | 'ranged';

export type Weapon = {
  id: string;
  slot: WeaponSlotName;
  name: string;
  attackDie: number;
  damage: number;
  minRange: number;
  maxRange: number;
  specialRules: Array<{
    name: string;
    text: string;
  }>;
};

export type EquippedWeapons = Record<WeaponSlotName, string>;

export type HandlerId = 'tactical' | 'engineering' | 'ordnance';

export type PilotRecord = {
  id: string;
  pilotName: string;
  mechName: string;
  frame: string;
  status: 'Ready' | 'Draft';
  mobility: number;
  defence: number;
  focusPool: number;
  handler: HandlerId;
  equippedWeapons: EquippedWeapons;
  specialAbility: {
    name: string;
    text: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type Handler = {
  id: HandlerId;
  label: string;
  asset: string;
  role: string;
  calls: string[];
};

export type SavedState = {
  focus?: Partial<FocusMap> & { movement?: number };
  cockpitFocus?: Partial<FocusMap>;
  focusPool?: number;
  equippedWeapons?: Partial<EquippedWeapons>;
  heat?: number;
  handler?: HandlerId;
  phaseIndex?: number;
  selectedDamageMarkers?: DamageSelectionMap;
};
