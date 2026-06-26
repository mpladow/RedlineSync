import { Eye, EyeOff, Radio, ShieldAlert } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getHandlerDeployableAsset, getHandlerDirectives, HANDLERS } from '../data/reference';
import type { HandlerDirective, HandlerId } from '../types';
import { DeployableAssetPanel } from './DeployableAssetPanel';

type HandlerPhaseProps = {
  handler: HandlerId;
  directiveRoll: number | null;
  isDirectiveRevealed: boolean;
  isAssetDeployed: boolean;
  onDirectiveGenerated: (roll: number) => void;
  onDirectiveVisibilityChange: (isRevealed: boolean) => void;
  onToggleAssetDeployed: () => void;
};

export function HandlerPhase({
  handler,
  directiveRoll,
  isDirectiveRevealed,
  isAssetDeployed,
  onDirectiveGenerated,
  onDirectiveVisibilityChange,
  onToggleAssetDeployed
}: HandlerPhaseProps) {
  const [isReceiving, setIsReceiving] = useState(false);
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const timerRef = useRef<number | null>(null);
  const activeHandler = HANDLERS.find((item) => item.id === handler) ?? HANDLERS[0];
  const directives = getHandlerDirectives(handler);
  const deployableAsset = getHandlerDeployableAsset(handler);
  const directive = directives.find((item) => item.roll === directiveRoll) ?? null;
  const hasDirectiveData = directives.length > 0;

  useEffect(() => () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
  }, []);

  const beginReceivingDirective = () => {
    if (!hasDirectiveData || isReceiving) return;
    setIsDiscardConfirmOpen(false);
    setIsReceiving(true);
    onDirectiveVisibilityChange(false);

    timerRef.current = window.setTimeout(() => {
      const nextDirective = directives[Math.floor(Math.random() * directives.length)];
      onDirectiveGenerated(nextDirective.roll);
      onDirectiveVisibilityChange(true);
      setIsReceiving(false);
      timerRef.current = null;
    }, 3000);
  };

  const requestDirective = () => {
    if (directive) {
      setIsDiscardConfirmOpen(true);
      return;
    }

    beginReceivingDirective();
  };

  return (
    <div className="handler-phase-layout">
      <section className="panel private-comms-panel">
        <div className="private-comms-header">
          <div>
            <p className="eyebrow">Private Comms</p>
            <h2>{activeHandler.label} Handler</h2>
          </div>
          <Radio size={24} aria-hidden="true" />
        </div>

        <p className="handler-turn-description">
          {activeHandler.role} Receive one private directive for this round. Keep the screen tilted away from your
          opponent before revealing it.
        </p>

        {hasDirectiveData ? (
          <button
            type="button"
            className={`incoming-directive-button ${isReceiving ? 'receiving' : ''}`}
            onClick={requestDirective}
            disabled={isReceiving}
          >
            {isReceiving ? (
              <>
                <ReceptionLines />
                <span>Receiving Directive</span>
              </>
            ) : (
              <>
                <Radio size={20} />
                <span>{directive ? 'Receive New Directive' : 'Incoming Directive'}</span>
              </>
            )}
          </button>
        ) : (
          <div className="directive-unavailable" role="status">
            <ShieldAlert size={22} />
            <div>
              <strong>Directive data unavailable</strong>
              <p>{activeHandler.label} directives have not been added yet.</p>
            </div>
          </div>
        )}

        <div className="current-directive-section">
          <p className="eyebrow">Current Directive</p>
          {directive ? (
            <button
              type="button"
              className={`encrypted-directive ${isDirectiveRevealed ? 'revealed' : ''}`}
              onClick={() => onDirectiveVisibilityChange(!isDirectiveRevealed)}
            >
              {isDirectiveRevealed ? <EyeOff size={22} /> : <Eye size={22} />}
              <span>
                <strong>{isDirectiveRevealed ? directive.name : 'Face Down / Encrypted'}</strong>
                <small>{isDirectiveRevealed ? 'Tap to hide' : 'Tap to view'}</small>
              </span>
            </button>
          ) : (
            <div className="encrypted-directive empty">
              <EyeOff size={22} />
              <span>
                <strong>Face Down / Encrypted</strong>
                <small>{hasDirectiveData ? 'Awaiting transmission' : 'No directive table available'}</small>
              </span>
            </div>
          )}
        </div>

        <div className="directive-status">
          <p className="eyebrow">Status</p>
          <dl>
            <div><dt>Directive</dt><dd>{directive && isDirectiveRevealed ? 'Revealed' : 'Hidden'}</dd></div>
            <div><dt>Timing</dt><dd>{directive && isDirectiveRevealed ? directive.timing : 'Not revealed'}</dd></div>
            <div><dt>Expires</dt><dd>End Phase</dd></div>
          </dl>
        </div>
      </section>

      {deployableAsset && (
        <DeployableAssetPanel
          asset={deployableAsset}
          isDeployed={isAssetDeployed}
          onToggleDeployed={onToggleAssetDeployed}
        />
      )}

      {directive && isDirectiveRevealed && (
        <DirectiveModal directive={directive} onHide={() => onDirectiveVisibilityChange(false)} />
      )}

      {isDiscardConfirmOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setIsDiscardConfirmOpen(false)}
        >
          <section
            className="rules-modal phase-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="discard-directive-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Replace Directive</p>
                <h2 id="discard-directive-title">Discard the current directive?</h2>
              </div>
            </div>
            <div className="phase-confirm-body">
              <p>
                Receiving a new directive will permanently discard “{directive?.name}”.
              </p>
              <div className="phase-confirm-actions">
                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => setIsDiscardConfirmOpen(false)}
                >
                  Keep Current
                </button>
                <button type="button" className="primary-action" onClick={beginReceivingDirective}>
                  Discard and Receive
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function ReceptionLines() {
  return (
    <span className="reception-lines" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((line) => <i key={line} />)}
    </span>
  );
}

function DirectiveModal({ directive, onHide }: { directive: HandlerDirective; onHide: () => void }) {
  return (
    <div className="modal-backdrop directive-modal-backdrop" role="presentation">
      <section className="rules-modal directive-modal" role="dialog" aria-modal="true" aria-labelledby="directive-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Incoming Directive · d10 {directive.roll}</p>
            <h2 id="directive-title">“{directive.name}”</h2>
          </div>
          <Radio size={22} />
        </div>
        <div className="directive-modal-body">
          <span className="directive-timing">{directive.timing}</span>
          <p>{directive.effect}</p>
          <button type="button" className="primary-action" onClick={onHide}>
            <EyeOff size={18} />
            Hide Directive
          </button>
        </div>
      </section>
    </div>
  );
}
