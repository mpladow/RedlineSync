import { ChevronDown, ChevronRight, ChevronUp, Sparkles } from 'lucide-react';
import { HANDLERS } from '../data/reference';
import type { HandlerId } from '../types';

type HandlerPanelProps = {
  handler: HandlerId;
  expandedCall: number;
  onChangeHandler: (handler: HandlerId) => void;
  onToggleCall: (index: number) => void;
  onAdvancePhase: () => void;
  isHighlighted?: boolean;
  showSupportAlert?: boolean;
};

export function HandlerPanel({
  handler,
  expandedCall,
  onChangeHandler,
  onToggleCall,
  onAdvancePhase,
  isHighlighted = false,
  showSupportAlert = false
}: HandlerPanelProps) {
  const activeHandler = HANDLERS.find((item) => item.id === handler) ?? HANDLERS[0];

  return (
    <section id="handler-panel" className={`panel handler-panel ${isHighlighted ? 'attention' : ''}`} tabIndex={-1}>
      <div className="focus-panel-heading">
        <div className="section-title">
          <Sparkles size={20} />
          <h2>Handler</h2>
        </div>
        {showSupportAlert && (
          <div className="focus-alert" role="alert">
            <span>You can activate Support Actions in this phase.</span>
            <button className="support-phase-advance" type="button" onClick={onAdvancePhase}>
              <span>Continue to Activation Phase</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
      <div className="handler-tabs">
        {HANDLERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={handler === item.id ? 'selected' : ''}
            onClick={() => onChangeHandler(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="handler-summary">
        <p>{activeHandler.role}</p>
        <strong>{activeHandler.asset}</strong>
      </div>
      <div className="call-list">
        {activeHandler.calls.map((call, index) => {
          const [name, body] = call.split(': ');
          const open = expandedCall === index;
          return (
            <article className="call-item" key={call}>
              <button type="button" onClick={() => onToggleCall(open ? -1 : index)}>
                <span>{name}</span>
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <div className={`call-content ${open ? 'open' : 'closed'}`}>
                <p>{body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
