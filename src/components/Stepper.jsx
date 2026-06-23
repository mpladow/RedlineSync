import { Minus, Plus } from 'lucide-react';
import { clamp } from '../utils/helpers';

export function Stepper({ value, min = 0, max = 9, onChange, label, assignedValue = null, disableDecrement = false, emptyDisplay = false }) {
  const displayValue = assignedValue === null ? value : `${value}/${assignedValue}`;
  const isDecreaseDisabled = disableDecrement && value <= min;

  return (
    <div className="stepper" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1, min, max))}
        aria-label={`Decrease ${label}`}
        disabled={isDecreaseDisabled}
      >
        <Minus size={18} />
      </button>
      <output className={emptyDisplay ? 'empty' : ''}>{displayValue}</output>
      <button type="button" onClick={() => onChange(clamp(value + 1, min, max))} aria-label={`Increase ${label}`}>
        <Plus size={18} />
      </button>
    </div>
  );
}
