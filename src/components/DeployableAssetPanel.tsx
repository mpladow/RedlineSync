import { RadioTower } from 'lucide-react';
import type { DeployableAsset } from '../types';

type DeployableAssetPanelProps = {
  asset: DeployableAsset;
  isDeployed: boolean;
  onToggleDeployed: () => void;
};

export function DeployableAssetPanel({ asset, isDeployed, onToggleDeployed }: DeployableAssetPanelProps) {
  return (
    <section className="panel deployable-asset-panel" aria-labelledby="deployable-asset-title">
      <div className="deployable-asset-heading">
        <div className="section-title">
          <RadioTower size={20} />
          <div>
            <p className="eyebrow">Deployable Asset</p>
            <h2 id="deployable-asset-title">{asset.name}</h2>
          </div>
        </div>
        <button
          type="button"
          className={`deploy-asset-button ${isDeployed ? 'deployed' : ''}`}
          aria-pressed={isDeployed}
          onClick={onToggleDeployed}
        >
          <span className="deploy-status-light" aria-hidden="true" />
          {isDeployed ? 'Deployed' : 'Deploy'}
        </button>
      </div>

      <div className="deployable-asset-meta">
        <span><small>Deployment</small>{asset.deployment}</span>
        <span><small>Cost</small>{asset.cost}</span>
        <span><small>Type</small>{asset.type}</span>
      </div>

      <p className="deployable-asset-effect">{asset.effect}</p>

      <dl className="deployable-asset-stats">
        {asset.stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
