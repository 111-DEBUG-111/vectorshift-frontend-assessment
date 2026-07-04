// toolbar.js

import { DraggableNode } from './draggableNode';
import { toolbarNodes } from './nodes/nodeRegistry';

export const PipelineToolbar = () => {

    return (
        <div className="toolbar">
            <span className="toolbar__label">Nodes</span>
            {toolbarNodes.map(({ type, label, icon, accent }) => (
                <DraggableNode key={type} type={type} label={label} icon={icon} accent={accent} />
            ))}
        </div>
    );
};
