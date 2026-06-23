import { RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import { SYSTEMS } from './constants/systems';
import { WEAPONS, DEFAULT_EQUIPPED_WEAPONS } from './constants/weapons';
import { DEFAULT_FOCUS } from './constants/pilotCard';
import { getHeatState } from './utils/helpers';
import { PilotCard } from './components/PilotCard';
import { WeaponsPanel } from './components/WeaponsPanel';
import { HeatMeter } from './components/HeatMeter';
import { FocusPanel } from './components/FocusPanel';
import { HandlerPanel } from './components/HandlerPanel';
import { HeatRulesModal } from './components/HeatRulesModal';
import { WeaponDetailsModal } from './components/WeaponDetailsModal';

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
        <PilotCard
          focusPool={focusPool}
          remainingFocus={remainingFocus}
          isExpanded={isPilotCardExpanded}
          onToggleExpand={() => setIsPilotCardExpanded((current) => !current)}
          onFocusPoolChange={updateFocusPool}
        />
        <WeaponsPanel
          meleeWeapon={meleeWeapon}
          rangedWeapon={rangedWeapon}
          onWeaponChange={updateEquippedWeapon}
          onOpenWeaponDetails={setSelectedWeaponDetails}
          isExpanded={isWeaponsPanelExpanded}
          onToggleExpand={() => setIsWeaponsPanelExpanded((current) => !current)}
        />
      </section>

      <HeatMeter heat={heat} heatState={heatState} onHeatChange={setHeat} onOpenHeatRules={openHeatRules} />

      <div className="workspace">
        <FocusPanel
          focus={focus}
          focusPool={focusPool}
          expandedSystems={expandedSystems}
          expandedDamageTables={expandedDamageTables}
          selectedDamageMarkers={selectedDamageMarkers}
          focusedDamageMarker={focusedDamageMarker}
          onFocusChange={updateFocus}
          onToggleSystem={toggleSystem}
          onToggleDamageTable={toggleDamageTable}
          onToggleDamageMarker={toggleDamageMarker}
          onShowDamageMarker={showDamageMarker}
        />
        <HandlerPanel
          handler={handler}
          expandedCall={expandedCall}
          onChangeHandler={(id) => {
            setHandler(id);
            setExpandedCall(0);
          }}
          onToggleCall={setExpandedCall}
        />
      </div>

      <HeatRulesModal isOpen={isHeatModalOpen} heatState={modalHeatState} onClose={closeHeatRules} />
      <WeaponDetailsModal weapon={selectedWeaponDetails} onClose={closeWeaponDetails} />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
