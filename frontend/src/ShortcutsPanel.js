import { FiX } from 'react-icons/fi';

const isMac =
  typeof navigator !== 'undefined' &&
  (navigator.platform?.toUpperCase().includes('MAC') ||
    navigator.userAgent?.toUpperCase().includes('MAC'));

const MOD_LABEL = isMac ? '⌘' : 'Ctrl';

const SHORTCUTS = [
  { keys: [MOD_LABEL, 'C'], description: 'Copy selected node(s)' },
  { keys: [MOD_LABEL, 'X'], description: 'Cut selected node(s)' },
  { keys: [MOD_LABEL, 'V'], description: 'Paste' },
  { keys: [MOD_LABEL, 'D'], description: 'Duplicate selected node(s)' },
  { keys: [MOD_LABEL, 'A'], description: 'Select all nodes' },
  { keys: ['Delete'], description: 'Delete selected node(s)/edge(s)' },
  { keys: ['Double-click'], description: 'Delete a connection' },
  { keys: ['Shift', 'Drag'], description: 'Box-select multiple nodes' },
  { keys: [MOD_LABEL, 'Click'], description: 'Add/remove a node from the selection' },
  { keys: ['Esc'], description: 'Deselect all' },
  { keys: [MOD_LABEL, '/'], description: 'Toggle this shortcuts panel' },
];

export const ShortcutsPanel = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="shortcuts-overlay" onClick={onClose}>
      <div
        className="shortcuts-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shortcuts-panel__header">
          <span>Keyboard Shortcuts</span>
          <button
            type="button"
            className="shortcuts-panel__close"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={16} />
          </button>
        </div>
        <ul className="shortcuts-panel__list">
          {SHORTCUTS.map((shortcut) => (
            <li key={shortcut.description}>
              <span className="shortcuts-panel__description">{shortcut.description}</span>
              <span className="shortcuts-panel__keys">
                {shortcut.keys.map((key, index) => (
                  <kbd key={index}>{key}</kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
