import { FiShare2 } from 'react-icons/fi';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
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
      </header>
      <PipelineToolbar />
      <main className="app-main">
        <PipelineUI />
      </main>
      <SubmitButton />
    </div>
  );
}

export default App;
