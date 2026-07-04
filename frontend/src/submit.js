// submit.js

import { FiPlay } from 'react-icons/fi';
import { shallow } from 'zustand/shallow';
import { useStore } from './store';

const selector = (state) => ({
  nodeCount: state.nodes.length,
  edgeCount: state.edges.length,
});

export const SubmitButton = () => {
    const { nodeCount, edgeCount } = useStore(selector, shallow);

    return (
        <div className="submit-bar">
            <div className="submit-bar__stats">
                <span className="submit-bar__stat">
                    <span className="submit-bar__dot" />
                    <strong>{nodeCount}</strong> node{nodeCount === 1 ? '' : 's'}
                </span>
                <span className="submit-bar__stat">
                    <span className="submit-bar__dot" />
                    <strong>{edgeCount}</strong> connection{edgeCount === 1 ? '' : 's'}
                </span>
            </div>
            <button type="submit" className="submit-button" disabled={nodeCount === 0}>
                <FiPlay size={13} />
                Submit
            </button>
        </div>
    );
}
