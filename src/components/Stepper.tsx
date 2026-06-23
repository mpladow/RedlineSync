import { Minus, Plus } from 'lucide-react';
import { clamp } from '../utils/helpers';

type StepperProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  label: string;
  assignedValue?: number | null;
  disableDecrement?: boolean;
  emptyDisplay?: boolean;
};

export function Stepper({
  value,
  min = 0,
  max = 9,
  onChange,
  label,
  assignedValue = null,
  disableDecrement = false,
  emptyDisplay = false
}: StepperProps) {
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
