import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Info, Menu, Pencil, UserPlus } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';
import './styles.css';

import { FocusAllocationDock } from './components/FocusAllocationDock';
import { FocusPanel } from './components/FocusPanel';
import { HandlerPhase } from './components/HandlerPhase';
import { HeatMeter } from './components/HeatMeter';
import { HeatRulesModal } from './components/HeatRulesModal';
import { PhaseIntelPanel } from './components/PhaseIntelPanel';
import { PilotCard, PilotCardModal } from './components/PilotCard';
import { PilotForm } from './components/PilotForm';
import { WeaponDetailsModal } from './components/WeaponDetailsModal';
import { WeaponsPanel } from './components/WeaponsPanel';
import {
	DEFAULT_EQUIPPED_WEAPONS,
	DEFAULT_FOCUS,
	DEFAULT_FOCUS_POOL,
	GAME_PHASES,
	getHandlerDeployableAsset,
	getHandlerDirectives,
	HANDLERS,
	SYSTEMS,
	WEAPONS
} from './data/reference';
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
	StructureMap,
	SystemId,
	Weapon
} from './types';
import { clamp, getHeatState } from './utils/helpers';
import {
	loadPilots,
	loadPilotWorkspaceState,
	persistPilots,
	persistPilotWorkspaceConfiguration,
	removePilotWorkspace,
	resetPilotGameState
} from './utils/pilotStorage';

function hasAssignedFocus(savedState: SavedState) {
  const focusValues = Object.values(savedState.focus ?? {});
  const cockpitFocusValues = Object.values(savedState.cockpitFocus ?? {});

  return [...focusValues, ...cockpitFocusValues].some((value) => typeof value === 'number' && value > 0);
}

function getPilotGameStatus(pilotId: string) {
  const savedState = loadPilotWorkspaceState(pilotId);
  const round = savedState.round ?? 1;
  const hasDirective = savedState.directiveRoll != null;
  const isInGame =
    savedState.hasSelectedHandler === true ||
    round !== 1 ||
    hasDirective ||
    ((savedState.phaseIndex ?? 0) > 0 && hasAssignedFocus(savedState));

  return {
    isInGame,
    round,
    savedState
  };
}

