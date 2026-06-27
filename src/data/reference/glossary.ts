import type { GlossaryEntry } from '../../types';

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    id: 'high-speed',
    keyword: 'High Speed',
    summary: 'A movement token that makes a Frame harder to hit, but less stable when attacking.',
    definition: [
      {
        type: 'paragraph',
        text: 'Effect: while a Frame has a High Speed token, it gains these modifiers.'
      },
      {
        type: 'table',
        columns: ['Effect', 'Modifier'],
        rows: [
          ['Defence', '+1 Defence die'],
          ['Attacks', '-1 attack die']
        ]
      },
      {
        type: 'paragraph',
        text:
          'High Speed makes the Frame harder to hit, but less stable when attacking.'
      },
      {
        type: 'paragraph',
        text:
          'Removing High Speed: at the beginning of this Frame\'s next Focus Activation, unless its chosen action will result in another High Speed token being assigned, its controlling player must remove the High Speed token.'
      },
      {
        type: 'paragraph',
        text: 'If the token is not removed, the Frame continues to receive both effects.'
      },
      {
        type: 'paragraph',
        text: 'Note that High Speed is not a Sensor token and thus is not removed.'
      }
    ]
  },
  {
    id: 'lock-on',
    keyword: 'Lock-On',
    summary: 'A targeting token that represents targeting data, weapon tracking, or a stable firing solution.',
    definition: [
      {
        type: 'paragraph',
        text: 'Effect: when attacking a target with Lock-On tokens, the attacker may reroll attack dice.'
      },
      {
        type: 'list',
        items: [
          'For each Lock-On token on the target, the attacker may reroll 1 attack die.',
          'The attacker must keep the second result.',
          'Lock-On tokens are not spent when used.'
        ]
      },
      {
        type: 'paragraph',
        text:
          'Example: if a target has 2 Lock-On tokens, the attacker may reroll up to 2 attack dice when attacking that target. Those Lock-On tokens remain after the attack unless another rule removes them.'
      }
    ]
  },
  {
    id: 'exposed',
    keyword: 'Exposed',
    summary: 'A vulnerability token that temporarily reduces a Frame\'s Armour against incoming attacks.',
    definition: [
      {
        type: 'paragraph',
        text:
          'Each Exposed token on a Frame reduces that Frame\'s Armour by 1 against incoming attacks.'
      },
      {
        type: 'list',
        items: ['Armour cannot be reduced below 0.', 'Exposed tokens are not spent when used.']
      }
    ]
  },
  {
    id: 'harried',
    keyword: 'Harried',
	  summary: 'A Harried token represents a Frame being pressured, distracted, boxed in, destabilised, or forced into a poor defensive posture.',
    definition: [
      {
        type: 'paragraph',
        text: 'Effect: when a Frame with a Harried token defends against an attack, remove 1 Harried token to apply -1 Defence die.'
      },
      {
        type: 'list',
        items: [
          'A Frame cannot be reduced below 1 Defence die by Harried.',
          'A Frame may have a maximum of 2 Harried tokens.',
          'If a rule would place a third Harried token, ignore the extra token.'
        ]
      },
      {
        type: 'paragraph',
        text: 'Removing Harried: Harried tokens are removed when they are used.'
      },
      {
        type: 'paragraph',
        text: 'Some pilot abilities, weapons, equipment, or scenario effects may also remove Harried tokens.'
      }
    ]
  },
	{
		id: 'charge-burst',
		keyword: 'Charge Burst',
		summary: 'A burst of energy that temporarily increases a Frames combat prowess at the expense of defence.',
		definition: [
			{
				type: 'paragraph',
				text: 'Effect: while a Frame has a Charge Burst token, it gains these modifiers.'
			},
			{
				type: 'table',
				columns: ['Effect', 'Modifier'],
				rows: [
					['Attacks', '+1 Attack die'],
					['Defence', '-1 Defence die']
				]
			},
			{
				type: 'paragraph',
				text:
					'Removing Burst Charge: at the end of this Frame\'s NEXT Action, its controlling player must remove the Burst Charge token.'
			},
		]
	},
];
