import type { FormEvent } from 'react';
import { ChevronLeft, Save, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { DEFAULT_EQUIPPED_WEAPONS, WEAPONS } from '../constants/weapons';
import { HANDLERS } from '../constants/handlers';
import { DEFAULT_FOCUS_POOL, PILOT_CARD } from '../constants/pilotCard';
import type { HandlerId, PilotRecord, WeaponSlotName } from '../types';

type PilotFormProps = {
  pilot?: PilotRecord;
  onSave: (pilot: PilotRecord) => void;
  onDelete?: (pilotId: string) => void;
};

type FormErrors = Partial<Record<'pilotName' | 'mechName' | 'frame', string>>;

const FRAME_OPTIONS = ['Assault Frame', 'Siege Frame', 'Skirmish Frame', 'Support Frame'];

function createPilotId(pilotName: string) {
  const slug = pilotName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const suffix = Date.now().toString(36);
  return `${slug || 'pilot'}-${suffix}`;
}

export function PilotForm({ pilot, onSave, onDelete }: PilotFormProps) {
  const navigate = useNavigate();
  const [pilotName, setPilotName] = useState(pilot?.pilotName ?? '');
  const [mechName, setMechName] = useState(pilot?.mechName ?? '');
  const [frame, setFrame] = useState(pilot?.frame ?? '');
  const [focusPool, setFocusPool] = useState(pilot?.focusPool ?? DEFAULT_FOCUS_POOL);
  const [handler, setHandler] = useState<HandlerId>(pilot?.handler ?? 'tactical');
  const [meleeWeapon, setMeleeWeapon] = useState(pilot?.equippedWeapons.melee ?? DEFAULT_EQUIPPED_WEAPONS.melee);
  const [rangedWeapon, setRangedWeapon] = useState(pilot?.equippedWeapons.ranged ?? DEFAULT_EQUIPPED_WEAPONS.ranged);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saveError, setSaveError] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!pilotName.trim()) nextErrors.pilotName = 'Enter a pilot name.';
    if (!mechName.trim()) nextErrors.mechName = 'Enter a Mech name.';
    if (!frame) nextErrors.frame = 'Select a frame.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveError('');
    if (!validate()) return;

    const now = new Date().toISOString();
    const nextPilot: PilotRecord = {
      id: pilot?.id ?? createPilotId(pilotName),
      pilotName: pilotName.trim(),
      mechName: mechName.trim(),
      frame,
      status: 'Ready',
      mobility: pilot?.mobility ?? PILOT_CARD.mobility,
      defence: pilot?.defence ?? PILOT_CARD.defence,
      focusPool,
      handler,
      equippedWeapons: {
        melee: meleeWeapon,
        ranged: rangedWeapon
      },
      specialAbility: pilot?.specialAbility ?? PILOT_CARD.specialAbility,
      createdAt: pilot?.createdAt ?? now,
      updatedAt: now
    };

    try {
      onSave(nextPilot);
      navigate('/');
    } catch {
      setSaveError('Pilot could not be saved. Your changes are still here—please try again.');
    }
  };

  const handleDelete = () => {
    if (!pilot || !onDelete) return;
    onDelete(pilot.id);
    navigate('/');
  };

  const renderWeaponSelect = (slot: WeaponSlotName, value: string, onChange: (value: string) => void) => (
    <label className="form-field">
      <span>{slot === 'melee' ? 'Melee weapon' : 'Ranged weapon'}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {WEAPONS.filter((weapon) => weapon.slot === slot).map((weapon) => (
          <option key={weapon.id} value={weapon.id}>
            {weapon.name}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <main className="app-shell home-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">{pilot ? 'Pilot record' : 'New record'}</p>
          <h1>{pilot ? 'Edit Pilot' : 'Create Pilot'}</h1>
        </div>
        <Link to="/" className="secondary-action page-header-action">
          <ChevronLeft size={18} />
          <span>Cancel</span>
        </Link>
      </header>

      <form className="pilot-form" onSubmit={handleSubmit} noValidate>
        {saveError && (
          <div className="alert alert-warning" role="alert">
            <p>{saveError}</p>
          </div>
        )}

        <section className="form-section" aria-labelledby="pilot-details-title">
          <div className="form-section-heading">
            <p className="eyebrow">Step 1</p>
            <h2 id="pilot-details-title">Pilot details</h2>
          </div>
          <div className="form-grid">
            <label className="form-field">
              <span>Pilot name</span>
              <input
                value={pilotName}
                onChange={(event) => setPilotName(event.target.value)}
                aria-invalid={Boolean(errors.pilotName)}
                aria-describedby={errors.pilotName ? 'pilot-name-error' : undefined}
                autoFocus
              />
              {errors.pilotName && <small id="pilot-name-error">{errors.pilotName}</small>}
            </label>
            <label className="form-field">
              <span>Mech name</span>
              <input
                value={mechName}
                onChange={(event) => setMechName(event.target.value)}
                aria-invalid={Boolean(errors.mechName)}
                aria-describedby={errors.mechName ? 'mech-name-error' : undefined}
              />
              {errors.mechName && <small id="mech-name-error">{errors.mechName}</small>}
            </label>
            <label className="form-field">
              <span>Frame</span>
              <select
                value={frame}
                onChange={(event) => setFrame(event.target.value)}
                aria-invalid={Boolean(errors.frame)}
                aria-describedby={errors.frame ? 'frame-error' : undefined}
              >
                <option value="">Select a frame</option>
                {FRAME_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.frame && <small id="frame-error">{errors.frame}</small>}
            </label>
          </div>
        </section>

        <section className="form-section" aria-labelledby="mech-configuration-title">
          <div className="form-section-heading">
            <p className="eyebrow">Step 2</p>
            <h2 id="mech-configuration-title">Mech configuration</h2>
          </div>
          <div className="form-grid">
            <label className="form-field">
              <span>Focus pool</span>
              <input
                type="number"
                min={0}
                max={12}
                value={focusPool}
                onChange={(event) => setFocusPool(Math.min(12, Math.max(0, Number(event.target.value))))}
              />
            </label>
            <label className="form-field">
              <span>Handler</span>
              <select value={handler} onChange={(event) => setHandler(event.target.value as HandlerId)}>
                {HANDLERS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            {renderWeaponSelect('melee', meleeWeapon, setMeleeWeapon)}
            {renderWeaponSelect('ranged', rangedWeapon, setRangedWeapon)}
          </div>
        </section>

        <div className="pilot-form-actions">
          {pilot && onDelete && (
            <button type="button" className="danger-action" onClick={() => setIsDeleteConfirmOpen(true)}>
              <Trash2 size={18} />
              <span>Delete pilot</span>
            </button>
          )}
          <div className="pilot-form-primary-actions">
            <Link to="/" className="secondary-action">
              Cancel
            </Link>
            <button type="submit" className="primary-action">
              <Save size={18} />
              <span>{pilot ? 'Save changes' : 'Save pilot'}</span>
            </button>
          </div>
        </div>
      </form>

      {isDeleteConfirmOpen && pilot && (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsDeleteConfirmOpen(false)}>
          <section
            className="rules-modal delete-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-pilot-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Delete pilot</p>
                <h2 id="delete-pilot-title">Delete {pilot.pilotName}?</h2>
              </div>
            </div>
            <div className="phase-confirm-body">
              <p>
                This will permanently remove {pilot.pilotName}, {pilot.mechName}, and their saved workspace progress.
              </p>
              <div className="phase-confirm-actions">
                <button type="button" className="secondary-action" onClick={() => setIsDeleteConfirmOpen(false)}>
                  Keep pilot
                </button>
                <button type="button" className="danger-action" onClick={handleDelete}>
                  <Trash2 size={18} />
                  <span>Delete pilot</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
