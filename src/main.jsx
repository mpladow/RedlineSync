import { ChevronLeft, ChevronRight, Menu, UserPlus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useLocalStorage } from './hooks/useLocalStorage';
import './styles.css';

import { FocusAllocationDock } from './components/FocusAllocationDock';
import { FocusPanel } from './components/FocusPanel';
import { HandlerPanel } from './components/HandlerPanel';
import { HeatMeter } from './components/HeatMeter';
import { HeatRulesModal } from './components/HeatRulesModal';
import { PilotCard, PilotCardModal } from './components/PilotCard';
import { WeaponDetailsModal } from './components/WeaponDetailsModal';
import { WeaponsPanel } from './components/WeaponsPanel';
import { DEFAULT_FOCUS, DEFAULT_FOCUS_POOL } from './constants/pilotCard';
import { SYSTEMS } from './constants/systems';
import { DEFAULT_EQUIPPED_WEAPONS, WEAPONS } from './constants/weapons';
import { getHeatState } from './utils/helpers';

const GAME_PHASES = ['Cockpit Phase', 'Support Phase', 'Activation Phase', 'End Phase'];

const PLACEHOLDER_PILOTS = [
  {
    id: 'rook-7',
    pilotName: 'Mara Voss',
    mechName: 'Rook-7',
    frame: 'Siege Frame',
    status: 'Ready'
  },
  {
    id: 'kestrel-nine',
    pilotName: 'Ilya Ren',
    mechName: 'Kestrel Nine',
    frame: 'Skirmish Frame',
    status: 'Draft'
  },
  {
    id: 'brazen-signal',
    pilotName: 'Tamsin Vale',
    mechName: 'Brazen Signal',
    frame: 'Support Frame',
    status: 'Ready'
  }
];

