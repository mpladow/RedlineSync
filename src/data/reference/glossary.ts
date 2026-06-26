import type { GlossaryEntry } from '../../types';

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    id: 'high-speed',
    keyword: 'High Speed',
    summary: 'A movement token that makes a mech harder to hit, but less stable when attacking.',
    definition: [
      {
        type: 'paragraph',
        text:
          'A High Speed token represents a mech moving at combat velocity, using evasive thrust, rapid footwork, or high-output manoeuvring.'
      },
      {
        type: 'list',
        items: [
          'High Speed may come from Combat Sprint.',
          'High Speed may come from Jump.',
          'High Speed may come from equipment.',
          'High Speed may come from special movement effects.',
          'High Speed may come from scenario effects.'
        ]
      },
      {
        type: 'paragraph',
        text: 'High Speed Effect: while a mech has a High Speed token, it gains these modifiers.'
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
          'High Speed makes the mech harder to hit, but less stable when attacking.'
      },
      {
        type: 'paragraph',
        text:
          'Removing High Speed: at the beginning of this mech\'s next Focus Activation, unless its chosen action will result in another High Speed token being assigned, its controlling player must remove the High Speed token.'
      },
      {
        type: 'paragraph',
        text: 'If the token is not removed, the mech continues to receive both effects.'
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
        text:
          'A Lock-On token represents targeting data, weapon tracking, predictive movement analysis, guided targeting, or a stable firing solution.'
      },
      {
        type: 'list',
        items: [
          'Lock-On may come from Precision Aim.',
          'Lock-On may come from some support units.',
          'Lock-On may come from weapon links.',
          'Lock-On may come from equipment.',
          'Lock-On may come from scenario effects.'
        ]
      },
      {
        type: 'paragraph',
        text: 'Lock-On Effect: when attacking a target with Lock-On tokens, the attacker may reroll attack dice.'
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
    summary: 'A vulnerability token that reduces a mech\'s Armour against incoming attacks.',
    definition: [
      {
        type: 'paragraph',
        text:
          'Each Exposed token on a mech reduces that mech\'s Armour by 1 against incoming attacks.'
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
    summary: 'A pressure token that weakens a mech\'s defence when it is attacked.',
    definition: [
      {
        type: 'paragraph',
        text:
          'A Harried token represents a mech being pressured, distracted, boxed in, destabilised, or forced into a poor defensive posture.'
      },
      {
        type: 'list',
        items: [
          'Harried may come from support harassment.',
          'Harried may come from swarm attacks.',
          'Harried may come from suppressive weapon effects.',
          'Harried may come from certain melee or weapon links.',
          'Harried may come from scenario effects.'
        ]
      },
      {
        type: 'paragraph',
        text: 'Harried Effect: when a mech with a Harried token defends against an attack, remove 1 Harried token to apply -1 Defence die.'
      },
      {
        type: 'list',
        items: [
          'A mech cannot be reduced below 1 Defence die by Harried.',
          'A mech may have a maximum of 2 Harried tokens.',
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
  }
];
