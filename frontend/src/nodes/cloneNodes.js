const OFFSET = 40;

export function cloneNodes(sourceNodes, sourceEdges, getNodeID) {
  const idMap = new Map();

  const newNodes = sourceNodes.map((node) => {
    const newId = getNodeID(node.type);
    idMap.set(node.id, newId);
    return {
      ...node,
      id: newId,
      selected: true,
      dragging: false,
      position: { x: node.position.x + OFFSET, y: node.position.y + OFFSET },
      data: { ...node.data, id: newId },
    };
  });

  const newEdges = sourceEdges
    .filter((edge) => idMap.has(edge.source) && idMap.has(edge.target))
    .map((edge) => {
      const newSource = idMap.get(edge.source);
      const newTarget = idMap.get(edge.target);
      const newSourceHandle = edge.sourceHandle
        ? newSource + edge.sourceHandle.slice(edge.source.length)
        : edge.sourceHandle;
      const newTargetHandle = edge.targetHandle
        ? newTarget + edge.targetHandle.slice(edge.target.length)
        : edge.targetHandle;
      return {
        ...edge,
        id: `reactflow__edge-${newSourceHandle || newSource}-${newTargetHandle || newTarget}`,
        source: newSource,
        target: newTarget,
        sourceHandle: newSourceHandle,
        targetHandle: newTargetHandle,
        selected: false,
      };
    });

  return { nodes: newNodes, edges: newEdges };
}
