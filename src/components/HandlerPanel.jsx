import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { HANDLERS } from '../constants/handlers';

export function HandlerPanel({ handler, expandedCall, onChangeHandler, onToggleCall }) {
  const activeHandler = HANDLERS.find((item) => item.id === handler);

  return (
    <section className="panel handler-panel">
      <div className="section-title">
        <Sparkles size={20} />
        <h2>Handler</h2>
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
              {open && <p>{body}</p>}
            </article>
          );
        })}
      </div>
    </section>
  );
}