function PilotRosterPage({ pilots }: { pilots: PilotRecord[] }) {
  const navigate = useNavigate();
  const [selectedPilot, setSelectedPilot] = useState<PilotRecord | null>(null);
  const [workspaceVersion, setWorkspaceVersion] = useState(0);

  const pilotGameStatuses = useMemo(
    () => new Map(pilots.map((pilot) => [pilot.id, getPilotGameStatus(pilot.id)])),
    [pilots, workspaceVersion]
  );

  const openPilot = (pilot: PilotRecord) => {
    const gameStatus = pilotGameStatuses.get(pilot.id) ?? getPilotGameStatus(pilot.id);

    if (gameStatus.isInGame) {
      setSelectedPilot(pilot);
      return;
    }

    navigate(`/sync/${pilot.id}`);
  };

  const continueGame = () => {
    if (!selectedPilot) return;

    navigate(`/sync/${selectedPilot.id}`);
  };

  const startNewGame = () => {
    if (!selectedPilot) return;

    resetPilotGameState(selectedPilot);
    setWorkspaceVersion((current) => current + 1);
    navigate(`/sync/${selectedPilot.id}`);
  };

  const selectedPilotStatus = selectedPilot ? pilotGameStatuses.get(selectedPilot.id) : null;

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
          {pilots.map((pilot) => {
            const gameStatus = pilotGameStatuses.get(pilot.id) ?? getPilotGameStatus(pilot.id);
            const statusLabel = gameStatus.isInGame ? `In Game - Round ${gameStatus.round}` : pilot.status;
            const statusClassName = gameStatus.isInGame ? 'in-game' : pilot.status.toLowerCase();

            return (
              <article key={pilot.id} className="roster-card">
              <button type="button" className="roster-card-link" aria-label={`Open ${pilot.pilotName}`} onClick={() => openPilot(pilot)}>
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
                <span className={`roster-status ${statusClassName}`}>{statusLabel}</span>
              </button>
              <Link to={`/pilots/${pilot.id}/edit`} className="icon-action roster-edit" aria-label={`Edit ${pilot.pilotName}`}>
                <Pencil size={18} />
              </Link>
            </article>
            );
          })}
        </section>
      )}
      {selectedPilot && selectedPilotStatus?.isInGame && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedPilot(null)}>
          <section
            className="rules-modal phase-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-choice-title"
            onClick={(event: MouseEvent<HTMLElement>) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">In Game - Round {selectedPilotStatus.round}</p>
                <h2 id="game-choice-title">{selectedPilot.mechName}</h2>
              </div>
            </div>
            <div className="phase-confirm-body">
              <p>Continue the current game from the most recently reached phase, or reset this pilot to start over.</p>
              <div className="phase-confirm-actions">
                <button type="button" className="secondary-action" onClick={startNewGame}>
                  Start a New Game
                </button>
                <button type="button" className="primary-action" onClick={continueGame}>
                  Continue Game
                </button>
              </div>
            </div>
          </section>
        </div>
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
  const [structure, setStructure] = useState<StructureMap>({
    ...pilot.structure,
    ...(savedState.structure ?? {})
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
  const [isFrameInfoOpen, setIsFrameInfoOpen] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(savedState.phaseIndex ?? 0);
  const [round, setRound] = useState(savedState.round ?? 1);
  const [directiveRoll, setDirectiveRoll] = useState<number | null>(savedState.directiveRoll ?? null);
  const [isDirectiveRevealed, setIsDirectiveRevealed] = useState(savedState.isDirectiveRevealed ?? false);
  const [hasSelectedHandler, setHasSelectedHandler] = useState(
    savedState.hasSelectedHandler ??
      ((savedState.round ?? 1) !== 1 || savedState.directiveRoll != null || (savedState.phaseIndex ?? 0) > 0)
  );
  const [isDeployableAssetDeployed, setIsDeployableAssetDeployed] = useState(
    savedState.isDeployableAssetDeployed ?? false
  );
  const [isPhaseConfirmOpen, setIsPhaseConfirmOpen] = useState(false);
  const [isFocusBlockModalOpen, setIsFocusBlockModalOpen] = useState(false);
  const [overcommittedSystemName, setOvercommittedSystemName] = useState<string | null>(null);
  const [showCockpitFocusAlert, setShowCockpitFocusAlert] = useState(phaseIndex === 1);
  const [isHandlerHighlighted, setIsHandlerHighlighted] = useState(false);
  const hasInitializedCockpitPhase = useRef(phaseIndex === 1);
  const isFrameInfoOpenRef = useRef(isFrameInfoOpen);
  const previousPhaseIndex = useRef(phaseIndex);

  const spentFocus = useMemo(() => Object.values(focus).reduce((total, value) => total + value, 0), [focus]);
  const remainingFocus = focusPool - spentFocus;
  const unspentActivationFocus = useMemo(() => Object.values(focus).reduce((total, value) => total + value, 0), [focus]);
  const focusDockCount = phaseIndex === 1 ? remainingFocus : unspentActivationFocus;
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
  const isEndPhase = phaseIndex === GAME_PHASES.length - 1;
  const nextPhaseLabel = isEndPhase ? 'Next Round' : (nextPhase ?? 'No next phase');
  const readOnlyExpandedSystems = useMemo(
    () => Object.fromEntries(SYSTEMS.map((system) => [system.id, true])) as ExpansionMap,
    []
  );

  useEffect(() => {
    setSavedState({
      focusPool,
      focus,
      cockpitFocus,
      structure,
      equippedWeapons,
      heat,
      handler,
      hasSelectedHandler,
      phaseIndex,
      round,
      directiveRoll,
      isDirectiveRevealed,
      isDeployableAssetDeployed,
      selectedDamageMarkers
    });
  }, [
    cockpitFocus,
    equippedWeapons,
    focus,
    focusPool,
    handler,
    hasSelectedHandler,
    heat,
    directiveRoll,
    isDirectiveRevealed,
    isDeployableAssetDeployed,
    phaseIndex,
    round,
    selectedDamageMarkers,
    setSavedState,
    structure
  ]);

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

  const updateStructure = (systemId: SystemId, value: number) => {
    setStructure((current) => ({
      ...current,
      [systemId]: clamp(value, 0, pilot.structure[systemId])
    }));
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

  const openFrameInfo = () => {
    setPhaseIndex(0);
    setIsFrameInfoOpen(true);

    if (window.location.hash !== '#frame-info') {
      window.history.pushState({ redlineSyncView: 'frame-info' }, '', `${window.location.pathname}${window.location.search}#frame-info`);
    }
  };

  const closeFrameInfo = () => {
    setPhaseIndex(0);
    setIsFrameInfoOpen(false);

    if (window.location.hash === '#frame-info') {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
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
    if (phaseIndex === 1 && !hasInitializedCockpitPhase.current) {
      hasInitializedCockpitPhase.current = true;
      resetFocusForCockpit();
    }
  }, [phaseIndex]);

  useEffect(() => {
    const didChangeToSupport = phaseIndex === 2 && previousPhaseIndex.current !== 2;
    const didChangeToActivation = phaseIndex === 3 && previousPhaseIndex.current !== 3;
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

  useEffect(() => {
    isFrameInfoOpenRef.current = isFrameInfoOpen;
  }, [isFrameInfoOpen]);

  useEffect(() => {
    const syncFrameInfoWithHistory = () => {
      if (window.location.hash === '#frame-info') {
        setPhaseIndex(0);
        setIsFrameInfoOpen(true);
        return;
      }

      if (isFrameInfoOpenRef.current) {
        setIsFrameInfoOpen(false);
        setPhaseIndex(0);
      }
    };

    syncFrameInfoWithHistory();
    window.addEventListener('popstate', syncFrameInfoWithHistory);
    return () => window.removeEventListener('popstate', syncFrameInfoWithHistory);
  }, []);

  const goToPreviousPhase = () => {
    setIsFrameInfoOpen(false);
    setPhaseIndex((current) => Math.max(0, current - 1));
  };

  const confirmNextPhase = () => {
    const shouldStartNextRound = phaseIndex === GAME_PHASES.length - 1;

    setIsFrameInfoOpen(false);
    setPhaseIndex((current) => {
      if (current === 1) {
        setCockpitFocus(focus);
      }
      if (current === GAME_PHASES.length - 1) {
        setDirectiveRoll(null);
        setIsDirectiveRevealed(false);
        setIsDeployableAssetDeployed(false);
        hasInitializedCockpitPhase.current = false;
        return 0;
      }
      return Math.min(GAME_PHASES.length - 1, current + 1);
    });
    if (shouldStartNextRound) {
      setRound((currentRound) => currentRound + 1);
    }
    setShowCockpitFocusAlert(false);
    setIsPhaseConfirmOpen(false);
  };

  const requestNextPhase = () => {
    if (phaseIndex === 1 && remainingFocus > 0) {
      setIsFocusBlockModalOpen(true);
      setShowCockpitFocusAlert(true);
      requestAnimationFrame(scrollToAllocateFocus);
      return;
    }

    if (phaseIndex === 2) {
      confirmNextPhase();
      return;
    }

    setIsPhaseConfirmOpen(true);
  };

  const confirmHandlerSelection = () => {
    setHasSelectedHandler(true);
    setPhaseIndex(0);
    setRound(1);
    setDirectiveRoll(null);
    setIsDirectiveRevealed(false);
    setIsDeployableAssetDeployed(false);
  };

  return (
    <main className="app-shell">
      {!isFrameInfoOpen && hasSelectedHandler && (
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
            <p className="eyebrow">Round {round}</p>
            <h1>{currentPhase}</h1>
          </div>
          <button
            className="phase-nav next"
            type="button"
            onClick={requestNextPhase}
            disabled={!nextPhase && !isEndPhase}
            aria-label={isEndPhase ? `Start Round ${round + 1}` : nextPhase ? `Advance to ${nextPhase}` : 'No next phase'}
          >
            <span>{nextPhaseLabel}</span>
            <ChevronRight size={20} />
          </button>
        </section>
        </header>
      )}

      {!hasSelectedHandler ? (
        <HandlerSelectionView
          selectedHandler={handler}
          onSelectHandler={(id) => {
            setHandler(id);
            setDirectiveRoll(null);
            setIsDirectiveRevealed(false);
            setIsDeployableAssetDeployed(false);
          }}
          onConfirm={confirmHandlerSelection}
        />
      ) : isFrameInfoOpen ? (
        <FrameInfoView
          pilot={pilot}
          focus={focus}
          focusPool={focusPool}
          cockpitFocus={cockpitFocus}
          structure={structure}
          meleeWeapon={meleeWeapon}
          rangedWeapon={rangedWeapon}
          selectedDamageMarkers={selectedDamageMarkers}
          expandedSystems={readOnlyExpandedSystems}
          onBackToHandler={closeFrameInfo}
        />
      ) : phaseIndex === 0 ? (
        <HandlerPhase
          handler={handler}
          directiveRoll={directiveRoll}
          isDirectiveRevealed={isDirectiveRevealed}
          isAssetDeployed={isDeployableAssetDeployed}
          onDirectiveGenerated={setDirectiveRoll}
          onDirectiveVisibilityChange={setIsDirectiveRevealed}
          onToggleAssetDeployed={() => setIsDeployableAssetDeployed((current) => !current)}
        />
      ) : phaseIndex === 2 ? (
        <section className="support-offline-panel" aria-label="Support offline">
          <div className="support-offline-signal" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <p className="eyebrow">Handler uplink interrupted</p>
            <h2>Support Offline</h2>
            <p>Remote support channels are dark. Proceed to direct activation.</p>
          </div>
          <button type="button" className="primary-action support-offline-action" onClick={requestNextPhase}>
            Continue to Activation Phase
          </button>
        </section>
      ) : (
        <>
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
              frameName={pilot.frame}
              structure={structure}
              maximumStructure={pilot.structure}
              focus={focus}
              focusPool={focusPool}
              cockpitFocus={cockpitFocus}
              expandedSystems={expandedSystems}
              expandedDamageTables={expandedDamageTables}
              selectedDamageMarkers={selectedDamageMarkers}
              focusedDamageMarker={focusedDamageMarker}
              onFocusChange={updateFocus}
              onStructureChange={updateStructure}
              onToggleSystem={toggleSystem}
              onToggleDamageTable={toggleDamageTable}
              onToggleDamageMarker={toggleDamageMarker}
              onShowDamageMarker={showDamageMarker}
              onShowOvercommittedWarning={setOvercommittedSystemName}
              onAdvancePhase={requestNextPhase}
              showCockpitAlert={showCockpitFocusAlert && phaseIndex === 1}
              focusAllocationComplete={remainingFocus === 0}
              showFocusAssignments={phaseIndex === 3}
              isCockpitPhase={phaseIndex === 1}
              isActivationPhase={phaseIndex === 3}
            />
            {phaseIndex !== 3 && (
              <>
              {/*
                    The {handler} Handler’s deployable asset has not been added yet.
              */}
              {/* <HandlerPanel
                handler={handler}
                expandedCall={expandedCall}
                isHighlighted={isHandlerHighlighted}
                showSupportAlert={phaseIndex === 2}
                onAdvancePhase={requestNextPhase}
                onToggleCall={setExpandedCall}
              /> */}
              </>
            )}
          </div>
          {[1, 2, 3].includes(phaseIndex) && (
            <PhaseIntelPanel
              handler={handler}
              directiveRoll={directiveRoll}
              isDirectiveRevealed={isDirectiveRevealed}
              isAssetDeployed={isDeployableAssetDeployed}
              onDirectiveVisibilityChange={setIsDirectiveRevealed}
              onToggleAssetDeployed={() => setIsDeployableAssetDeployed((current) => !current)}
            />
          )}
        </>
      )}

      {!isFrameInfoOpen && hasSelectedHandler && isPhaseConfirmOpen && (
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
                <p className="eyebrow">{isEndPhase ? 'Advance round' : 'Advance phase'}</p>
                <h2 id="phase-confirm-title">
                  {isEndPhase ? `Start Round ${round + 1}?` : `Move to ${nextPhase}?`}
                </h2>
              </div>
            </div>
            <div className="phase-confirm-body">
              <p>
                {isEndPhase
                  ? `This will end Round ${round} and return the game to the Handler Phase for Round ${round + 1}.`
                  : `This will move the game from ${currentPhase} to ${nextPhase}.`}
              </p>
              {phaseIndex === 3 && unspentActivationFocus > 0 && (
                <div className="alert alert-warning">
                  <p>You have not spent all your focus yet. Have all opponents Passed their Turn?</p>
                </div>
              )}
              {phaseIndex === 4 && remainingFocus > 0 && (
                <div className="alert alert-warning">
                  <p>You have not spent all your focus yet. Have all opponents Passed their Turn?</p>
                </div>
              )}
              <div className="phase-confirm-actions">
                <button type="button" className="secondary-action" onClick={() => setIsPhaseConfirmOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="primary-action" onClick={confirmNextPhase}>
                  {isEndPhase ? `Start Round ${round + 1}` : 'Confirm'}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {!isFrameInfoOpen && hasSelectedHandler && isFocusBlockModalOpen && (
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

      {!isFrameInfoOpen && hasSelectedHandler && overcommittedSystemName && (
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

      {!isFrameInfoOpen && hasSelectedHandler && (
        <>
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
        </>
      )}
      {!isFrameInfoOpen && hasSelectedHandler && phaseIndex === 0 && (
        <button className="frame-info-dock-button" type="button" onClick={openFrameInfo}>
          <Info size={18} />
          <span>Frame / Mech Info</span>
        </button>
      )}
      {!isFrameInfoOpen && hasSelectedHandler && phaseIndex !== 0 && phaseIndex !== 2 && (
        <FocusAllocationDock
          focus={focus}
          focusCount={focusDockCount}
          isExpanded={isFocusDockExpanded}
          onToggleExpanded={() => setIsFocusDockExpanded((current) => !current)}
          onSelectSystem={(systemId) => {
            toggleSystem(systemId);
            scrollToFocusSystem(systemId);
          }}
          expandedSystems={expandedSystems}
          expandedDamageTables={expandedDamageTables}
        />
      )}
      {!isFrameInfoOpen && (
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
      )}
    </main>
  );
}

function HandlerSelectionView({
  selectedHandler,
  onSelectHandler,
  onConfirm
}: {
  selectedHandler: HandlerId;
  onSelectHandler: (handler: HandlerId) => void;
  onConfirm: () => void;
}) {
  const selectedHandlerLabel = HANDLERS.find((handler) => handler.id === selectedHandler)?.label ?? 'Selected';

  return (
    <section className="handler-selection-view" aria-labelledby="handler-selection-title">
      <header className="handler-selection-header">
        <div>
          <p className="eyebrow">Before Round 1</p>
          <h1 id="handler-selection-title">Select Handler</h1>
          <p>Choose the handler channel this pilot will use during the Handler Phase.</p>
        </div>
        <div className="handler-selection-actions">
          <Link className="secondary-action" to="/">
            Back
          </Link>
          <button type="button" className="primary-action" onClick={onConfirm}>
            <CheckCircle2 size={18} />
            <span>Confirm {selectedHandlerLabel}</span>
          </button>
        </div>
      </header>

      <div className="handler-option-grid">
        {HANDLERS.map((handler) => {
          const directives = getHandlerDirectives(handler.id);
          const deployableAsset = getHandlerDeployableAsset(handler.id);
          const isSelected = handler.id === selectedHandler;

          return (
            <article key={handler.id} className={`handler-option ${isSelected ? 'selected' : ''}`}>
              <button
                type="button"
                className="handler-option-select"
                aria-pressed={isSelected}
                onClick={() => onSelectHandler(handler.id)}
              >
                <span>
                  <small>{handler.asset}</small>
                  <strong>{handler.label} Handler</strong>
                </span>
                {isSelected && <CheckCircle2 size={20} aria-hidden="true" />}
              </button>

              <div className="handler-option-summary">
                <p>{handler.description ?? handler.role}</p>
                {handler.directiveNotes && <p>{handler.directiveNotes}</p>}
              </div>

              <section className="handler-reference-block" aria-label={`${handler.label} directives`}>
                <div className="handler-reference-heading">
                  <p className="eyebrow">Directive Table</p>
                  <strong>{directives.length > 0 ? `d10 - ${directives.length} entries` : 'Pending'}</strong>
                </div>
                {directives.length > 0 ? (
                  <div className="handler-directive-list">
                    {directives.map((directive) => (
                      <article key={directive.roll} className="handler-directive-row">
                        <span className="handler-directive-roll">d10 {directive.roll}</span>
                        <div>
                          <strong>{directive.name}</strong>
                          <small>{directive.timing}</small>
                          <p>{directive.effect}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="handler-reference-empty">Directive reference data has not been added yet.</p>
                )}
              </section>

              <section className="handler-reference-block" aria-label={`${handler.label} deployable asset`}>
                <div className="handler-reference-heading">
                  <p className="eyebrow">Deployable Asset</p>
                  <strong>{deployableAsset?.name ?? handler.asset}</strong>
                </div>
                {deployableAsset ? (
                  <div className="handler-asset-reference">
                    <div className="deployable-asset-meta">
                      <span><small>Deployment</small>{deployableAsset.deployment}</span>
                      <span><small>Cost</small>{deployableAsset.cost}</span>
                      <span><small>Type</small>{deployableAsset.type}</span>
                    </div>
                    <p className="deployable-asset-effect">{deployableAsset.effect}</p>
                    <dl className="deployable-asset-stats">
                      {deployableAsset.stats.map((stat) => (
                        <div key={stat.label}>
                          <dt>{stat.label}</dt>
                          <dd>{stat.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : (
                  <p className="handler-reference-empty">Deployable asset stats and rules have not been added yet.</p>
                )}
              </section>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function FrameInfoView({
  pilot,
  focus,
  focusPool,
  cockpitFocus,
  structure,
  meleeWeapon,
  rangedWeapon,
  selectedDamageMarkers,
  expandedSystems,
  onBackToHandler
}: {
  pilot: PilotRecord;
  focus: FocusMap;
  focusPool: number;
  cockpitFocus: FocusMap;
  structure: StructureMap;
  meleeWeapon: Weapon;
  rangedWeapon: Weapon;
  selectedDamageMarkers: DamageSelectionMap;
  expandedSystems: ExpansionMap;
  onBackToHandler: () => void;
}) {
  const [readOnlyExpandedSystems, setReadOnlyExpandedSystems] = useState<ExpansionMap>(expandedSystems);
  const [readOnlyExpandedDamageTables, setReadOnlyExpandedDamageTables] = useState<ExpansionMap>({});

  const showReadOnlyActions = (systemId: SystemId) => {
    setReadOnlyExpandedSystems((current) => ({ ...current, [systemId]: true }));
    setReadOnlyExpandedDamageTables((current) => ({ ...current, [systemId]: false }));
  };

  const showReadOnlyDamage = (systemId: SystemId) => {
    setReadOnlyExpandedSystems((current) => ({ ...current, [systemId]: false }));
    setReadOnlyExpandedDamageTables((current) => ({ ...current, [systemId]: true }));
  };

  return (
    <section className="frame-info-view" aria-label="Read only Frame and Mech information">
      <header className="frame-info-header">
        <div>
          <p className="eyebrow">Read Only Frame Intel</p>
          <h1>
            {pilot.frame} &quot;{pilot.mechName}&quot;
          </h1>
        </div>
        <button className="primary-action frame-info-back" type="button" onClick={onBackToHandler}>
          <ArrowLeft size={18} />
          <span>Back to Handler Phase</span>
        </button>
      </header>

      <section className="frame-info-loadout panel" aria-label="Equipped weapons">
        <div>
          <p className="eyebrow">Melee Weapon</p>
          <h2>{meleeWeapon.name}</h2>
          <p>
            D{meleeWeapon.attackDie} · {meleeWeapon.damage} Damage · {meleeWeapon.minRange}-{meleeWeapon.maxRange} MD
          </p>
          {meleeWeapon.specialRules.map((rule) => (
            <p key={rule.name}>
              <strong>{rule.name}:</strong> {rule.text}
            </p>
          ))}
        </div>
        <div>
          <p className="eyebrow">Ranged Weapon</p>
          <h2>{rangedWeapon.name}</h2>
          <p>
            D{rangedWeapon.attackDie} · {rangedWeapon.damage} Damage · {rangedWeapon.minRange}-{rangedWeapon.maxRange} MD
          </p>
          {rangedWeapon.specialRules.map((rule) => (
            <p key={rule.name}>
              <strong>{rule.name}:</strong> {rule.text}
            </p>
          ))}
        </div>
      </section>

      <div className="workspace frame-info-workspace">
        <FocusPanel
          frameName={pilot.frame}
          structure={structure}
          maximumStructure={pilot.structure}
          focus={focus}
          focusPool={focusPool}
          cockpitFocus={cockpitFocus}
          expandedSystems={readOnlyExpandedSystems}
          expandedDamageTables={readOnlyExpandedDamageTables}
          selectedDamageMarkers={selectedDamageMarkers}
          focusedDamageMarker={null}
          onFocusChange={() => undefined}
          onStructureChange={() => undefined}
          onToggleSystem={showReadOnlyActions}
          onToggleDamageTable={showReadOnlyDamage}
          onToggleDamageMarker={() => undefined}
          onShowDamageMarker={() => undefined}
          onShowOvercommittedWarning={() => undefined}
          onAdvancePhase={() => undefined}
          showCockpitAlert={false}
          focusAllocationComplete={false}
          showFocusAssignments
          isCockpitPhase={false}
          isActivationPhase
          isReadOnly
          isCompressed
          allowReadOnlyDetailToggle
        />
      </div>
    </section>
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
