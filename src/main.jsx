import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Cpu,
  Crosshair,
  Flame,
  Gauge,
  Minus,
  Plus,
  Radar,
  RotateCcw,
  Shield,
  Sparkles,
  Zap
} from 'lucide-react';
import './styles.css';

const SYSTEMS = [
  {
    id: 'mobility',
    label: 'Mobility',
    icon: Zap,
    accent: '#19a7a5',
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
    ],
    damageMarkers: [
      { roll: '1-2', name: 'Seized Actuator', effect: 'Reduce movement by 1 MD.' },
      { roll: '3-4', name: 'Gyro Stutter', effect: 'After Boosting, gain 1 additional Heat.' },
      { roll: '5-6', name: 'Locked Knee', effect: 'Cannot Redline Dash until repaired.' }
    ]
  },
  {
    id: 'weapons',
    label: 'Weapons',
    icon: Crosshair,
    accent: '#e7583e',
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
    ],
    damageMarkers: [
      { roll: '1-2', name: 'Jammed Feed', effect: 'First Weapon Action each round loses 1 die.' },
      { roll: '3-4', name: 'Hardpoint Drift', effect: 'Cannot benefit from more than 1 Lock-On.' },
      { roll: '5-6', name: 'Breach Alarm', effect: 'Overcharge Volley gains 1 extra Heat.' }
    ]
  },
  {
    id: 'neural',
    label: 'Neural Link',
    icon: Sparkles,
    accent: '#7c5cff',
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
    ],
    damageMarkers: [
      { roll: '1-2', name: 'Signal Lag', effect: 'Handler Calls require line of sight from this Frame.' },
      { roll: '3-4', name: 'Feedback Spike', effect: 'After a Support Call, roll 1d6; on 1, gain 1 Heat.' },
      { roll: '5-6', name: 'Link Burn', effect: 'Sync Surge cannot be used.' }
    ]
  },
  {
    id: 'defence',
    label: 'Defence',
    icon: Shield,
    accent: '#e2a93b',
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
    ],
    damageMarkers: [
      { roll: '1-2', name: 'Armour Gap', effect: 'First incoming hit each round gains +1 damage on a 6.' },
      { roll: '3-4', name: 'Shield Drop', effect: 'Brace costs 1 additional Focus.' },
      { roll: '5-6', name: 'Countermeasure Fault', effect: 'Countermeasure Burst clears only Lock-On.' }
    ]
  },
  {
    id: 'reactor',
    label: 'Reactor',
    icon: Cpu,
    accent: '#f0b947',
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
    ],
    damageMarkers: [
      { roll: '1-2', name: 'Coolant Leak', effect: 'Vent Heat removes no Heat on a roll of 1.' },
      { roll: '3-4', name: 'Power Flutter', effect: 'Power Route cannot move Focus into Weapons.' },
      { roll: '5-6', name: 'Core Warning', effect: 'At Heat 8+, all Heat costs increase by 1.' }
    ]
  },
  {
    id: 'sensors',
    label: 'Sensors',
    icon: Radar,
    accent: '#8fcb6b',
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
    ],
    damageMarkers: [
      { roll: '1-2', name: 'Static Wash', effect: 'Scan range is reduced by 2 MD.' },
      { roll: '3-4', name: 'Bad Return', effect: 'Target Analysis requires line of sight.' },
      { roll: '5-6', name: 'Blind Sector', effect: 'Wide Spectrum Sweep can target only one enemy.' }
    ]
  }
];

