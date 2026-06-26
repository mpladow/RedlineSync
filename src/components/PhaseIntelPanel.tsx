import { Eye, EyeOff, Radio, SatelliteDish } from 'lucide-react';
import { getHandlerDeployableAsset, getHandlerDirectives } from '../data/reference';
import type { HandlerId } from '../types';
import { DeployableAssetPanel } from './DeployableAssetPanel';

type PhaseIntelPanelProps = {
  handler: HandlerId;
  directiveRoll: number | null;
  isDirectiveRevealed: boolean;
  isAssetDeployed: boolean;
  onDirectiveVisibilityChange: (isRevealed: boolean) => void;
  onToggleAssetDeployed: () => void;
};

export function PhaseIntelPanel({
  handler,
  directiveRoll,
  isDirectiveRevealed,
  isAssetDeployed,
  onDirectiveVisibilityChange,
  onToggleAssetDeployed
}: PhaseIntelPanelProps) {
  const directives = getHandlerDirectives(handler);
  const deployableAsset = getHandlerDeployableAsset(handler);
  const directive = directives.find((item) => item.roll === directiveRoll) ?? null;
  const hasDirectiveData = directives.length > 0;

  return (
    <section className="panel handler-intel-panel" aria-labelledby="handler-intel-title">
      <div className="section-title">
        <SatelliteDish size={20} />
        <h2 id="handler-intel-title">Handler</h2>
      </div>

      <div className="phase-intel-panel" aria-label="Handler directive and deployable asset">
        <section className="selected-directive-panel" aria-labelledby="selected-directive-title">
          <div className="selected-directive-heading">
            <div className="section-title">
              <Radio size={20} />
              <div>
                <p className="eyebrow">Selected Directive</p>
                <h2 id="selected-directive-title">Current Handler Order</h2>
              </div>
            </div>
          </div>

          {directive ? (
            <>
              <button
                type="button"
                className={`encrypted-directive ${isDirectiveRevealed ? 'revealed' : ''}`}
                onClick={() => onDirectiveVisibilityChange(!isDirectiveRevealed)}
              >
                {isDirectiveRevealed ? <EyeOff size={22} /> : <Eye size={22} />}
                <span>
                  <strong>{isDirectiveRevealed ? directive.name : 'Face Down / Encrypted'}</strong>
                  <small>{isDirectiveRevealed ? 'Tap to hide directive' : 'Tap to view directive'}</small>
                </span>
              </button>

              {isDirectiveRevealed && (
                <div className="selected-directive-details">
                  <span className="directive-timing">{directive.timing}</span>
                  <p>{directive.effect}</p>
                </div>
              )}
            </>
          ) : (
            <div className="encrypted-directive empty">
              <EyeOff size={22} />
              <span>
                <strong>Face Down / Encrypted</strong>
                <small>{hasDirectiveData ? 'No directive selected yet' : 'Directive data unavailable'}</small>
              </span>
            </div>
          )}
        </section>

        {deployableAsset ? (
          <DeployableAssetPanel
            asset={deployableAsset}
            isDeployed={isAssetDeployed}
            onToggleDeployed={onToggleAssetDeployed}
          />
        ) : (
          <section className="deployable-asset-panel">
            <p className="eyebrow">Deployable Asset</p>
            <h2>Asset data unavailable</h2>
            <p className="deployable-asset-effect">The {handler} Handler’s deployable asset has not been added yet.</p>
          </section>
        )}
      </div>
    </section>
  );
}
