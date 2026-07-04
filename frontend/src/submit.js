// submit.js

import { FiPlay } from 'react-icons/fi';
import { shallow } from 'zustand/shallow';
import { useStore } from './store';

const PARSE_PIPELINE_URL = 'http://localhost:8000/pipelines/parse';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
    const { nodes, edges } = useStore(selector, shallow);
    const nodeCount = nodes.length;
    const edgeCount = edges.length;

    const handleSubmit = async () => {
        try {
            const response = await fetch(PARSE_PIPELINE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const { num_nodes, num_edges, is_dag } = await response.json();

            alert(
                `Pipeline Analysis\n\n` +
                `Nodes: ${num_nodes}\n` +
                `Edges: ${num_edges}\n` +
                `Is DAG: ${is_dag ? 'Yes' : 'No'}`
            );
        } catch (error) {
            alert(`Failed to analyze pipeline: ${error.message}`);
        }
    };

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
            <button type="button" className="submit-button" onClick={handleSubmit} disabled={nodeCount === 0}>
                <FiPlay size={13} />
                Submit
            </button>
        </div>
    );
}
