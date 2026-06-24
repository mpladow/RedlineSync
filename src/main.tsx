import type { MouseEvent } from 'react';
import { ChevronLeft, ChevronRight, Menu, Pencil, UserPlus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';
import './styles.css';

import { FocusAllocationDock } from './components/FocusAllocationDock';
import { FocusPanel } from './components/FocusPanel';
import { HandlerPanel } from './components/HandlerPanel';
import { HeatMeter } from './components/HeatMeter';
import { HeatRulesModal } from './components/HeatRulesModal';
import { PilotCard, PilotCardModal } from './components/PilotCard';
import { PilotForm } from './components/PilotForm';
import { WeaponDetailsModal } from './components/WeaponDetailsModal';
import { WeaponsPanel } from './components/WeaponsPanel';
import { DEFAULT_FOCUS, DEFAULT_FOCUS_POOL } from './constants/pilotCard';
import { SYSTEMS } from './constants/systems';
import { DEFAULT_EQUIPPED_WEAPONS, WEAPONS } from './constants/weapons';
import type {
  DamageSelectionMap,
  EquippedWeapons,
  ExpansionMap,
  FocusedDamageMarker,
  FocusMap,
  HandlerId,
  HeatState,
  PilotRecord,
  SavedState,
  SystemId,
  Weapon
} from './types';
import { getHeatState } from './utils/helpers';
import {
  loadPilots,
  persistPilots,
  persistPilotWorkspaceConfiguration,
  removePilotWorkspace
} from './utils/pilotStorage';

const GAME_PHASES = ['Cockpit Phase', 'Support Phase', 'Activation Phase', 'End Phase'];

function PilotRosterPage({ pilots }: { pilots: PilotRecord[] }) {
  return (
    <main className="app-shell home-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Pilot roster</p>
          <h1>Resonance Sync Z</h1>
        </div>
        <Link to="/pilots/new" className="primary-action page-header-action">
          <UserPlus size={18} />
          <span>Create Pilot</span>
        </Link>
      </header>

      {pilots.length === 0 ? (
        <section className="empty-roster" aria-label="No pilots created">
          <Link to="/pilots/new" className="roster-emblem empty-roster-create" aria-label="Create Pilot">
            +
          </Link>
          <div>
            <h2>No pilots yet</h2>
            <p>Create a pilot, configure their Mech, and they will appear here.</p>
          </div>
          <Link to="/pilots/new" className="primary-action">
            Create your first pilot
          </Link>
        </section>
      ) : (
        <section className="roster-list" aria-label="Created Mechs and Pilots">
          {pilots.map((pilot) => (
            <article key={pilot.id} className="roster-card">
              <Link to={`/sync/${pilot.id}`} className="roster-card-link" aria-label={`Open ${pilot.pilotName}`}>
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
              </Link>
              <Link to={`/pilots/${pilot.id}/edit`} className="icon-action roster-edit" aria-label={`Edit ${pilot.pilotName}`}>
                <Pencil size={18} />
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

function SyncWorkspacePage({ pilots }: { pilots: PilotRecord[] }) {
  const { pilotId } = useParams();
  const pilot = pilots.find((item) => item.id === pilotId);

  if (!pilot) {
    return <Navigate to="/" replace />;
  }

  return <SyncWorkspace pilot={pilot} />;
}

function SyncWorkspace({ pilot }: { pilot: PilotRecord }) {
  const [savedState, setSavedState] = useLocalStorage<SavedState>(`redline-sync-state:${pilot.id}`, {});
  const [isNavigationMenuOpen, setIsNavigationMenuOpen] = useState(false);

  const savedFocus = savedState.focus ?? {};
  const [focusPool, setFocusPool] = useState<number>(savedState.focusPool ?? pilot.focusPool ?? DEFAULT_FOCUS_POOL);
  const [focus, setFocus] = useState<FocusMap>({
    ...DEFAULT_FOCUS,
    ...savedFocus,
    mobility: savedFocus.mobility ?? savedFocus.movement ?? DEFAULT_FOCUS.mobility
  });
  const [cockpitFocus, setCockpitFocus] = useState<FocusMap>({
    ...DEFAULT_FOCUS,
    ...(savedState.cockpitFocus ?? savedFocus),
    mobility: savedState.cockpitFocus?.mobility ?? savedFocus.mobility ?? savedFocus.movement ?? DEFAULT_FOCUS.mobility
  });
  const [equippedWeapons, setEquippedWeapons] = useState<EquippedWeapons>({
    ...DEFAULT_EQUIPPED_WEAPONS,
    ...pilot.equippedWeapons,
    ...(savedState.equippedWeapons ?? {})
  });
  const [heat, setHeat] = useState<number>(savedState.heat ?? 3);
  const [handler, setHandler] = useState<HandlerId>(savedState.handler ?? pilot.handler);
  const [expandedCall, setExpandedCall] = useState(0);
  const [expandedSystems, setExpandedSystems] = useState<ExpansionMap>({ mobility: true });
  const [expandedDamageTables, setExpandedDamageTables] = useState<ExpansionMap>({});
  const [selectedDamageMarkers, setSelectedDamageMarkers] = useState<DamageSelectionMap>(savedState.selectedDamageMarkers ?? {});
  const [focusedDamageMarker, setFocusedDamageMarker] = useState<FocusedDamageMarker | null>(null);
  const [isHeatModalOpen, setIsHeatModalOpen] = useState(false);
  const [selectedHeatRules, setSelectedHeatRules] = useState<HeatState | null>(null);
  const [isWeaponsPanelExpanded, setIsWeaponsPanelExpanded] = useState(true);
  const [selectedWeaponDetails, setSelectedWeaponDetails] = useState<Weapon | null>(null);
  const [isPilotCardExpanded, setIsPilotCardExpanded] = useState(false);
  const [isFocusDockExpanded, setIsFocusDockExpanded] = useState(true);
  const [phaseIndex, setPhaseIndex] = useState(savedState.phaseIndex ?? 0);
  const [isPhaseConfirmOpen, setIsPhaseConfirmOpen] = useState(false);
  const [isFocusBlockModalOpen, setIsFocusBlockModalOpen] = useState(false);
  const [overcommittedSystemName, setOvercommittedSystemName] = useState<string | null>(null);
  const [showCockpitFocusAlert, setShowCockpitFocusAlert] = useState(phaseIndex === 0);
  const [isHandlerHighlighted, setIsHandlerHighlighted] = useState(false);
  const hasInitializedCockpitPhase = useRef(false);
  const previousPhaseIndex = useRef(phaseIndex);

  const spentFocus = useMemo(() => Object.values(focus).reduce((total, value) => total + value, 0), [focus]);
  const remainingFocus = focusPool - spentFocus;
  const unspentActivationFocus = useMemo(() => Object.values(focus).reduce((total, value) => total + value, 0), [focus]);
  const assignedActivationFocus = useMemo(() => Object.values(cockpitFocus).reduce((total, value) => total + value, 0), [cockpitFocus]);
  const spentActivationFocus = assignedActivationFocus + unspentActivationFocus;
  void spentActivationFocus;
  const heatState = getHeatState(heat);
  const modalHeatState = selectedHeatRules ?? heatState;
  const meleeWeapon = WEAPONS.find((weapon) => weapon.id === equippedWeapons.melee) ?? WEAPONS.find((weapon) => weapon.slot === 'melee')!;
  const rangedWeapon = WEAPONS.find((weapon) => weapon.id === equippedWeapons.ranged) ?? WEAPONS.find((weapon) => weapon.slot === 'ranged')!;
  const currentPhase = GAME_PHASES[phaseIndex] ?? GAME_PHASES[0];
  const nextPhase = GAME_PHASES[phaseIndex + 1];
  const previousPhase = GAME_PHASES[phaseIndex - 1];

  useEffect(() => {
    setSavedState({ focusPool, focus, cockpitFocus, equippedWeapons, heat, handler, phaseIndex, selectedDamageMarkers });
  }, [cockpitFocus, equippedWeapons, focus, focusPool, handler, heat, phaseIndex, selectedDamageMarkers, setSavedState]);

  const updateFocusPool = (value: number) => {
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

  const updateFocus = (systemId: SystemId, value: number) => {
    const current = focus[systemId];
    const projectedSpend = spentFocus - current + value;
    if (projectedSpend <= focusPool) {
      setFocus((next) => ({ ...next, [systemId]: value }));
    }
  };

  const toggleSystem = (systemId: SystemId) => {
    setExpandedSystems((current) => ({ ...current, [systemId]: !current[systemId] }));
    setExpandedDamageTables((current) => ({ ...current, [systemId]: false }));
  };

  const toggleDamageTable = (systemId: SystemId) => {
    setExpandedDamageTables((current) => ({ ...current, [systemId]: !current[systemId] }));
    setExpandedSystems((current) => ({ ...current, [systemId]: false }));
  };

  const toggleDamageMarker = (systemId: SystemId, markerName: string) => {
    setSelectedDamageMarkers((current) => {
      const currentMarkers = current[systemId] ?? [];
      const nextMarkers = currentMarkers.includes(markerName)
        ? currentMarkers.filter((name) => name !== markerName)
        : [...currentMarkers, markerName];

      return {
        ...current,
        [systemId]: nextMarkers
      };
    });
  };

  const showDamageMarker = (systemId: SystemId, markerName: string) => {
    setExpandedDamageTables((current) => ({ ...current, [systemId]: true }));
    setExpandedSystems((current) => ({ ...current, [systemId]: false }));
    setFocusedDamageMarker({ systemId, markerName });
  };

  const updateEquippedWeapon = (slot: keyof EquippedWeapons, weaponId: string) => {
    setEquippedWeapons((current) => ({ ...current, [slot]: weaponId }));
  };

  const openHeatRules = (state: HeatState = heatState) => {
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

  const scrollToFocusSystem = (systemId: SystemId) => {
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
            next[systemId as SystemId] = true;
          }
        });
        return next;
      });
      setExpandedDamageTables((current) => {
        const next = { ...current };
        Object.entries(focus).forEach(([systemId, value]) => {
          if (value > 0) {
            next[systemId as SystemId] = false;
          }
        });
        return next;
      });

      const frame = requestAnimationFrame(scrollToAllocateFocus);
      return () => cancelAnimationFrame(frame);
    }

    return undefined;
  }, [phaseIndex, focus]);

  useEffect(() => {
    if (!focusedDamageMarker) return;

    const selector = `[data-system-id="${focusedDamageMarker.systemId}"][data-marker-name="${CSS.escape(focusedDamageMarker.markerName)}"]`;
    const frame = requestAnimationFrame(() => {
      const row = document.querySelector<HTMLElement>(selector);
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
      if (current === 2) {
        return 0;
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
          pilot={pilot}
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
          onAdvancePhase={requestNextPhase}
          showCockpitAlert={showCockpitFocusAlert && phaseIndex === 0}
          focusAllocationComplete={remainingFocus === 0}
          showFocusAssignments={phaseIndex === 2}
          isCockpitPhase={phaseIndex === 0}
          isActivationPhase={phaseIndex === 2}
        />
        <HandlerPanel
          handler={handler}
          expandedCall={expandedCall}
          isHighlighted={isHandlerHighlighted}
          showSupportAlert={phaseIndex === 1}
          onAdvancePhase={requestNextPhase}
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
            onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
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
              {phaseIndex === 2 && unspentActivationFocus > 0 && (
                <div className="alert alert-warning">
                  <p>You have not spent all your focus yet. Have all opponents Passed their Turn?</p>
                </div>
              )}
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
            onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
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
            onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
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
        pilot={pilot}
        isOpen={isPilotCardExpanded}
        focusPool={focusPool}
        remainingFocus={remainingFocus}
        onFocusPoolChange={updateFocusPool}
        onClose={() => setIsPilotCardExpanded(false)}
      />
      <FocusAllocationDock
        focus={focus}
        remainingFocus={unspentActivationFocus}
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
            <Link to="/" role="menuitem" onClick={() => setIsNavigationMenuOpen(false)}>
              Back
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

function App() {
  const [pilots, setPilots] = useState<PilotRecord[]>(loadPilots);

  const savePilot = (pilot: PilotRecord) => {
    const nextPilots = pilots.some((item) => item.id === pilot.id)
      ? pilots.map((item) => (item.id === pilot.id ? pilot : item))
      : [...pilots, pilot];

    persistPilotWorkspaceConfiguration(pilot);
    persistPilots(nextPilots);
    setPilots(nextPilots);
  };

  const deletePilot = (pilotId: string) => {
    const nextPilots = pilots.filter((pilot) => pilot.id !== pilotId);
    persistPilots(nextPilots);
    removePilotWorkspace(pilotId);
    setPilots(nextPilots);
  };

  return (
    <Routes>
      <Route path="/" element={<PilotRosterPage pilots={pilots} />} />
      <Route path="/pilots/new" element={<PilotForm onSave={savePilot} />} />
      <Route
        path="/pilots/:pilotId/edit"
        element={<EditPilotRoute pilots={pilots} onSave={savePilot} onDelete={deletePilot} />}
      />
      <Route path="/sync/:pilotId" element={<SyncWorkspacePage pilots={pilots} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function EditPilotRoute({
  pilots,
  onSave,
  onDelete
}: {
  pilots: PilotRecord[];
  onSave: (pilot: PilotRecord) => void;
  onDelete: (pilotId: string) => void;
}) {
  const { pilotId } = useParams();
  const pilot = pilots.find((item) => item.id === pilotId);

  return pilot ? <PilotForm pilot={pilot} onSave={onSave} onDelete={onDelete} /> : <Navigate to="/" replace />;
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
