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
  dotDisplay?: boolean;
  dotCount?: number;
};

export function Stepper({
  value,
  min = 0,
  max = 9,
  onChange,
  label,
  assignedValue = null,
  disableDecrement = false,
  emptyDisplay = false,
  dotDisplay = false,
  dotCount = 6
}: StepperProps) {
  const displayValue = assignedValue === null ? value : `${value}/${assignedValue}`;
  const isDecreaseDisabled = disableDecrement && value <= min;

  return (
    <div className={`stepper ${dotDisplay ? 'dot-stepper' : ''}`} aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1, min, max))}
        aria-label={`Decrease ${label}`}
        disabled={isDecreaseDisabled}
      >
        <Minus size={18} />
      </button>
      {dotDisplay ? (
        <output className="focus-dots" aria-label={`${value} ${label}`}>
          {Array.from({ length: dotCount }, (_, index) => (
            <span className={index < value ? 'filled' : ''} key={index} aria-hidden="true" />
          ))}
        </output>
      ) : (
        <output className={emptyDisplay ? 'empty' : ''}>{displayValue}</output>
      )}
      <button type="button" onClick={() => onChange(clamp(value + 1, min, max))} aria-label={`Increase ${label}`}>
        <Plus size={18} />
      </button>
    </div>
  );
}
