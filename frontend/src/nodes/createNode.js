import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export function createNode(config) {
  return function ConfiguredNode({ id, data }) {
    const updateNodeField = useStore((state) => state.updateNodeField);
    const setField = (name, value) => updateNodeField(id, name, value);

    return (
      <BaseNode
        id={id}
        config={config}
        fields={data}
        setField={setField}
      />
    );
  };
}
