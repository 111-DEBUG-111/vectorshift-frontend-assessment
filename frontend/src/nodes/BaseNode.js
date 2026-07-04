import { Handle, Position, useReactFlow } from 'reactflow';

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
          className="nodrag node-field__select"
          value={value}
          onChange={onChange}
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
          className="nodrag node-field__input"
          type="number"
          value={value}
          onChange={onChange}
        />
      );
    case 'textarea':
      return (
        <textarea
          className="nodrag node-field__textarea"
          value={value}
          onChange={onChange}
        />
      );
    case 'text':
    default:
      return (
        <input
          className="nodrag node-field__input"
          type="text"
          value={value}
          onChange={onChange}
        />
      );
  }
};

export const BaseNode = ({ id, config, fields, setField }) => {
  const { deleteElements } = useReactFlow();
  const {
    label,
    description,
    icon: Icon,
    accent,
    className,
    handles = {},
    fields: fieldDefs = [],
    renderBody,
    style,
  } = config;

  const handleDelete = (event) => {
    event.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <div
      className={`node-card${className ? ` ${className}` : ''}`}
      style={{ ...(accent ? { '--accent': accent } : {}), ...style }}
    >
      {renderHandles(handles.inputs, 'target', 'left', id)}
      {renderHandles(handles.outputs, 'source', 'right', id)}

      <div className="node-card__accent" />

      <div className="node-card__header">
        {Icon && (
          <span className="node-card__icon">
            <Icon size={13} />
          </span>
        )}
        <span className="node-card__title">{label}</span>
        <button
          type="button"
          className="nodrag node-card__delete"
          onClick={handleDelete}
          aria-label="Delete node"
        >
          ×
        </button>
      </div>

      {description && <div className="node-card__description">{description}</div>}

      {renderBody ? (
        renderBody({ id, data: fields, fields, setField })
      ) : (
        <div className="node-card__body">
          {fieldDefs.map((field) => (
            <label key={field.name} className="node-field">
              <span className="node-field__label">{field.label}</span>
              {renderField(field, fields[field.name], setField)}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
