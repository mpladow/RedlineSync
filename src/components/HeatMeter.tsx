import { Flame } from 'lucide-react';
import { HEAT_STATES } from '../constants/heat';
import type { HeatState } from '../types';
import { Stepper } from './Stepper';

type HeatMeterProps = {
  heat: number;
  heatState: HeatState;
  onHeatChange: (value: number) => void;
  onOpenHeatRules: (heatState: HeatState) => void;
};

export function HeatMeter({ heat, heatState, onHeatChange, onOpenHeatRules }: HeatMeterProps) {
  return (
    <section className="meter-card heat-meter heat-row">
      <div className="heat-title-row">
        <div className="meter-heading">
          <Flame size={20} />
          <span>Heat</span>
        </div>
        <button
          className={`heat-state ${heatState.className}`}
          type="button"
          onClick={() => onOpenHeatRules(heatState)}
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
              <button key={state.className} type="button" onClick={() => onOpenHeatRules(state)}>
                {state.label} {state.range}
              </button>
            ))}
          </div>
        </div>
        <Stepper value={heat} min={0} max={8} onChange={onHeatChange} label="heat" />
      </div>
    </section>
  );
}