function App() {
  const [savedState, setSavedState] = useLocalStorage('redline-sync-state', {});
  const [activeScreen, setActiveScreen] = useState('home');
  const [isNavigationMenuOpen, setIsNavigationMenuOpen] = useState(false);

  const savedFocus = savedState.focus ?? {};
  const [focusPool, setFocusPool] = useState(savedState.focusPool ?? DEFAULT_FOCUS_POOL);
  const [focus, setFocus] = useState({
    ...DEFAULT_FOCUS,
    ...savedFocus,
    mobility: savedFocus.mobility ?? savedFocus.movement ?? DEFAULT_FOCUS.mobility
  });
  const [cockpitFocus, setCockpitFocus] = useState({
    ...DEFAULT_FOCUS,
    ...(savedState.cockpitFocus ?? savedFocus),
    mobility: savedState.cockpitFocus?.mobility ?? savedFocus.mobility ?? savedFocus.movement ?? DEFAULT_FOCUS.mobility
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
  const [isFocusDockExpanded, setIsFocusDockExpanded] = useState(true);
  const [phaseIndex, setPhaseIndex] = useState(savedState.phaseIndex ?? 0);
  const [isPhaseConfirmOpen, setIsPhaseConfirmOpen] = useState(false);
  const [isFocusBlockModalOpen, setIsFocusBlockModalOpen] = useState(false);
  const [overcommittedSystemName, setOvercommittedSystemName] = useState(null);
  const [showCockpitFocusAlert, setShowCockpitFocusAlert] = useState(phaseIndex === 0);
  const [isHandlerHighlighted, setIsHandlerHighlighted] = useState(false);
  const hasInitializedCockpitPhase = useRef(false);
  const previousPhaseIndex = useRef(phaseIndex);

  const spentFocus = useMemo(() => Object.values(focus).reduce((total, value) => total + value, 0), [focus]);
  const remainingFocus = focusPool - spentFocus;
  const heatState = getHeatState(heat);
  const modalHeatState = selectedHeatRules ?? heatState;
  const meleeWeapon = WEAPONS.find((weapon) => weapon.id === equippedWeapons.melee) ?? WEAPONS.find((weapon) => weapon.slot === 'melee');
  const rangedWeapon = WEAPONS.find((weapon) => weapon.id === equippedWeapons.ranged) ?? WEAPONS.find((weapon) => weapon.slot === 'ranged');
  const currentPhase = GAME_PHASES[phaseIndex] ?? GAME_PHASES[0];
  const nextPhase = GAME_PHASES[phaseIndex + 1];
  const previousPhase = GAME_PHASES[phaseIndex - 1];

  useEffect(() => {
    setSavedState({ focusPool, focus, cockpitFocus, equippedWeapons, heat, handler, phaseIndex, selectedDamageMarkers });
  }, [cockpitFocus, equippedWeapons, focus, focusPool, handler, heat, phaseIndex, selectedDamageMarkers, setSavedState]);

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
    setExpandedDamageTables((current) => ({ ...current, [systemId]: false }));
  };

  const toggleDamageTable = (systemId) => {
    setExpandedDamageTables((current) => ({ ...current, [systemId]: !current[systemId] }));
    setExpandedSystems((current) => ({ ...current, [systemId]: false }));
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
    setExpandedSystems((current) => ({ ...current, [systemId]: false }));
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

  const scrollToFocusSystem = (systemId) => {
    document.getElementById(`focus-system-${systemId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToAllocateFocus = () => {
    document.querySelector('.focus-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToHandler = () => {
    const handlerPanel = document.getElementById('handler-panel');
    handlerPanel?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    handlerPanel?.focus({ preventScroll: true });
  };

  const resetFocusForCockpit = () => {
    setFocus({ mobility: 0, weapons: 0, neural: 0, defence: 0, reactor: 0, sensors: 0 });
    setShowCockpitFocusAlert(true);
    requestAnimationFrame(scrollToAllocateFocus);
  };

  useEffect(() => {
    if (phaseIndex === 0 && !hasInitializedCockpitPhase.current) {
      hasInitializedCockpitPhase.current = true;
      resetFocusForCockpit();
    }
  }, [phaseIndex]);

  useEffect(() => {
    const didChangeToSupport = phaseIndex === 1 && previousPhaseIndex.current !== 1;
    const didChangeToActivation = phaseIndex === 2 && previousPhaseIndex.current !== 2;
    previousPhaseIndex.current = phaseIndex;

    if (didChangeToSupport) {
      setIsHandlerHighlighted(true);
      const frame = requestAnimationFrame(scrollToHandler);
      const timeout = window.setTimeout(() => setIsHandlerHighlighted(false), 1800);

      return () => {
        cancelAnimationFrame(frame);
        window.clearTimeout(timeout);
      };
    }

    if (didChangeToActivation) {
      setExpandedSystems((current) => {
        const next = { ...current };
        Object.entries(focus).forEach(([systemId, value]) => {
          if (value > 0) {
            next[systemId] = true;
          }
        });
        return next;
      });
      setExpandedDamageTables((current) => {
        const next = { ...current };
        Object.entries(focus).forEach(([systemId, value]) => {
          if (value > 0) {
            next[systemId] = false;
          }
        });
        return next;
      });
    }

    return undefined;
  }, [phaseIndex, focus]);

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

  const goToPreviousPhase = () => {
    setPhaseIndex((current) => {
      const nextIndex = Math.max(0, current - 1);
      if (nextIndex === 0 && current !== 0) {
        resetFocusForCockpit();
      }
      return nextIndex;
    });
  };

  const confirmNextPhase = () => {
    setPhaseIndex((current) => {
      if (current === 0) {
        setCockpitFocus(focus);
      }
      return Math.min(GAME_PHASES.length - 1, current + 1);
    });
    setShowCockpitFocusAlert(false);
    setIsPhaseConfirmOpen(false);
  };

  const requestNextPhase = () => {
    if (phaseIndex === 0 && remainingFocus > 0) {
      setIsFocusBlockModalOpen(true);
      setShowCockpitFocusAlert(true);
      requestAnimationFrame(scrollToAllocateFocus);
      return;
    }

    setIsPhaseConfirmOpen(true);
  };

  const openSyncWorkspace = () => {
    setActiveScreen('sync');
    setIsNavigationMenuOpen(false);
  };

  const returnHome = () => {
    setActiveScreen('home');
    setIsNavigationMenuOpen(false);
  };

  if (activeScreen === 'home') {
    return (
      <main className="app-shell home-shell">
        <header className="page-header">
          <div>
            <p className="eyebrow">Pilot roster</p>
            <h1>Resonance Sync Z</h1>
          </div>
          <button type="button" className="primary-action page-header-action" onClick={() => setActiveScreen('create-pilot')}>
            <UserPlus size={18} />
            <span>Create Pilot</span>
          </button>
        </header>

        <section className="roster-list" aria-label="Created Mechs and Pilots">
          {PLACEHOLDER_PILOTS.map((pilot) => (
            <button key={pilot.id} type="button" className="roster-card" onClick={openSyncWorkspace}>
              <div className="roster-emblem" aria-hidden="true">
                {pilot.mechName.slice(0, 1)}
              </div>
              <div className="roster-card-main">
                <div>
                  <span>{pilot.pilotName}</span>
                  <strong>{pilot.mechName}</strong>
                </div>
                <p>{pilot.frame}</p>
              </div>
              <span className={`roster-status ${pilot.status.toLowerCase()}`}>{pilot.status}</span>
            </button>
          ))}
        </section>
      </main>
    );
  }

  if (activeScreen === 'create-pilot') {
    return (
      <main className="app-shell home-shell">
        <header className="page-header">
          <div>
            <p className="eyebrow">New record</p>
            <h1>Create Pilot</h1>
          </div>
          <button type="button" className="secondary-action page-header-action" onClick={returnHome}>
            <ChevronLeft size={18} />
            <span>Back</span>
          </button>
        </header>

        <section className="placeholder-panel" aria-label="Create Pilot placeholder">
          <p>Create Pilot content placeholder</p>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <section className="phase-tracker" aria-label="Current game phase">
          {previousPhase && (
            <button
              className="phase-nav previous"
              type="button"
              onClick={goToPreviousPhase}
              aria-label={`Go back to ${previousPhase}`}
            >
              <ChevronLeft size={20} />
              <span>{previousPhase}</span>
            </button>
          )}
          <div className="phase-current">
            <p className="eyebrow">Current Phase</p>
            <h1>{currentPhase}</h1>
          </div>
          <button
            className="phase-nav next"
            type="button"
            onClick={requestNextPhase}
            disabled={!nextPhase}
            aria-label={nextPhase ? `Advance to ${nextPhase}` : 'No next phase'}
          >
            <span>{nextPhase ?? 'No next phase'}</span>
            <ChevronRight size={20} />
          </button>
        </section>
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
          cockpitFocus={cockpitFocus}
          expandedSystems={expandedSystems}
          expandedDamageTables={expandedDamageTables}
          selectedDamageMarkers={selectedDamageMarkers}
          focusedDamageMarker={focusedDamageMarker}
          onFocusChange={updateFocus}
          onToggleSystem={toggleSystem}
          onToggleDamageTable={toggleDamageTable}
          onToggleDamageMarker={toggleDamageMarker}
          onShowDamageMarker={showDamageMarker}
          onShowOvercommittedWarning={setOvercommittedSystemName}
          showCockpitAlert={showCockpitFocusAlert && phaseIndex === 0}
          focusAllocationComplete={remainingFocus === 0}
          showFocusAssignments={phaseIndex === 2}
          isActivationPhase={phaseIndex === 2}
        />
        <HandlerPanel
          handler={handler}
          expandedCall={expandedCall}
          isHighlighted={isHandlerHighlighted}
          showSupportAlert={phaseIndex === 1}
          onChangeHandler={(id) => {
            setHandler(id);
            setExpandedCall(0);
          }}
          onToggleCall={setExpandedCall}
        />
      </div>

      {isPhaseConfirmOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsPhaseConfirmOpen(false)}>
          <section
            className="rules-modal phase-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="phase-confirm-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Advance phase</p>
                <h2 id="phase-confirm-title">Move to {nextPhase}?</h2>
              </div>
            </div>
            <div className="phase-confirm-body">
              <p>
                This will move the game from {currentPhase} to {nextPhase}.
              </p>
              {phaseIndex === 3 && remainingFocus > 0 && (
                <div className="alert alert-warning">
                  <p>You have not spent all your focus yet. Have all opponents Passed their Turn?</p>
                </div>
              )}
              <div className="phase-confirm-actions">
                <button type="button" className="secondary-action" onClick={() => setIsPhaseConfirmOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="primary-action" onClick={confirmNextPhase}>
                  Confirm
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {isFocusBlockModalOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsFocusBlockModalOpen(false)}>
          <section
            className="rules-modal phase-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="focus-block-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Focus required</p>
                <h2 id="focus-block-title">Allocate your remaining Focus</h2>
              </div>
            </div>
            <div className="phase-confirm-body">
              <p>You need to allocate your remaining Focus points before proceeding to the next phase.</p>
              <div className="phase-confirm-actions">
                <button type="button" className="primary-action" onClick={() => setIsFocusBlockModalOpen(false)}>
                  Review Focus
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {overcommittedSystemName && (
        <div className="modal-backdrop" role="presentation" onClick={() => setOvercommittedSystemName(null)}>
          <section
            className="rules-modal phase-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="overcommitted-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">{overcommittedSystemName}</p>
                <h2 id="overcommitted-title">Overcommitted</h2>
              </div>
            </div>
            <div className="phase-confirm-body">
              <p>Add +1 Heat at the end of the Cockpit Phase.</p>
              <div className="phase-confirm-actions">
                <button type="button" className="primary-action" onClick={() => setOvercommittedSystemName(null)}>
                  Got it
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      <HeatRulesModal isOpen={isHeatModalOpen} heatState={modalHeatState} onClose={closeHeatRules} />
      <WeaponDetailsModal weapon={selectedWeaponDetails} onClose={closeWeaponDetails} />
      <PilotCardModal
        isOpen={isPilotCardExpanded}
        focusPool={focusPool}
        remainingFocus={remainingFocus}
        onFocusPoolChange={updateFocusPool}
        onClose={() => setIsPilotCardExpanded(false)}
      />
      <FocusAllocationDock
        focus={focus}
        remainingFocus={remainingFocus}
        isExpanded={isFocusDockExpanded}
        onToggleExpanded={() => setIsFocusDockExpanded((current) => !current)}
        onSelectSystem={(systemId) => {
          toggleSystem(systemId);
          scrollToFocusSystem(systemId);
        }}
        expandedSystems={expandedSystems}
        expandedDamageTables={expandedDamageTables}
      />
      <div className="dock-menu">
        <button
          className="dock-menu-button"
          type="button"
          aria-haspopup="menu"
          aria-expanded={isNavigationMenuOpen}
          aria-label="Open navigation menu"
          onClick={() => setIsNavigationMenuOpen((current) => !current)}
        >
          <Menu size={20} />
        </button>
        {isNavigationMenuOpen && (
          <div className="dock-menu-popup" role="menu">
            <button type="button" role="menuitem" onClick={returnHome}>
              Back
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
