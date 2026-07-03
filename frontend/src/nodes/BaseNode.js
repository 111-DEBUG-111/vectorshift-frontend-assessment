import { Handle, Position, useReactFlow } from 'reactflow';
import {
  defaultNodeStyle,
  fieldLabelStyle,
  fieldInputStyle,
  nodeHeaderStyle,
  deleteButtonStyle,
} from './nodeStyles';

const POSITION_MAP = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

const getAutoSpacedStyle = (index, total, position) => {
  const fraction = ((index + 1) / (total + 1)) * 100;
  if (position === 'left' || position === 'right') {
    return { top: `${fraction}%` };
  }
  return { left: `${fraction}%` };
};

const groupHandlesByPosition = (handles, defaultPosition) => {
  const groups = {};
  handles.forEach((handle, index) => {
    const position = handle.position || defaultPosition;
    if (!groups[position]) {
      groups[position] = [];
    }
    groups[position].push({ ...handle, originalIndex: index });
  });
  return groups;
};

const renderHandles = (handles, handleType, defaultPosition, nodeId) => {
  if (!handles?.length) return null;

  const groups = groupHandlesByPosition(handles, defaultPosition);

  return Object.entries(groups).flatMap(([position, groupHandles]) =>
    groupHandles.map((handle, index) => {
      const style =
        handle.style ?? getAutoSpacedStyle(index, groupHandles.length, position);

      return (
        <Handle
          key={`${handleType}-${handle.id}`}
          type={handleType}
          position={POSITION_MAP[position]}
          id={`${nodeId}-${handle.id}`}
          style={style}
        />
      );
    })
  );
};

const normalizeOption = (option) => {
  if (typeof option === 'string') {
    return { value: option, label: option };
  }
  return option;
};

const renderField = (field, value, setField) => {
  const onChange = (e) => setField(field.name, e.target.value);

  switch (field.type) {
    case 'select':
      return (
        <select
          className="nodrag"
          value={value}
          onChange={onChange}
          style={fieldInputStyle}
        >
          {field.options.map((option) => {
            const { value: optionValue, label } = normalizeOption(option);
            return (
              <option key={optionValue} value={optionValue}>
                {label}
              </option>
            );
          })}
        </select>
      );
    case 'number':
      return (
        <input
          className="nodrag"
          type="number"
          value={value}
          onChange={onChange}
          style={fieldInputStyle}
        />
      );
    case 'textarea':
      return (
        <textarea
          className="nodrag"
          value={value}
          onChange={onChange}
          style={{ ...fieldInputStyle, resize: 'vertical', minHeight: 48 }}
        />
      );
    case 'text':
    default:
      return (
        <input
          className="nodrag"
          type="text"
          value={value}
          onChange={onChange}
          style={fieldInputStyle}
        />
      );
  }
};

export const BaseNode = ({ id, config, fields, setField }) => {
  const { deleteElements } = useReactFlow();
  const containerStyle = { ...defaultNodeStyle, ...config.style };
  const { label, description, handles = {}, fields: fieldDefs = [], renderBody } = config;

  const handleDelete = (event) => {
    event.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <div style={containerStyle}>
      {renderHandles(handles.inputs, 'target', 'left', id)}
      {renderHandles(handles.outputs, 'source', 'right', id)}

      <div style={nodeHeaderStyle}>
        <span>{label}</span>
        <button
          type="button"
          className="nodrag"
          onClick={handleDelete}
          style={deleteButtonStyle}
          aria-label="Delete node"
        >
          ×
        </button>
      </div>

      {description && (
        <div>
          <span>{description}</span>
        </div>
      )}

      {renderBody ? (
        renderBody({ id, data: fields, fields, setField })
      ) : (
        <div>
          {fieldDefs.map((field) => (
            <label key={field.name} style={fieldLabelStyle}>
              {field.label}:
              {renderField(field, fields[field.name], setField)}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
