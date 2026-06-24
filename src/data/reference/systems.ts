import type { SystemDefinition } from '../../types';

export const SYSTEMS: SystemDefinition[] = [
  {
    id: 'mobility',
    label: 'Mobility',
    actions: [
      { cost: '1-2', name: 'Step', description: 'Move up to X MD, where X is the number of Focus Tokens spent.' },
      {
        cost: '1 + 1 Heat',
        name: 'Combat Sprint',
        description:
          'Move up to the mech\'s Mobility value in MD. Add 1 High Speed token at the beginning of the movement. Remove 1 Lock-On token.'
      },
      {
        cost: '1 + 1 Heat',
        name: 'Jump',
        description:
          'Move up to Mobility in MD, ignoring terrain and models. Must land in a legal space. Add a High Speed token at the beginning of the movement. Remove 1 Lock-On token.'
      },
      {
        cost: '1 + 1 Heat',
        name: 'Charge Burst',
        description:
          'Move up to Mobility in MD toward an enemy. If distance moved is greater than 1 MD, add a Charge Burst token.'
      },
      {
        cost: '1',
        name: '*Reflexive Step',
        description:
          'Reaction when targeted by a Weapon. Add +1 Defence die. If the attack fails, immediately move 1 full MD in any direction and add +1 Heat.'
      }
    ]
  },
  {
    id: 'weapons',
    label: 'Weapons',
    actions: [
      { cost: '1', name: 'Standard Attack', description: 'Make one melee attack or ranged attack to deal Structure Damage.' },
      {
        cost: '1-3',
        name: 'Exerted Attack',
        description:
          'The same as Standard Attack, except that for each Focus spent after the first token, add +1 to damage. For example, 2 tokens = +1 damage. If two or more Focus are spent, add 1 Heat.'
      },
      {
        cost: '2',
        name: 'Targeted Attack',
        description:
          'Make a Standard Attack or Exerted Attack. If it hits and deals at least 1 Structure damage, choose the system that receives the damage instead of rolling damage assignment.'
      },
      {
        cost: '1-3',
        name: 'Knockback Strike',
        description:
          'Melee Range Only. Make a Standard Attack or Exerted Attack. If successful, deal Structure Damage -1, then push defender back X MD, where X is the number of net successes.'
      },
      {
        cost: '2',
        name: '*Counterstrike Reaction',
        description:
          'Reaction Only. Use an equipped weapon\'s Attack Die in the Contested Roll for combat, with a -1 Attack Die penalty. If successful, you may deal Structural Damage as normal to the attacker. Heavy weapons suffer -2 Attack Die penalty instead of -1.'
      }
    ]
  },
  {
    id: 'neural',
    label: 'Neural Link',
    actions: [
      {
        cost: '1',
        name: 'Vent Heat',
        description: 'Remove 2 Heat. If affected by Emergency Vent Fault, remove 1 less Heat.'
      },
      {
        cost: '1-3',
        name: 'System Reset',
        description: 'Used to repair Major Damage Warnings. Check the Major Damage card for more details.'
      },
      {
        cost: '1 + 1 Heat',
        name: '*Emergency Field Patch',
        description: 'Ignore one Critical Damage card for the current action only. Does not remove the card.'
      }
    ]
  },
  {
    id: 'defence',
    label: 'Defence',
    actions: [
      {
        cost: '1-3',
        name: '*Shield Flare',
        description:
          'Add +X Defence dice against one incoming attack before the attack is rolled, where X is the number of Focus tokens spent.'
      },
      {
        cost: '1',
        name: '*Brace',
        description:
          'Reduce Structural Damage by 1 from the attack. If the result ends with a pushback, you may reduce your pushback distance by 1 MD.'
      },
      {
        cost: '1-3',
        name: '*Extend Shields',
        description:
          'Roll X dice when you would receive a Lock-On or Exposed token. 4+ cancels 1 token. 6+ cancels 2 tokens.'
      },
      {
        cost: '2',
        name: '*Armour Lock',
        description: 'Ignore up to 1 Exposed token on this mech for this attack only.'
      }
    ]
  },
  {
    id: 'reactor',
    label: 'Reactor',
    actions: [
      {
        cost: '1',
        name: 'Vent Heat',
        description: 'Remove 2 Heat. If affected by Emergency Vent Fault, remove 1 less Heat.'
      },
      { cost: '2', name: 'Power Route', description: 'Move 1 allocated Focus from one system to another.' },
      {
        cost: '1-3',
        name: 'System Reset',
        description: 'Used to repair Major Damage Warnings. Check the Major Damage card for more details.'
      },
      {
        cost: '1 + 1 Heat',
        name: '*Emergency Field Patch',
        description: 'Ignore one Critical Damage card for the current action only. Does not remove the card.'
      }
    ]
  },
  {
    id: 'sensors',
    label: 'Sensors',
    actions: [
      {
        cost: '1-3',
        name: 'Scan For Weak Points',
        description: 'Roll X dice per Sensors Focus spent. Each 5+ places 1 Exposed token. 6+ places 2 tokens.'
      },
      {
        cost: '1-3',
        name: 'Improve Targeting',
        description: 'Roll X dice per Sensors Focus spent. Each 4+ places 1 Lock-On token. 6+ places 2 tokens.'
      },
      {
        cost: '1-3',
        name: 'Sensor Scramble',
        description:
          'Roll X dice. 1-2 = no effect. 3-4 = remove Lock-On token. 5-6 = remove Exposed token. If no corresponding token exists, then no effect.'
      }
    ]
  }
];