const HANDLERS = [
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

const DEFAULT_FOCUS = {
  mobility: 1,
  weapons: 2,
  neural: 2,
  defence: 1,
  reactor: 0,
  sensors: 0
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function Stepper({ value, min = 0, max = 9, onChange, label }) {
  return (
    <div className="stepper" aria-label={label}>
      <button type="button" onClick={() => onChange(clamp(value - 1, min, max))} aria-label={`Decrease ${label}`}>
        <Minus size={18} />
      </button>
      <output>{value}</output>
      <button type="button" onClick={() => onChange(clamp(value + 1, min, max))} aria-label={`Increase ${label}`}>
        <Plus size={18} />
      </button>
    </div>
  );
}

function App() {
  const savedState = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('redline-sync-state')) || {};
    } catch {
      return {};
    }
  }, []);
  const savedFocus = savedState.focus ?? {};
  const [focusPool, setFocusPool] = useState(savedState.focusPool ?? 6);
  const [focus, setFocus] = useState({
    ...DEFAULT_FOCUS,
    ...savedFocus,
    mobility: savedFocus.mobility ?? savedFocus.movement ?? DEFAULT_FOCUS.mobility
  });
  const [heat, setHeat] = useState(savedState.heat ?? 3);
  const [handler, setHandler] = useState(savedState.handler ?? 'tactical');
  const [expandedCall, setExpandedCall] = useState(0);

  const spentFocus = useMemo(() => Object.values(focus).reduce((total, value) => total + value, 0), [focus]);
  const remainingFocus = focusPool - spentFocus;
  const activeHandler = HANDLERS.find((item) => item.id === handler);

  useEffect(() => {
    localStorage.setItem('redline-sync-state', JSON.stringify({ focusPool, focus, heat, handler }));
  }, [focus, focusPool, handler, heat]);

  const updateFocusPool = (value) => {
    setFocusPool(value);
    setFocus((currentFocus) => {
      const nextFocus = { ...currentFocus };
      let overflow = Object.values(nextFocus).reduce((total, item) => total + item, 0) - value;
      [...SYSTEMS].reverse().forEach(({ id }) => {
        if (overflow <= 0) return;
        const reduction = Math.min(nextFocus[id], overflow);
        nextFocus[id] -= reduction;
        overflow -= reduction;
      });
      return nextFocus;
    });
  };

  const updateFocus = (systemId, value) => {
    const current = focus[systemId];
    const projectedSpend = spentFocus - current + value;
    if (projectedSpend <= focusPool) {
      setFocus((next) => ({ ...next, [systemId]: value }));
    }
  };

  const resetFrame = () => {
    setFocus({ mobility: 0, weapons: 0, neural: 0, defence: 0, reactor: 0, sensors: 0 });
    setHeat(0);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Iron Colossus companion</p>
          <h1>Redline Sync</h1>
        </div>
        <button className="icon-action" type="button" onClick={resetFrame} aria-label="Reset frame">
          <RotateCcw size={20} />
        </button>
      </header>

      <section className="status-band">
        <div className="meter-card focus-meter">
          <div className="meter-heading">
            <Gauge size={20} />
            <span>Focus Pool</span>
          </div>
          <Stepper value={focusPool} min={0} max={12} onChange={updateFocusPool} label="focus pool" />
          <p>{remainingFocus} remaining</p>
        </div>
        <div className="meter-card heat-meter">
          <div className="meter-heading">
            <Flame size={20} />
            <span>Heat</span>
          </div>
          <Stepper value={heat} min={0} max={12} onChange={setHeat} label="heat" />
          <div className="heat-track" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, index) => (
              <span key={index} className={index < heat ? 'active' : ''} />
            ))}
          </div>
        </div>
      </section>

      <div className="workspace">
        <section className="panel focus-panel">
          <div className="section-title">
            <Activity size={20} />
            <h2>Allocate Focus</h2>
          </div>
          <div className="focus-grid">
            {SYSTEMS.map(({ id, label, icon: Icon, accent, actions, damageMarkers }) => (
              <article className="system-card" key={id} style={{ '--accent': accent }}>
                <div className="system-header">
                  <div className="system-copy">
                    <Icon size={22} />
                    <span>{label}</span>
                  </div>
                  <Stepper
                    value={focus[id]}
                    max={focusPool}
                    onChange={(value) => updateFocus(id, value)}
                    label={`${label} focus`}
                  />
                </div>

                <div className="data-table action-table" aria-label={`${label} actions`}>
                  <div className="table-head">
                    <span>Cost</span>
                    <span>Action</span>
                    <span>Description</span>
                  </div>
                  {actions.map((action) => (
                    <div className="table-row" key={action.name}>
                      <span className="cost-pill">{action.cost}</span>
                      <strong>{action.name}</strong>
                      <span>{action.description}</span>
                    </div>
                  ))}
                </div>

                <div className="damage-marker-section">
                  <h3>Damage Markers</h3>
                  <div className="data-table marker-table" aria-label={`${label} damage markers`}>
                    <div className="table-head">
                      <span>Roll</span>
                      <span>Name</span>
                      <span>Effect</span>
                    </div>
                    {damageMarkers.map((marker) => (
                      <div className="table-row" key={marker.name}>
                        <span className="roll-pill">{marker.roll}</span>
                        <strong>{marker.name}</strong>
                        <span>{marker.effect}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel handler-panel">
          <div className="section-title">
            <Sparkles size={20} />
            <h2>Handler</h2>
          </div>
          <div className="handler-tabs">
            {HANDLERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={handler === item.id ? 'selected' : ''}
                onClick={() => {
                  setHandler(item.id);
                  setExpandedCall(0);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="handler-summary">
            <p>{activeHandler.role}</p>
            <strong>{activeHandler.asset}</strong>
          </div>
          <div className="call-list">
            {activeHandler.calls.map((call, index) => {
              const [name, body] = call.split(': ');
              const open = expandedCall === index;
              return (
                <article className="call-item" key={call}>
                  <button type="button" onClick={() => setExpandedCall(open ? -1 : index)}>
                    <span>{name}</span>
                    {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {open && <p>{body}</p>}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
