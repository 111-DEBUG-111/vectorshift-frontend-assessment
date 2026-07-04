// draggableNode.js

export const DraggableNode = ({ type, label, icon: Icon, accent }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.classList.add('is-dragging');
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    return (
      <div
        className="toolbar-node"
        style={accent ? { '--accent': accent } : undefined}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => event.target.classList.remove('is-dragging')}
        draggable
      >
          {Icon && (
            <span className="toolbar-node__icon">
              <Icon size={12} />
            </span>
          )}
          <span>{label}</span>
      </div>
    );
  };
