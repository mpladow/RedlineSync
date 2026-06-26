import type { Handler } from '../../types';

export const HANDLERS: Handler[] = [
	{
		id: 'tactical',
		label: 'Tactical',
		asset: 'Forward Relay Beacon',
		description: 'A Tactical Handler focuses on targeting data, movement prediction, timing windows, and battlefield control.',
		directiveNotes:
			'Tactical Directives tend to create openings rather than repair damage or deploy heavy assets.',
		role: 'Targeting windows, Lock-On support, enemy movement prediction.',
		calls: [
			{
				name: 'Relay is online',
				text: 'Place a beacon within 4 MD. Once per round, a friendly Frame nearby may spend Neural Link Focus to place Lock-On through line of sight.',
				systems: ['neural', 'sensors'],
				triggers: ['when-support-call-used', 'when-neural-focus-spent', 'after-token-applied']
			},
			{
				name: 'Attack now',
				text: 'After this Frame hits with a Weapon Action, spend 1 Neural Link Focus to place Exposed on the target.',
				systems: ['neural', 'weapons', 'sensors'],
				triggers: ['after-weapon-hit', 'when-neural-focus-spent', 'after-token-applied']
			},
			{
				name: 'They are overextending',
				text: 'After an enemy completes movement within 6 MD, spend 1 Neural Link Focus to place Harried.',
				systems: ['neural', 'mobility'],
				triggers: ['after-movement', 'when-neural-focus-spent', 'after-token-applied']
			}
		]
	},
	{
		id: 'engineering',
		label: 'Engineering',
		asset: 'Repair Drone Cradle',
		role: 'Heat control, repairs, status clearing, emergency stability.',
		calls: [
			{
				name: 'Drone cradle inbound',
				text: 'Place a cradle within 3 MD. Once per round, a friendly Frame at close range may clear Heat or a negative token.',
				systems: ['neural', 'reactor'],
				triggers: ['when-support-call-used']
			},
			{
				name: 'Keep moving, I will vent the excess',
				text: 'After this Frame moves at least 2 MD, spend 1 Neural Link Focus to remove 1 Heat.',
				systems: ['neural', 'mobility', 'reactor'],
				triggers: ['after-movement', 'when-neural-focus-spent']
			},
			{
				name: 'I can patch that',
				text: 'Spend 2 Neural Link Focus to remove 1 Warning Major Damage effect. Critical damage cannot be removed this way.',
				systems: ['neural', 'reactor'],
				triggers: ['when-neural-focus-spent', 'when-major-damage-interacted']
			}
		]
	},
	{
		id: 'ordinance',
		label: 'Ordinance',
		asset: 'Static Gun Emplacement',
		role: 'Fire support, mines, smoke, emplacements, area control.',
		description: 'An Ordinance Handler focuses on fire support, battlefield assets, smoke, mines, and strike markers.',
		directiveNotes:
			'Ordinance Directives are strong for area control, but many require Neural Link Focus or careful positioning.',
		calls: [
			{
				name: 'Gun emplacement online',
				text: 'Place an emplacement within 3 MD. Once per round, a friendly Frame within 6 MD may spend Neural Link Focus to fire it.',
				systems: ['neural', 'weapons'],
				triggers: ['when-support-call-used', 'when-neural-focus-spent', 'before-weapon-attack']
			},
			{
				name: 'Draw them into the kill zone',
				text: 'After moving at least 2 MD and ending near an enemy, place a Mine Marker close to this Frame.',
				systems: ['neural', 'mobility'],
				triggers: ['after-movement', 'when-support-call-used']
			},
			{
				name: 'Smoke out',
				text: 'Place 2 Smoke Markers within 6 MD. Lines of fire through smoke grant the defender +1 Defence die.',
				systems: ['neural', 'defence', 'weapons'],
				triggers: ['when-support-call-used', 'before-weapon-attack']
			}
		]
	}
];
