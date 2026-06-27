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
      ['Effective Armour', 'Frame Armour - Modifiers (eg. Exposed Tokens).'],
      [
        'Token Usage',
        'Lock-On tokens, Harried tokens, and Exposed tokens can all be used freely by both sides during the combat exchange.'
      ]
    ]
  }
];

const rulesReferenceOrder = new Map(
  ['support-phase', 'cockpit-phase', 'activation-phase', 'combat-and-damage', 'terrain-and-battlefield', 'heat'].map(
    (id, index) => [id, index]
  )
);

const rulesReferences = [
  {
    id: 'heat',
    title: 'Heat Rules',
    summary:
      'Heat represents reactor strain, actuator load, weapon discharge, cockpit temperature, and stress on the Frame\'s internal systems.',
    sections: [
      {
        id: 'heat-overview',
        title: 'Heat',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Heat represents reactor strain, actuator load, weapon discharge, cockpit temperature, and the stress placed on the Frame\'s internal systems.'
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
                'Some weapons, pilot traits and enemy effects may interact with Frames in a Hot state'
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
            text: 'After resolving any Critical Heat effects, each Frame removes 1 Heat, to a minimum of 0.'
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
              'At the beginning of the Activation Phase, the Frame immediately gains +1 Heat for each Overcommitted system.'
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
            text: 'A Frame may have a maximum of 2 Lock-On tokens and 2 Exposed tokens at the end of the Cockpit phase.'
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
    id: 'terrain-and-battlefield',
    title: 'Terrain and Battlefield',
    summary: 'Terrain, cover, impact checks, destructive fire, and battlefield terrain interactions.',
    sections: [
      {
        id: 'terrain',
        title: 'Terrain',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Terrain represents buildings, industrial structures, ruined city blocks, towers, walls, heavy machinery, and other battlefield features large enough to affect Frame combat.'
          },
          {
            type: 'paragraph',
            text: 'Most terrain is placed as an area terrain base. Each area terrain base may contain 1-4 Impact Terrain pieces.'
          },
          {
            type: 'table',
            columns: ['Terrain Piece', 'Example'],
            rows: [
              ['Building', 'apartment block, hangar, warehouse'],
              ['Industrial object', 'fuel tank, crane, generator'],
              ['Defence structure', 'bunker, barricade, reinforced wall'],
              ['Urban structure', 'tower, bridge support, comms mast']
            ]
          },
          {
            type: 'paragraph',
            text:
              'The base defines the area occupied by the terrain. The individual Impact Terrain pieces define what can be destroyed, smashed through, or used as cover.'
          }
        ]
      },
      {
        id: 'impact-terrain',
        title: 'Impact Terrain',
        blocks: [
          {
            type: 'paragraph',
            text: 'Impact Terrain rarely blocks line of sight. Instead, it provides cover and can be destroyed.'
          },
          {
            type: 'paragraph',
            text: 'Impact Terrain can be interacted with in three main ways.'
          },
          {
            type: 'list',
            items: [
              'A Frame moves through it.',
              'A Frame is pushed into it.',
              'A ranged attack passes through it.'
            ]
          },
          {
            type: 'paragraph',
            text:
              'Destroyed Impact Terrain is removed from the terrain base and replaced with a rubble marker. Rubble markers currently have no gameplay effect.'
          }
        ]
      },
      {
        id: 'impact-checks',
        title: 'Impact Checks',
        blocks: [
          {
            type: 'paragraph',
            text:
              'When a Frame physically interacts with Impact Terrain, the pilot controlling that Frame makes an Impact Check. This includes cases where the Frame is pushed into terrain by an enemy attack.'
          },
          {
            type: 'paragraph',
            text: 'A standard Impact Check succeeds on 4+.'
          },
          {
            type: 'table',
            columns: ['Roll', 'Result'],
            rows: [
              ['1-3', 'Failed Impact Check'],
              ['4+', 'Successful Impact Check']
            ]
          },
          {
            type: 'paragraph',
            text: 'Future harder terrain may require a higher result, such as 5+.'
          }
        ]
      },
      {
        id: 'moving-through-impact-terrain',
        title: 'Moving Through Impact Terrain',
        blocks: [
          {
            type: 'paragraph',
            text:
              'When a Frame intentionally moves through Impact Terrain, roll an Impact Check for each Impact Terrain piece it interacts with.'
          },
          {
            type: 'table',
            columns: ['Result', 'Effect'],
            rows: [
              ['1-3', 'The Frame stops. The terrain piece is destroyed. The Frame gains +1 Heat.'],
              ['4+', 'The Frame moves through successfully. Movement may continue.']
            ]
          }
        ]
      },
      {
        id: 'pushback-into-impact-terrain',
        title: 'Pushback Into Impact Terrain',
        blocks: [
          {
            type: 'paragraph',
            text:
              'When a Frame is pushed into Impact Terrain, the pushed Frame\'s pilot makes the Impact Check. Start with the first Impact Terrain piece the Frame contacts.'
          },
          {
            type: 'table',
            columns: ['Result', 'Effect'],
            rows: [
              [
                '1-3',
                'The terrain piece is destroyed. The Frame gains +1 Heat. If pushback distance remains, the push continues.'
              ],
              ['4+', 'The terrain stops the Frame. Pushback ends. No Heat is gained.']
            ]
          },
          {
            type: 'paragraph',
            text: 'If the Frame continues into another Impact Terrain piece, repeat this process.'
          }
        ]
      },
      {
        id: 'jumping-onto-impact-terrain',
        title: 'Jumping Onto Impact Terrain',
        blocks: [
          {
            type: 'paragraph',
            text:
              'When a Frame uses Jump and lands on Impact Terrain, make one Impact Check for the landing, not one roll per terrain piece.'
          },
          {
            type: 'table',
            columns: ['Result', 'Effect'],
            rows: [
              ['1-3', 'All Impact Terrain pieces landed on are destroyed. The Frame gains +1 Heat total.'],
              ['4+', 'All Impact Terrain pieces landed on are destroyed. No additional Heat is generated.']
            ]
          },
          {
            type: 'paragraph',
            text: 'This represents the difference between a rough landing and a controlled landing.'
          }
        ]
      },
      {
        id: 'terrain-and-cover',
        title: 'Terrain and Cover',
        blocks: [
          {
            type: 'paragraph',
            text: 'Impact Terrain rarely blocks line of sight, but it can interfere with ranged attacks.'
          },
          {
            type: 'paragraph',
            text: 'When making a ranged attack, draw a line from the centre of the attacking Frame to the centre of the target Frame.'
          },
          {
            type: 'paragraph',
            text: 'For each Impact Terrain piece crossed by this line, the defender gains +1 Defence.'
          },
          {
            type: 'paragraph',
            text:
              'If the attacker is in base contact with a crossed Impact Terrain piece, ignore that piece. It does not provide cover against that attack.'
          },
          {
            type: 'callout',
            title: 'Example',
            text:
              'A Frame with a Defence of 2 is visible but behind 2 large buildings. Since Line of Sight is traced through these two large buildings, the Defence value of the Frame is now 4.'
          }
        ]
      },
      {
        id: 'destructive-fire',
        title: 'Destructive Fire',
        blocks: [
          {
            type: 'paragraph',
            text: 'After the attacker rolls a ranged attack, each natural 6 destroys one crossed Impact Terrain piece.'
          },
          {
            type: 'paragraph',
            text: 'Destroyed terrain is removed and replaced with a rubble marker.'
          },
          {
            type: 'paragraph',
            text:
              'If multiple natural 6s are rolled, destroy crossed Impact Terrain pieces starting with the piece closest to the attacker.'
          },
          {
            type: 'paragraph',
            text: 'This happens whether the attack hits or misses. Shooting destruction does not generate Heat.'
          }
        ]
      },
      {
        id: 'targeting-impact-terrain',
        title: 'Targeting Impact Terrain',
        blocks: [
          {
            type: 'paragraph',
            text: 'A player may deliberately target Impact Terrain with a ranged attack or melee attack.'
          },
          {
            type: 'paragraph',
            text: 'When attacking Impact Terrain directly, each natural 6 on the attack roll destroys one targeted Impact Terrain piece.'
          },
          {
            type: 'paragraph',
            text:
              'This can be used to clear firing lanes, remove enemy cover, open movement paths, or prepare terrain before forcing an enemy into it.'
          }
        ]
      },
      {
        id: 'elevated-terrain',
        title: 'Elevated Terrain',
        blocks: [
          {
            type: 'paragraph',
            text:
              'Elevated Terrain represents sturdy battlefield features that rise above the surrounding ground, such as hills, ramps, highway sections, bunker roofs, ridgelines, reinforced platforms, and large solid structures.'
          },
          {
            type: 'paragraph',
            text:
              'Elevated Terrain is not Impact Terrain unless a scenario specifically says otherwise. It is not normally destroyed by Impact Checks or ranged attacks.'
          }
        ]
      },
      {
        id: 'elevation-levels',
        title: 'Elevation Levels',
        blocks: [
          {
            type: 'paragraph',
            text: 'Terrain uses only two elevation levels.'
          },
          {
            type: 'table',
            columns: ['Level', 'Meaning'],
            rows: [
              ['Level 0', 'Ground level'],
              ['Level 1', 'Elevated terrain']
            ]
          }
        ]
      },
      {
        id: 'moving-onto-elevated-terrain',
        title: 'Moving Onto Elevated Terrain',
        blocks: [
          {
            type: 'paragraph',
            text: 'A Frame may move onto Level 1 terrain if all of the following are true.'
          },
          {
            type: 'list',
            items: [
              'The Frame\'s base can fit fully on the elevated surface.',
              'There is a ramp, slope, road, or accessible edge.',
              'The Frame has enough movement.'
            ]
          },
          {
            type: 'paragraph',
            text: 'Moving from Level 0 to Level 1 costs +1 MD.'
          },
          {
            type: 'paragraph',
            text: 'If the Frame uses a ramp, road, or gentle slope, this extra movement cost does not apply.'
          }
        ]
      },
      {
        id: 'jumping-onto-or-off-elevated-terrain',
        title: 'Jumping Onto or Off Elevated Terrain',
        blocks: [
          {
            type: 'paragraph',
            text: 'A Frame using Jump may move onto or off Level 1 terrain freely, as long as it can land legally.'
          },
          {
            type: 'paragraph',
            text: 'Jump still follows its normal rules and Heat cost.'
          }
        ]
      },
      {
        id: 'shooting-from-elevated-terrain',
        title: 'Shooting From Elevated Terrain',
        blocks: [
          {
            type: 'paragraph',
            text:
              'If an attacker is on Level 1 and the target is on Level 0, the attacker may ignore one crossed Impact Terrain piece when determining Impact Cover.'
          },
          {
            type: 'paragraph',
            text: 'This represents the elevated Frame firing over low buildings, ruins, and battlefield clutter.'
          },
          {
            type: 'callout',
            title: 'Example',
            text:
              'A Level 1 Frame fires at a Level 0 target. The line of fire crosses two Impact Terrain pieces. Normally, the defender would gain +2 Defence dice. Because the attacker is elevated, it ignores one crossed Impact Terrain piece. The defender gains only +1 Defence die.'
          }
        ]
      },
      {
        id: 'being-pushed-off-elevated-terrain',
        title: 'Being Pushed Off Elevated Terrain',
        blocks: [
          {
            type: 'paragraph',
            text:
              'If a Frame is pushed off Level 1 terrain, place it at the nearest legal Level 0 position in the direction of the push.'
          },
          {
            type: 'paragraph',
            text: 'Then the pushed Frame\'s pilot makes an Impact Check.'
          },
          {
            type: 'table',
            columns: ['Roll', 'Effect'],
            rows: [
              ['1-3', 'Bad landing. The Frame gains +1 Heat.'],
              ['4+', 'Controlled landing. No extra effect.']
            ]
          },
          {
            type: 'paragraph',
            text: 'This does not destroy terrain unless the Frame also lands on or contacts Impact Terrain.'
          }
        ]
      },
      {
        id: 'base-fit',
        title: 'Base Fit',
        blocks: [
          {
            type: 'paragraph',
            text: 'A Frame may only end movement on Level 1 terrain if its base can fit fully and legally on the elevated surface.'
          },
          {
            type: 'paragraph',
            text: 'The current standard Frame base size is 6.5 cm x 6.5 cm.'
          },
          {
            type: 'paragraph',
            text:
              'Larger Frames may use larger bases. Larger bases represent sturdier frames, but they are harder to manoeuvre through tight terrain and may have more difficulty fitting onto elevated surfaces.'
          }
        ]
      },
      {
        id: 'melee-from-elevated-terrain',
        title: 'Melee from Elevated Terrain (WIP)',
        blocks: [
          {
            type: 'paragraph',
            text:
              'There are situations where a Frame is fighting from a lower elevation and cannot be placed on the higher terrain piece to maintain minimum melee range.'
          },
          {
            type: 'paragraph',
            text:
              'In situations like this, the Frame on the lower elevation must use a Jump Mobility Action prior to using a weapon action.'
          }
        ]
      },
      {
        id: 'fall-damage',
        title: 'Fall Damage (WIP)',
        blocks: [
          {
            type: 'paragraph',
            text:
              'If a Frame is pushed off of terrain or is situated on elevated terrain which is subsequently destroyed, each elevation level the Frame falls results in a Mobility Focus loss.'
          },
          {
            type: 'paragraph',
            text:
              'If no Mobility Focus is allocated, the Frame must immediately take 1 Structure damage for each elevation level. This damage is allocated randomly.'
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
] satisfies RulesReferencePage[];

export const RULES_REFERENCES: RulesReferencePage[] = [...rulesReferences].sort(
  (left, right) =>
    (rulesReferenceOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
    (rulesReferenceOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER)
);
