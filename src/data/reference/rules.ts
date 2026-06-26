import type { RulesReferencePage } from '../../types';

const combatAndDamageOverview = [
  {
    type: 'paragraph' as const,
    text: 'Damage is calculated the same way for both ranged and melee attacks.'
  },
  {
    type: 'paragraph' as const,
    text:
      'Contested Roll: Attacker\'s Attack Die vs Defence Die OR Attacker\'s Attack Die vs Defender\'s Attack Die. The side with the higher successes succeeds in their Combat Action.',
    combatRole: 'both' as const
  },
  {
    type: 'table' as const,
    columns: ['Combat term', 'Rule'],
    combatRole: 'both' as const,
    rows: [
      [
        'Structure Damage',
        '(Weapon Damage + Net Success Bonus + additional bonuses) - Effective Armour'
      ],
      ['Net Success Bonus', 'Net Successes are calculated from every 2 successes over the target value.'],
      ['Effective Armour', 'Mech Armour - Armour Down tokens and other effects.'],
      [
        'Token Usage',
        'Lock-On tokens, Harried tokens, and Exposed tokens can all be used freely by both sides during the combat exchange.'
      ]
    ]
  }
];

export const RULES_REFERENCES: RulesReferencePage[] = [
  {
    id: 'heat',
    title: 'Heat Rules',
    summary:
      'Heat represents reactor strain, actuator load, weapon discharge, cockpit temperature, and stress on the mech\'s internal systems.',
    sections: [
      {
        id: 'heat-overview',
        title: 'Heat',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Heat represents reactor strain, actuator load, weapon discharge, cockpit temperature, and the stress placed on the mech\'s internal systems.'
          },
          {
            type: 'paragraph',
            text:
              'Heat can be generated from Weapons, System Actions, Terrain Impact Damage and many other sources.'
          },
          {
            type: 'paragraph',
            text: 'Heat is tracked from 0 to 8+.'
          }
        ]
      },
      {
        id: 'heat-states',
        title: 'Heat States',
        blocks: [
          {
            type: 'table',
            columns: ['Heat', 'State', 'Effect'],
            rows: [
              ['0-3', 'Stable', 'No effect'],
              [
                '4-5',
                'Hot',
                'Some weapons, pilot traits and enemy effects may interact with Mechs in a Hot state'
              ],
              ['6-8', 'Redline', 'Redline Surge']
            ]
          },
          {
            type: 'paragraph',
            text:
              'Increasing your heat to Redline state leads to significant benefits, but at the risk of causing damage to the Frame.'
          }
        ]
      }
    ]
  },
  {
    id: 'cockpit-phase',
    title: 'Cockpit Phase',
    summary: 'The Cockpit Phase happens at the start of each round.',
    overviewBlocks: [
      {
        type: 'paragraph',
        text: 'The Cockpit Phase happens at the start of each round.'
      },
      {
        type: 'table',
        columns: ['Step', 'Rule'],
        rows: [
          ['8', 'Apply Passive Cooling'],
          ['9', 'Resolve Major Damage effects'],
          ['10', 'Refresh Focus'],
          ['11', 'Cockpit Allocation'],
          ['12', 'Determine Initiative by Sensor Bid'],
          ['13', 'Clean up temporary effects and Lock-On'],
          ['14', 'Begin the Activation Sequence']
        ]
      }
    ],
    sections: [
      {
        id: 'passive-cooling',
        title: '1. Passive Cooling',
        blocks: [
          {
            type: 'paragraph',
            text: 'After resolving any Critical Heat effects, each mech removes 1 Heat, to a minimum of 0.'
          },
          {
            type: 'paragraph',
            text: 'A mech at 8 Heat still resolves the Reactor Warning table before cooling.'
          }
        ]
      },
      {
        id: 'major-damage-effects',
        title: '2. Resolve Major Damage Effects',
        blocks: [
          {
            type: 'paragraph',
            text: 'Some Major Damage effects may trigger at this time.'
          }
        ]
      },
      {
        id: 'refresh-focus',
        title: '3. Refresh Focus',
        blocks: [
          {
            type: 'paragraph',
            text: 'Each player normally gains 6 Focus.'
          },
          {
            type: 'paragraph',
            text: 'This may be reduced by Heat, Major Damage effects, or scenario effects.'
          }
        ]
      },
      {
        id: 'cockpit-allocation',
        title: '4. Cockpit Allocation',
        blocks: [
          {
            type: 'paragraph',
            text: 'Each player secretly assigns Focus to the six cockpit systems.'
          },
          {
            type: 'list',
            items: ['Mobility', 'Weapons', 'Sensors', 'Defence', 'Cockpit Frame', 'Reactor']
          },
          {
            type: 'paragraph',
            text: 'During Cockpit Allocation, a player may assign more than 3 Focus to a single system.'
          },
          {
            type: 'heading',
            text: 'Overcommitted'
          },
          {
            type: 'paragraph',
            text: 'Any system with more than 3 Focus assigned is considered Overcommitted.'
          },
          {
            type: 'paragraph',
            text:
              'At the beginning of the Activation Phase, the mech immediately gains +1 Heat for each Overcommitted system.'
          },
          {
            type: 'paragraph',
            text: 'This Heat is gained once per round, not each time the system is used.'
          },
          {
            type: 'paragraph',
            text:
              'Example: This Pilot doesn\'t know what the enemy will do and wants to stay balanced. They allocated focus to Mobility to move into cover. It allocates Weapons focus to try and shoot at the enemy if the opportunity arises. The Pilot also wants to try and use its sensors to try and Scan for Weak Points, if possible. They also assign focus to Defence to be able to use Shield Flare to deflect any damage.'
          },
          {
            type: 'table',
            columns: ['System', 'Focus'],
            rows: [
              ['Mobility', '2'],
              ['Weapons', '2'],
              ['Sensors', '1'],
              ['Defence', '1'],
              ['Cockpit Frame', '0'],
              ['Reactor', '0']
            ]
          }
        ]
      },
      {
        id: 'sensor-bid-initiative',
        title: '5. Sensor Bid Initiative',
        blocks: [
          {
            type: 'paragraph',
            text: 'After Focus is revealed, compare assigned Sensors Focus.'
          },
          {
            type: 'paragraph',
            text: 'The player with more Sensors Focus chooses who takes the first Focus Activation.'
          },
          {
            type: 'paragraph',
            text: 'If tied, resolve the tie in order.'
          },
          {
            type: 'list',
            items: [
              'Lower Heat chooses.',
              'If still tied, the player who did not choose first action last round chooses.',
              'In Round 1, if still tied, roll off.'
            ]
          }
        ]
      },
      {
        id: 'sensor-token-cleanup',
        title: '6. Sensor Token Cleanup',
        blocks: [
          {
            type: 'paragraph',
            text: 'A mech may have a maximum of 2 Lock-On tokens and 2 Exposed tokens at the end of the Cockpit phase.'
          },
          {
            type: 'paragraph',
            text: 'Each player must remove any excess tokens.'
          }
        ]
      }
    ]
  },
  {
    id: 'activation-phase',
    title: 'Activation Phase',
    summary: 'Players alternate taking Focus Activations and may perform up to two permitted actions.',
    sections: [
      {
        id: 'activation-sequence',
        title: 'Activation Sequence',
        blocks: [
          {
            type: 'paragraph',
            text:
              'At the beginning of the Activation Phase, add +1 Heat for any systems that are Overcommitted, meaning they have more than 3 Focus tokens allocated.'
          },
          {
            type: 'paragraph',
            text: 'Players alternate taking Focus Activations.'
          },
          {
            type: 'paragraph',
            text: 'During a Focus Activation, you may perform up to two permitted actions.'
          },
          {
            type: 'paragraph',
            text: 'Each action must be from a different cockpit system.'
          },
          {
            type: 'paragraph',
            text: 'You may spend as many tokens as you wish per Action.'
          }
        ]
      }
    ]
  },
  {
    id: 'support-phase',
    title: 'Support Phase',
    summary: 'If support units are used, players roll off to determine who chooses to activate support units first.',
    sections: [
      {
        id: 'support-activation-order',
        title: 'Support Activation Order',
        blocks: [
          {
            type: 'paragraph',
            text:
              'If support units are used, players roll off to determine who chooses to activate their support units first.'
          },
          {
            type: 'paragraph',
            text: 'These rules are currently unavailable at the present time.'
          }
        ]
      }
    ]
  },
  {
    id: 'end-phase',
    title: 'End Phase',
    summary: 'Resolve any scenario scoring and end-of-round effects.',
    sections: [
      {
        id: 'end-of-round-effects',
        title: 'End-of-Round Effects',
        blocks: [
          {
            type: 'paragraph',
            text: 'Resolve any scenario scoring and end-of-round effects.'
          }
        ]
      }
    ]
  },
  {
    id: 'combat-and-damage',
    title: 'Combat and Damage',
    summary: 'Ranged and melee combat reference, including shared damage calculation rules.',
    overviewBlocks: combatAndDamageOverview,
    sections: [
      {
        id: 'ranged-combat',
        title: 'Ranged Combat',
        blocks: [
          {
            type: 'paragraph',
            text: 'Ranged combat is an opposed roll.',
            combatRole: ''
          },
          {
            type: 'list',
            items: [
              {
                text: 'Attacker declares the Weapon Action, or combination of valid Weapon Actions, they wish to use.',
                combatRole: 'attacker'
              },
              {
                text: 'Defender declares if they will use a Defence Reaction, Weapon Reaction, Mobility Reaction, or no Reaction.',
                combatRole: 'defender'
              },
              {
                text: 'If the defender chooses a Weapon Reaction, they roll weapon dice for an equipped weapon instead of Defence dice.',
                combatRole: 'defender'
              },
              { text: 'Otherwise, they roll Defence dice.', combatRole: 'defender' },
              { text: 'Both sides do a Contested Roll and compare successes.', combatRole: 'both' },
              {
                text: 'If the attacker wins, apply the results of the attacker\'s Weapon Action. Apply any Defender Action effects, if applicable.',
                combatRole: 'attacker'
              },
              {
                text: 'If the defender wins, resolve any additional effects of the action selected, if applicable. If no Weapon or Defence Reaction was selected, apply no further damage unless a special rule dictates otherwise.',
                combatRole: 'defender'
              },
              { text: 'If tied, no further action is required.', combatRole: 'both' },
              {
                text: 'If combat results in any destroyed terrain, from 6s rolled by either player that used a Weapon Action, resolve the effects of this damage now.',
                combatRole: 'both'
              }
            ]
          },
          {
            type: 'heading',
            text: 'Attacker Actions',
            combatRole: 'attacker'
          },
          {
            type: 'paragraph',
            text:
              'The actions the attacker can use are listed in the Weapons System chart. They include Standard Attack, Exerted Attack, Targeted Attack, and Knockback Strike.',
            combatRole: 'attacker'
          },
          {
            type: 'heading',
            text: 'Defender Reactions',
            combatRole: 'defender'
          },
          {
            type: 'paragraph',
            text:
              'Reactions are declared once a target has been declared. Reactions can use the Defence System, Mobility System, or Weapon System.',
            combatRole: 'defender'
          },
          {
            type: 'list',
            combatRole: 'defender',
            items: [
              'Reactions are optional. If no reaction is selected, combat is resolved using the target\'s Defence die.',
              'Defence Reactions include Shield Flare, Brace, and Extend Shields.',
              'Weapon Reactions include Counterstrike Reaction.',
              'Mobility Reactions include Reflexive Step.',
              'Only one reaction can be selected during an opponent\'s action.'
            ]
          },
			 
        ]
      },
      {
        id: 'melee-combat',
        title: 'Melee Combat',
        blocks: [
          {
            type: 'paragraph',
            text: 'Melee combat is also an opposed roll.',
            combatRole: ''
          },
          {
            type: 'list',
            items: [
              {
                text: 'Attacker declares the Weapon Action, or combination of valid Weapon Actions, they wish to use.',
                combatRole: 'attacker'
              },
              {
                text: 'Defender declares if they will use a Defence Reaction, Weapon Reaction, Mobility Reaction, or no Reaction.',
					  combatRole: 'defender'
              },
              {
                text: 'If the defender chooses a Weapon Reaction, they roll weapon dice instead of Defence dice.',
					  combatRole: 'defender'
              },
              { text: 'Otherwise, they roll Attack die for an equipped weapon.', combatRole: 'defender' },
              { text: 'Both sides do a Contested Roll and compare successes.', combatRole: 'both' },
              {
                text: 'If the attacker wins, apply the results of the attacker\'s Weapon Action. Apply any Defender Action effects, if applicable.',
                combatRole: 'attacker'
              },
              {
                text: 'If the defender wins, resolve any additional effects of the action selected, if applicable. If no reaction was selected, apply no additional damage unless a special rule dictates otherwise.',
                combatRole: 'defender'
              },
              { text: 'If tied, both sides remain in Melee Deadlock and gain +1 Heat.', combatRole: 'both' },
              {
                text: 'Resolve the effects of pushback, including any Destroyed Terrain effects, if applicable.',
                combatRole: 'both'
              }
            ]
          },
          {
            type: 'heading',
            text: 'Attacker Actions',
            combatRole: 'attacker'
          },
          {
            type: 'paragraph',
            text:
              'The actions the attacker can use are listed in the Weapons System chart. They include Standard Attack, Exerted Attack, Targeted Attack, and Knockback Strike.',
            combatRole: 'attacker'
          },
          {
            type: 'heading',
            text: 'Defender Outcomes',
            combatRole: 'defender'
          },
          {
            type: 'paragraph',
            text:
              'Reactions are declared once a target has been declared. Reactions can use the Defence System, Mobility System, or Weapon System.',
            combatRole: 'defender'
          },
          {
            type: 'list',
            combatRole: 'defender',
            items: [
              'Reactions are optional. If no reaction is selected, combat is resolved using an equipped weapon\'s Attack die.',
              'Defence Reactions include Shield Flare, Brace, and Extend Shields.',
              'Weapon Reactions include Counterstrike Reaction.',
              'Mobility Reactions include Reflexive Step.',
              'Only one reaction can be selected during an opponent\'s action.'
            ]
          }
        ]
      }
    ]
  }
];
