import {
	Activity,
	AlertTriangle,
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
	Swords,
	Zap
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
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

const WEAPONS = [
  {
    id: 'burst-carbine-br2',
    slot: 'ranged',
    name: '"BURST-CARBINE" BR-2 Rifle',
    attackDie: 3,
    damage: 2,
    minRange: 2,
    maxRange: 6,
    specialRules: [
      {
        name: 'Overcharge - Damage',
        text: 'When attacking, you can choose to gain +1 Heat to add +1 Damage to the attack.'
      },
      {
        name: 'Reliable',
        text: 'When attacking with this weapon, reroll 1 attack die. The second result must be kept.'
      },
      {
        name: 'Suppressive Pattern',
        text: 'Condition: Target has at least 1 Lock-On token or 1 Harried token. Effect: If this attack hits, place 1 Harried token on the target.'
      }
    ]
  },
  {
    id: 'compact-rail-pistol',
    slot: 'ranged',
    name: 'Compact Rail Pistol',
    attackDie: 2,
    damage: 1,
    minRange: 1,
    maxRange: 4,
    specialRules: []
  },
  {
    id: 'titan-cleaver',
    slot: 'melee',
    name: 'Titan Cleaver',
    attackDie: 3,
    damage: 2,
    minRange: 0,
    maxRange: 1,
    specialRules: [
      {
        name: 'Heavy Arc',
        text: 'When this attack deals Structure Damage, push the defender 1 MD.'
      }
    ]
  },
  {
    id: 'impact-knife',
    slot: 'melee',
    name: 'Impact Knife',
    attackDie: 2,
    damage: 1,
    minRange: 0,
    maxRange: 1,
    specialRules: []
  }
];

const DEFAULT_EQUIPPED_WEAPONS = {
  melee: 'titan-cleaver',
  ranged: 'burst-carbine-br2'
};

const PILOT_CARD = {
  pilotName: 'Callsign Vantage',
  mechName: 'IC-07 Redline Frame',
  mobility: 3,
  defence: 2,
  specialAbility: {
    name: 'Ace Pilot',
    text: 'This pilot is skilled at converting targeting data into decisive shots. Once per round, when this pilot attacks a target with 2+ Lock-On tokens, they may reroll one additional attack die. This does not add a Lock-On token and does not remove Lock-On tokens.'
  }
};

function getDamageSeverity(marker) {
  return marker.roll === '1-2' ? 'critical' : 'warning';
}

function getHeatState(heat) {
  if (heat >= 6) return { label: 'Redline', range: '6-8', className: 'redline' };
  if (heat >= 4) return { label: 'Hot', range: '4-5', className: 'hot' };
  return { label: 'Steady', range: '0-3', className: 'steady' };
}

const HEAT_STATES = [
  { label: 'Steady', range: '0-3', className: 'steady' },
  { label: 'Hot', range: '4-5', className: 'hot' },
  { label: 'Redline', range: '6-8', className: 'redline' }
];

const HEAT_RULES = {
  steady: ['No additional Steady heat rules yet.'],
  hot: ['Some weapons, pilot traits, and enemy effects may interact with Hot mechs.'],
  redline: [
    'Choose one bonus: +1 MD to one Mobility action OR +1 Attack die to one attack this activation.',
    'Then, roll 1d6. On a 1-2, assign 1 Structure damage to a random system.',
    'Gaining Heat at 6+: roll 1d6 for each Heat gained. On a 1-2, assign 1 Structure damage to a random system.'
  ]
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

function WeaponSlot({ label, slot, selectedWeapon, onChange, onOpen }) {
  const options = WEAPONS.filter((weapon) => weapon.slot === slot);

  return (
    <article className="weapon-slot" onClick={() => onOpen(selectedWeapon)} role="button" tabIndex={0}>
      <div className="weapon-slot-header">
        <span>{label}</span>
        <select
          value={selectedWeapon.id}
          onChange={(event) => onChange(slot, event.target.value)}
          onClick={(event) => event.stopPropagation()}
          aria-label={`${label} weapon`}
        >
          {options.map((weapon) => (
            <option key={weapon.id} value={weapon.id}>
              {weapon.name}
            </option>
          ))}
        </select>
      </div>
      <div className="weapon-name">{selectedWeapon.name}</div>
      <div className="weapon-stats" aria-label={`${selectedWeapon.name} stats`}>
        <span>Attack Die {selectedWeapon.attackDie}</span>
        <span>Dmg {selectedWeapon.damage}</span>
        <span>
          {selectedWeapon.minRange}/{selectedWeapon.maxRange}MD
        </span>
      </div>
      <div className="weapon-tags" aria-label={`${selectedWeapon.name} tags`}>
        {selectedWeapon.specialRules.length ? (
          selectedWeapon.specialRules.map((rule) => <span key={rule.name}>{rule.name}</span>)
        ) : (
          <span>No special rules</span>
        )}
      </div>
    </article>
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
  const [equippedWeapons, setEquippedWeapons] = useState({
    ...DEFAULT_EQUIPPED_WEAPONS,
    ...(savedState.equippedWeapons ?? {})
  });
  const [heat, setHeat] = useState(savedState.heat ?? 3);
  const [handler, setHandler] = useState(savedState.handler ?? 'tactical');
  const [expandedCall, setExpandedCall] = useState(0);
  const [expandedSystems, setExpandedSystems] = useState({ mobility: true });
  const [expandedDamageTables, setExpandedDamageTables] = useState({});
  const [selectedDamageMarkers, setSelectedDamageMarkers] = useState(savedState.selectedDamageMarkers ?? {});
  const [focusedDamageMarker, setFocusedDamageMarker] = useState(null);
  const [isHeatModalOpen, setIsHeatModalOpen] = useState(false);
  const [selectedHeatRules, setSelectedHeatRules] = useState(null);
  const [isWeaponsPanelExpanded, setIsWeaponsPanelExpanded] = useState(true);
  const [selectedWeaponDetails, setSelectedWeaponDetails] = useState(null);
  const [isPilotCardExpanded, setIsPilotCardExpanded] = useState(false);

  const spentFocus = useMemo(() => Object.values(focus).reduce((total, value) => total + value, 0), [focus]);
  const remainingFocus = focusPool - spentFocus;
  const activeHandler = HANDLERS.find((item) => item.id === handler);
  const heatState = getHeatState(heat);
  const modalHeatState = selectedHeatRules ?? heatState;
  const meleeWeapon = WEAPONS.find((weapon) => weapon.id === equippedWeapons.melee) ?? WEAPONS.find((weapon) => weapon.slot === 'melee');
  const rangedWeapon = WEAPONS.find((weapon) => weapon.id === equippedWeapons.ranged) ?? WEAPONS.find((weapon) => weapon.slot === 'ranged');

  useEffect(() => {
    localStorage.setItem(
      'redline-sync-state',
      JSON.stringify({ focusPool, focus, equippedWeapons, heat, handler, selectedDamageMarkers })
    );
  }, [equippedWeapons, focus, focusPool, handler, heat, selectedDamageMarkers]);

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

  const toggleSystem = (systemId) => {
    setExpandedSystems((current) => ({ ...current, [systemId]: !current[systemId] }));
  };

  const toggleDamageTable = (systemId) => {
    setExpandedDamageTables((current) => ({ ...current, [systemId]: !current[systemId] }));
  };

  const toggleDamageMarker = (systemId, markerName) => {
    setSelectedDamageMarkers((current) => {
      const currentMarkers = Array.isArray(current[systemId])
        ? current[systemId]
        : current[systemId]
          ? [current[systemId]]
          : [];
      const nextMarkers = currentMarkers.includes(markerName)
        ? currentMarkers.filter((name) => name !== markerName)
        : [...currentMarkers, markerName];

      return {
        ...current,
        [systemId]: nextMarkers
      };
    });
  };

  const showDamageMarker = (systemId, markerName) => {
    setExpandedDamageTables((current) => ({ ...current, [systemId]: true }));
    setFocusedDamageMarker({ systemId, markerName });
  };

  const updateEquippedWeapon = (slot, weaponId) => {
    setEquippedWeapons((current) => ({ ...current, [slot]: weaponId }));
  };

  const openHeatRules = (state = heatState) => {
    setSelectedHeatRules(state);
    setIsHeatModalOpen(true);
  };

  const closeHeatRules = () => {
    setIsHeatModalOpen(false);
    setSelectedHeatRules(null);
  };

  const closeWeaponDetails = () => {
    setSelectedWeaponDetails(null);
  };

  useEffect(() => {
    if (!focusedDamageMarker) return;

    const selector = `[data-system-id="${focusedDamageMarker.systemId}"][data-marker-name="${CSS.escape(focusedDamageMarker.markerName)}"]`;
    const frame = requestAnimationFrame(() => {
      const row = document.querySelector(selector);
      row?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row?.focus({ preventScroll: true });
    });

    const timeout = window.setTimeout(() => setFocusedDamageMarker(null), 1400);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [focusedDamageMarker]);

  const resetFocusAllocation = () => {
    setFocus({ mobility: 0, weapons: 0, neural: 0, defence: 0, reactor: 0, sensors: 0 });
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Iron Colossus companion</p>
          <h1>Resonance Sync Z</h1>
        </div>
        <button className="icon-action" type="button" onClick={resetFocusAllocation} aria-label="Reset allocated focus">
          <RotateCcw size={20} />
        </button>
      </header>

      <section className="status-band">
        <section className={`meter-card focus-meter pilot-card ${isPilotCardExpanded ? 'expanded' : ''}`}>
          <div className="pilot-card-main">
            <div className="pilot-card-left">
              <div className="pilot-portrait" aria-hidden="true">
                <Gauge size={28} />
              </div>
              <div className="pilot-stat-grid" aria-label="Pilot frame stats">
                <span>Mob {PILOT_CARD.mobility}</span>
                <span>Def {PILOT_CARD.defence}</span>
              </div>
              <div className="pilot-focus-compact">
                <span>Focus Pool</span>
                <strong>{focusPool}</strong>
              </div>
            </div>
            <div className="pilot-card-info">
              <div className="pilot-card-heading">
                <div>
                  <p className="eyebrow">Pilot</p>
                  <h2>{PILOT_CARD.pilotName}</h2>
                  <span>{PILOT_CARD.mechName}</span>
                </div>
                <button
                  className="collapse-toggle"
                  type="button"
                  aria-expanded={isPilotCardExpanded}
                  aria-label={`${isPilotCardExpanded ? 'Hide' : 'Show'} pilot details`}
                  onClick={() => setIsPilotCardExpanded((current) => !current)}
                >
                  {isPilotCardExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
              <div className="pilot-ability-summary">
                <strong>{PILOT_CARD.specialAbility.name}</strong>
              </div>
              {isPilotCardExpanded && (
                <div className="pilot-card-details">
                  <div className="pilot-focus-controls">
                    <Stepper value={focusPool} min={0} max={12} onChange={updateFocusPool} label="focus pool" />
                    <p>{remainingFocus} remaining</p>
                  </div>
                  <p>{PILOT_CARD.specialAbility.text}</p>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="meter-card weapons-meter">
          <button
            className="panel-heading-toggle"
            type="button"
            aria-expanded={isWeaponsPanelExpanded}
            aria-label={`${isWeaponsPanelExpanded ? 'Hide' : 'Show'} equipped weapons`}
            onClick={() => setIsWeaponsPanelExpanded((current) => !current)}
          >
            <span className="meter-heading">
              <Swords size={20} />
              <span>Equipped Weapons</span>
            </span>
            {isWeaponsPanelExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {isWeaponsPanelExpanded && (
            <div className="weapon-slots">
              <WeaponSlot
                label="Melee"
                slot="melee"
                selectedWeapon={meleeWeapon}
                onChange={updateEquippedWeapon}
                onOpen={setSelectedWeaponDetails}
              />
              <WeaponSlot
                label="Ranged"
                slot="ranged"
                selectedWeapon={rangedWeapon}
                onChange={updateEquippedWeapon}
                onOpen={setSelectedWeaponDetails}
              />
            </div>
          )}
        </section>
      </section>

      <section className="meter-card heat-meter heat-row">
        <div className="heat-title-row">
          <div className="meter-heading">
            <Flame size={20} />
            <span>Heat</span>
          </div>
          <button
            className={`heat-state ${heatState.className}`}
            type="button"
            onClick={() => openHeatRules(heatState)}
            aria-label={`Show ${heatState.label} heat rules`}
          >
            {heatState.label}
          </button>
        </div>
        <div className="heat-control-row">
          <div className="heat-display">
            <div className="heat-track" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, index) => (
                <span
                  key={index}
                  className={`${index < heat ? 'active' : ''} ${index >= 5 ? 'redline' : index >= 3 ? 'hot' : 'steady'}`}
                />
              ))}
            </div>
            <div className="heat-bands" aria-label="Heat bands">
              {HEAT_STATES.map((state) => (
                <button key={state.className} type="button" onClick={() => openHeatRules(state)}>
                  {state.label} {state.range}
                </button>
              ))}
            </div>
          </div>
          <Stepper value={heat} min={0} max={8} onChange={setHeat} label="heat" />
        </div>
      </section>

      <div className="workspace">
        <section className="panel focus-panel">
          <div className="section-title">
            <Activity size={20} />
            <h2>Allocate Focus</h2>
          </div>
          <div className="focus-grid">
            {SYSTEMS.map(({ id, label, icon: Icon, accent, actions, damageMarkers }) => {
              const areActionsExpanded = Boolean(expandedSystems[id]);
              const isDamageExpanded = Boolean(expandedDamageTables[id]);
              const selectedDamage = Array.isArray(selectedDamageMarkers[id])
                ? selectedDamageMarkers[id]
                : selectedDamageMarkers[id]
                  ? [selectedDamageMarkers[id]]
                  : [];
              return (
                <article className={`system-card ${selectedDamage.length ? 'damaged' : ''}`} key={id} style={{ '--accent': accent }}>
                  <div className="system-header">
                    <div className="system-copy">
                      <Icon size={22} />
                      <span>{label}</span>
                      {selectedDamage.map((markerName) => {
                        const marker = damageMarkers.find((item) => item.name === markerName);
                        const severity = marker ? getDamageSeverity(marker) : 'warning';
                        return (
                          <button
                            className={`system-damage-badge ${severity}`}
                            key={markerName}
                            type="button"
                            onClick={() => showDamageMarker(id, markerName)}
                            aria-label={`Show ${label} damage marker ${markerName}`}
                          >
                            {severity === 'critical' ? <AlertTriangle size={14} /> : null}
                            {markerName}
                          </button>
                        );
                      })}
                    </div>
                    <div className="system-controls">
                      <Stepper
                        value={focus[id]}
                        max={focusPool}
                        onChange={(value) => updateFocus(id, value)}
                        label={`${label} focus`}
                      />
                    </div>
                  </div>

                  <div className="system-section">
                    <button
                      className="collapse-toggle section-toggle"
                      type="button"
                      aria-expanded={areActionsExpanded}
                      aria-label={`${areActionsExpanded ? 'Hide' : 'Show'} ${label} actions`}
                      onClick={() => toggleSystem(id)}
                    >
                      <span>Actions</span>
                      {areActionsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {areActionsExpanded && (
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
                    )}
                  </div>

                  <div className="damage-marker-section system-section">
                    <button
                      className="collapse-toggle section-toggle damage-control"
                      type="button"
                      aria-expanded={isDamageExpanded}
                      aria-label={`${isDamageExpanded ? 'Hide' : 'Show'} ${label} damage markers`}
                      onClick={() => toggleDamageTable(id)}
                    >
                      <span>Damage</span>
                      {isDamageExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {isDamageExpanded && (
                      <div className="data-table marker-table" aria-label={`${label} damage markers`}>
                        <div className="table-head">
                          <span>Roll</span>
                          <span>Name</span>
                          <span>Effect</span>
                        </div>
                        {damageMarkers.map((marker) => {
                          const isSelected = selectedDamage.includes(marker.name);
                          const severity = getDamageSeverity(marker);
                          return (
                            <button
                              className={`table-row marker-row ${severity} ${isSelected ? 'selected' : ''} ${
                                focusedDamageMarker?.systemId === id && focusedDamageMarker?.markerName === marker.name
                                  ? 'focused'
                                  : ''
                              }`}
                              key={marker.name}
                              type="button"
                              aria-pressed={isSelected}
                              data-system-id={id}
                              data-marker-name={marker.name}
                              onClick={() => toggleDamageMarker(id, marker.name)}
                            >
                              <span className="roll-pill">{marker.roll}</span>
                              <strong className="marker-name">
                                {severity === 'critical' ? <AlertTriangle size={16} /> : null}
                                {marker.name}
                              </strong>
                              <span>{marker.effect}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
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

      {isHeatModalOpen && (
        <div className="modal-backdrop" role="presentation" onClick={closeHeatRules}>
          <section
            className="rules-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="heat-rules-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Heat rules</p>
                <h2 id="heat-rules-title">{modalHeatState.label}</h2>
              </div>
              <button className="icon-action" type="button" onClick={closeHeatRules} aria-label="Close heat rules">
                <ChevronUp size={20} />
              </button>
            </div>
            <div className="modal-rule-list">
              {HEAT_RULES[modalHeatState.className].map((rule) => (
                <p key={rule}>{rule}</p>
              ))}
            </div>
          </section>
        </div>
      )}

      {selectedWeaponDetails && (
        <div className="modal-backdrop" role="presentation" onClick={closeWeaponDetails}>
          <section
            className="rules-modal weapon-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="weapon-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">{selectedWeaponDetails.slot} weapon</p>
                <h2 id="weapon-details-title">{selectedWeaponDetails.name}</h2>
              </div>
              <button className="icon-action" type="button" onClick={closeWeaponDetails} aria-label="Close weapon details">
                <ChevronUp size={20} />
              </button>
            </div>
            <div className="weapon-modal-body">
              <div className="weapon-stats modal-weapon-stats">
                <span>Attack Die {selectedWeaponDetails.attackDie}</span>
                <span>Dmg {selectedWeaponDetails.damage}</span>
                <span>
                  {selectedWeaponDetails.minRange}/{selectedWeaponDetails.maxRange}MD
                </span>
              </div>
              <div className="modal-rule-list">
                {selectedWeaponDetails.specialRules.length ? (
                  selectedWeaponDetails.specialRules.map((rule) => (
                    <div className="weapon-rule" key={rule.name}>
                      <strong>{rule.name}</strong>
                      <p>{rule.text}</p>
                    </div>
                  ))
                ) : (
                  <p>No special rules.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
