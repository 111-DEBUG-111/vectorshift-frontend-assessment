import { useState } from 'react';
import { FiShare2, FiHelpCircle } from 'react-icons/fi';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { ShortcutsPanel } from './ShortcutsPanel';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useKeyboardShortcuts({
    isPanelOpen: shortcutsOpen,
    onClosePanel: () => setShortcutsOpen(false),
    onTogglePanel: () => setShortcutsOpen((open) => !open),
  });

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand">
          <div className="app-header__logo">
            <FiShare2 size={16} />
          </div>
          <div>
            <div className="app-header__title">VectorShift</div>
            <div className="app-header__subtitle">Pipeline Builder</div>
          </div>
        </div>
        <button
          type="button"
          className="app-header__shortcuts-btn"
          onClick={() => setShortcutsOpen(true)}
          aria-label="Keyboard shortcuts"
        >
          <FiHelpCircle size={14} />
          Shortcuts
        </button>
      </header>
      <PipelineToolbar />
      <main className="app-main">
        <PipelineUI />
      </main>
      <SubmitButton />
      <ShortcutsPanel open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}

export default App;
