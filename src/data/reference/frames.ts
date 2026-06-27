import type { DamageMarker, RuleInteractions, StructureMap, SystemId } from '../../types';

export type FrameDamageMarkers = Record<SystemId, DamageMarker[]>;

export type FrameConfiguration = {
	name: string;
	mobility: number;
	defenceDie: number;
	armour: number;
	sensorRange: number;
	structure: StructureMap;
	damageMarkers: FrameDamageMarkers;
	signatureSystem: RuleInteractions & {
		name: string;
		description: string;
		rules: string[];
	};
};

export const SHARED_FRAME_DAMAGE_MARKERS: FrameDamageMarkers = {
	mobility: [
		{
			id: 'leg-sync-damage',
			roll: '1',
			name: 'LEG SYNC DAMAGE',
			effect: 'Combat Move is reduced by 1 MD, to a minimum of 1 MD. Max Mobility Focus reduced by 1.',
			isCritical: true
		},
		{
			id: 'actuator-lag',
			roll: '2-4',
			name: 'ACTUATOR LAG',
			effect: 'Combat Move is reduced by 1 MD, to a minimum of 1 MD. Max Mobility Focus reduced to 1.',
			isCritical: false
		},
		{
			id: 'gyro-desync',
			roll: '5-6',
			name: 'GYRO DESYNC',
			effect: 'Combat Sprint does not remove Lock-On while this card is active.',
			isCritical: false
		}
	],
	weapons: [
		{
			id: 'weapon-desync',
			roll: '1-2',
			name: 'WEAPON DESYNC',
			effect: 'Choose one weapon; it rolls -1 attack die until repaired. Also, Frame cannot use Exerted Attack.',
			isCritical: true
		},
		{
			id: 'feed-system-jam',
			roll: '3-4',
			name: 'FEED SYSTEM JAM',
			effect: 'First ranged attack each round suffers -1 die.',
			isCritical: false
		},
		{
			id: 'sensor-link-fault',
			roll: '5-6',
			name: 'SENSOR LINK FAULT',
			effect: 'Weapon Attacks cannot benefit from Lock-on rerolls.',
			isCritical: false
		}
	],
	neural: [
		{
			id: 'neural-burn',
			roll: '1',
			name: 'NEURAL BURN',
			effect: 'Max total Focus is reduced by 1.',
			isCritical: true
		},
		{
			id: 'cognitive-desync',
			roll: '2-4',
			name: 'COGNITIVE DESYNC',
			effect: 'Future Cockpit Phases, 1 Focus must be randomly allocated to one of the 6 systems using a d6.',
			isCritical: true
		},
		{
			id: 'neural-sync-contamination',
			roll: '5-6',
			name: 'NEURAL SYNC CONTAMINATION',
			effect: 'Roll a d6 immediately. On a roll of 5-6, until the Frame is disabled, gain +1 MD to all Mobility actions, +1 Attack Die, ignore Harried tokens. Cannot use Sensors, Reactor or Neural Link actions (except for Interact). If 1-4 is rolled, no effect.',
			isCritical: true
		},
	],
	defence: [
		{
			id: 'armour-fracture-1',
			roll: '1',
			name: 'ARMOUR FRACTURE',
			effect: 'For each Armour Fracture, Armour is reduced by 1, to a minimum of 1.',
			isCritical: true
		},
		{
			id: 'armour-fracture-2',
			roll: '2',
			name: 'ARMOUR FRACTURE',
			effect: 'For each Armour Fracture, Armour is reduced by 1, to a minimum of 1.',
			isCritical: true
		},
		{
			id: 'shield-desync',
			roll: '3-4', name: 'SHIELD DESYNC', effect: 'Shield Flare provides no bonus unless you also spend 1 Reactor Focus.', isCritical: false
		},
		{
			id: 'defence-sync-error',
			roll: '5-6',
			name: 'DEFENCE SYNC ERROR',
			effect: 'Brace(Defence Action) requires 1 Reactor Focus in addition to its normal cost.',
			isCritical: false
		}
	],
	reactor: [
		{
			id: 'coolant-leak',
			roll: '1-2',
			name: 'COOLANT LEAK',
			effect: 'Start each Cockpit Phase with +1 Heat. This damage cannot be ignored with Emergency System Overloard.',
			isCritical: true
		},
		{
			id: 'coolant-pressure-drop',
			roll: '3-4',
			name: 'COOLANT PRESSURE DROP',
			effect: 'Vent Heat removes 1 less Heat. So Vent Heat removes 1 Heat instead of 2.',
			isCritical: false
		},
		{
			id: 'reactor-surge-loop',
			roll: '5-6',
			name: 'REACTOR SURGE LOOP',
			effect: 'The first Heat gained each round causes +1 additional Heat.',
			isCritical: false
		}
	],
	sensors: [
		{ id: 'sensor-array-damaged', roll: '1-2', name: 'SENSOR ARRAY DAMAGED', effect: 'Pilot can only benefit from a maximum of 1 Lock-On token.', isCritical: true },
		{
			id: 'targeting-fault',
			roll: '3-4',
			name: 'TARGETING FAULT',
			effect: 'During each Cockpit Phase, remove 1 additional Lock-On from an enemy target.',
			isCritical: false
		},
		{
			roll: '5-6',
			name: 'RECEPTION INTERFERENCE',
			effect: 'Sensor range has been reduced by 5 MD (to a minimum of 3 MD).',
			isCritical: false
		}
	]
};

