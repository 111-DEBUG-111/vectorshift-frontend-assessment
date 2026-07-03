import { useState } from 'react';
import { BaseNode } from './BaseNode';

const resolveDefault = (field, id, data) => {
  if (data?.[field.name] !== undefined) {
    return data[field.name];
  }
  if (typeof field.default === 'function') {
    return field.default(id, data);
  }
  if (field.default !== undefined) {
    return field.default;
  }
  return '';
};

const buildInitialFields = (fieldDefs, id, data) => {
  const initial = {};
  (fieldDefs || []).forEach((field) => {
    initial[field.name] = resolveDefault(field, id, data);
  });
  return initial;
};

export function createNode(config) {
  return function ConfiguredNode({ id, data }) {
    const [fields, setFields] = useState(() =>
      buildInitialFields(config.fields, id, data)
    );

    const setField = (name, value) => {
      setFields((prev) => ({ ...prev, [name]: value }));
    };

    return (
      <BaseNode
        id={id}
        config={config}
        fields={fields}
        setField={setField}
      />
    );
  };
}
