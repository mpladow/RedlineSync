export type SystemId = 'mobility' | 'weapons' | 'neural' | 'defence' | 'reactor' | 'sensors';

export type RuleTrigger =
  | 'after-movement'
  | 'before-weapon-attack'
  | 'after-attack-roll'
  | 'after-weapon-hit'
  | 'after-structure-damage'
  | 'before-weapon-reflex'
  | 'after-weapon-reflex'
  | 'after-heat-gained'
  | 'after-token-applied'
  | 'when-token-present'
  | 'when-support-call-used'
  | 'when-neural-focus-spent'
  | 'when-major-damage-interacted'
  | 'when-heat-state-entered'
  | 'when-system-damage-assigned'
  | 'after-cockpit-allocation'
  | 'when-round-started'
  | 'when-focus-assigned'
  | 'before-system-action'
  | 'when-charge-token-spent'
  | 'when-support-orders-reassigned'
  | 'when-harried-applied'
  | 'when-lock-on-applied';

export type RuleInteractions = {
  systems: SystemId[];
  triggers: RuleTrigger[];
};

export type PilotTrait = RuleInteractions & {
  id: string;
  name: string;
  description: string;
  rules: string[];
};

export type FocusMap = Record<SystemId, number>;

export type StructureMap = Record<SystemId, number>;

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
  id?: string;
  roll: string;
  name: string;
  effect: string;
  isCritical: boolean;
};

export type SystemDefinition = {
  id: SystemId;
  label: string;
  actions: SystemAction[];
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
  } & RuleInteractions>;
};

export type EquippedWeapons = Record<WeaponSlotName, string>;

export type HandlerId = 'tactical' | 'engineering' | 'ordinance';

export type PilotAbility = {
  name: string;
  text: string;
  systems?: SystemId[];
  triggers?: RuleTrigger[];
};

export type PilotRecord = {
  id: string;
  pilotName: string;
  mechName: string;
  frame: string;
  status: 'Ready' | 'Draft';
  mobility: number;
  defenceDie: number;
  armour: number;
  sensorRange: number;
  focusPool: number;
  structure: StructureMap;
  handler: HandlerId;
  equippedWeapons: EquippedWeapons;
  specialAbility: PilotAbility;
  pilotTraits?: PilotAbility[];
  createdAt: string;
  updatedAt: string;
};

export type Handler = {
  id: HandlerId;
  label: string;
  asset: string;
  role: string;
  description?: string;
  directiveNotes?: string;
  calls: Array<{
    name: string;
    text: string;
    systems: SystemId[];
    triggers: RuleTrigger[];
  }>;
};

export type HandlerDirective = {
  roll: number;
  name: string;
  timing: string;
  effect: string;
};

export type DeployableAsset = {
  name: string;
  deployment: string;
  cost: string;
  type: string;
  effect: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
};

export type SavedState = {
  focus?: Partial<FocusMap> & { movement?: number };
  cockpitFocus?: Partial<FocusMap>;
  structure?: Partial<StructureMap>;
  focusPool?: number;
  equippedWeapons?: Partial<EquippedWeapons>;
  heat?: number;
  handler?: HandlerId;
  hasSelectedHandler?: boolean;
  phaseIndex?: number;
  round?: number;
  directiveRoll?: number | null;
  isDirectiveRevealed?: boolean;
  isDeployableAssetDeployed?: boolean;
  selectedDamageMarkers?: DamageSelectionMap;
};