export const FRAME_CONFIGURATIONS = [
	{
		name: 'Prototype Frame',
		mobility: 3,
		defenceDie: 2,
		armour: 2,
		sensorRange: 12,
		structure: {
			mobility: 4,
			weapons: 4,
			sensors: 4,
			defence: 4,
			neural: 5,
			reactor: 4
		},
		damageMarkers: SHARED_FRAME_DAMAGE_MARKERS,
		signatureSystem: {
			name: '',
			description: 'This Frame is an early production model, used for training and testing new Pilots.',
			rules: ['This Frame has no special rules and is the default Frame for all Pilots.'],
			systems: [],
			triggers: []
		}
	},
	{
		name: 'Agile Frame',
		mobility: 4,
		defenceDie: 2,
		armour: 1,
		sensorRange: 12,
		structure: {
			mobility: 5,
			weapons: 4,
			sensors: 4,
			defence: 3,
			neural: 5,
			reactor: 4
		},
		damageMarkers: SHARED_FRAME_DAMAGE_MARKERS,
		signatureSystem: {
			name: 'Kinetic Recovery Array',
			description: 'This Frame converts high-speed movement into short bursts of stability.',
			rules: [
				'Once per round, after this Frame moves at least 2 MD during a single movement action, it may choose one:',
				'Stabilise: Ignore the -1 attack die penalty from High Speed for this Frame’s next attack this activation.',
				'Slip Free: Remove 1 Harried token from this Frame.',
				'After using this effect, gain +1 Heat.'
			],
			systems: ['mobility', 'weapons', 'reactor', 'neural'],
			triggers: ['after-movement', 'before-weapon-attack', 'after-heat-gained']
		}
	},
	{
		name: 'Heavy Frame',
		mobility: 2,
		defenceDie: 2,
		armour: 3,
		sensorRange: 12,
		structure: {
			mobility: 3,
			weapons: 4,
			sensors: 3,
			defence: 5,
			neural: 5,
			reactor: 5
		},
		damageMarkers: SHARED_FRAME_DAMAGE_MARKERS,
		signatureSystem: {
			name: 'Anchored Stabiliser Core',
			description: 'This Frame performs best when it plants itself and turns into a firing platform.',
			rules: [
				'Once per round, if this Frame has not moved during the current round, it may ignore 1 attack die penalty affecting a ranged Weapon Action.',
				'This may ignore penalties from Heavy weapon handling, High Speed, Smoke, minor Warning effects, or the Weapon Reflex penalty when using a non-Heavy weapon.',
				'It cannot ignore Armour, Exposed, Critical Major Damage, range restrictions, or line of sight restrictions.',
				'After using this effect, this Frame cannot use Reflexive Step until its next Focus Activation.'
			],
			systems: ['mobility', 'weapons'],
			triggers: ['after-movement', 'before-weapon-attack']
		}
	},
	{
		name: 'Duelist Frame',
		mobility: 3,
		defenceDie: 2,
		armour: 2,
		sensorRange: 12,
		structure: {
			mobility: 4,
			weapons: 5,
			sensors: 3,
			defence: 4,
			neural: 5,
			reactor: 4
		},
		damageMarkers: SHARED_FRAME_DAMAGE_MARKERS,
		signatureSystem: {
			name: 'Duel-Pattern Actuators',
			description: 'This Frame is tuned for weapon clashes and close-range timing.',
			rules: [
				'Once per round, when this Frame uses Weapon Reflex against a melee attack, it may reduce the Weapon Reflex penalty by 1.',
				'A non-Heavy melee weapon’s normal -1 attack die penalty is reduced to no penalty.',
				'A Heavy melee weapon’s normal -2 attack dice penalty is reduced to -1 attack die.',
				'If this Frame loses the Weapon Reflex contest, the incoming attack deals +1 damage.'
			],
			systems: ['weapons'],
			triggers: ['before-weapon-reflex', 'after-weapon-reflex']
		}
	}
] as const satisfies readonly FrameConfiguration[];

export const DEFAULT_FRAME = FRAME_CONFIGURATIONS[0];

export const FRAME_OPTIONS = FRAME_CONFIGURATIONS.map((frame) => frame.name);

export function getFrameConfiguration(frameName: string) {
	return FRAME_CONFIGURATIONS.find((frame) => frame.name === frameName) ?? DEFAULT_FRAME;
}
