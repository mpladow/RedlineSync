import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { getDamageSeverity } from '../utils/helpers';
import { Stepper } from './Stepper';

export function SystemCard({
  system,
  focusValue,
  focusPool,
  selectedDamage,
  expandedActions,
  expandedDamage,
  focusedMarker,
  onFocusChange,
  onToggleActions,
  onToggleDamage,
  onToggleMarker,
  onShowDamageMarker
}) {
  const { id, label, icon: Icon, accent, actions, damageMarkers } = system;
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
                onClick={() => onShowDamageMarker(id, markerName)}
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
            value={focusValue}
            max={focusPool}
            onChange={(value) => onFocusChange(id, value)}
            label={`${label} focus`}
          />
        </div>
      </div>

      <div className="system-section">
        <button
          className="collapse-toggle section-toggle"
          type="button"
          aria-expanded={expandedActions}
          aria-label={`${expandedActions ? 'Hide' : 'Show'} ${label} actions`}
          onClick={() => onToggleActions(id)}
        >
          <span>Actions</span>
          {expandedActions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedActions && (
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
          aria-expanded={expandedDamage}
          aria-label={`${expandedDamage ? 'Hide' : 'Show'} ${label} damage markers`}
          onClick={() => onToggleDamage(id)}
        >
          <span>Damage</span>
          {expandedDamage ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {expandedDamage && (
          <div className="data-table marker-table" aria-label={`${label} damage markers`}>
            <div className="table-head">
              <span>Roll</span>
              <span>Name</span>
              <span>Effect</span>
            </div>
            {damageMarkers.map((marker) => {
              const isSelected = selectedDamage.includes(marker.name);
              const severity = getDamageSeverity(marker);
              const isFocused = focusedMarker?.systemId === id && focusedMarker?.markerName === marker.name;
              return (
                <button
                  className={`table-row marker-row ${severity} ${isSelected ? 'selected' : ''} ${isFocused ? 'focused' : ''}`}
                  key={marker.name}
                  type="button"
                  aria-pressed={isSelected}
                  data-system-id={id}
                  data-marker-name={marker.name}
                  onClick={() => onToggleMarker(id, marker.name)}
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
}
