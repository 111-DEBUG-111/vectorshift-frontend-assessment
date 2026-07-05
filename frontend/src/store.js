// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      const removedIds = changes
        .filter((change) => change.type === 'remove')
        .map((change) => change.id);

      const nextNodes = applyNodeChanges(changes, get().nodes);
      const nextEdges =
        removedIds.length > 0
          ? get().edges.filter(
              (edge) =>
                !removedIds.includes(edge.source) &&
                !removedIds.includes(edge.target)
            )
          : get().edges;

      set({ nodes: nextNodes, edges: nextEdges });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, [fieldName]: fieldValue } }
            : node
        ),
      });
    },
    insertClones: (newNodes, newEdges) => {
      set({
        nodes: [
          ...get().nodes.map((n) => (n.selected ? { ...n, selected: false } : n)),
          ...newNodes,
        ],
        edges: [...get().edges, ...newEdges],
      });
    },
    selectAll: () => {
      set({
        nodes: get().nodes.map((n) => (n.selected ? n : { ...n, selected: true })),
      });
    },
    deselectAll: () => {
      set({
        nodes: get().nodes.map((n) => (n.selected ? { ...n, selected: false } : n)),
        edges: get().edges.map((e) => (e.selected ? { ...e, selected: false } : e)),
      });
    },
    deleteNodesByIds: (ids) => {
      const idSet = new Set(ids);
      set({
        nodes: get().nodes.filter((n) => !idSet.has(n.id)),
        edges: get().edges.filter((e) => !idSet.has(e.source) && !idSet.has(e.target)),
      });
    },
    pruneDanglingEdges: (nodeId, removedTargetHandleIds = [], removedSourceHandleIds = []) => {
      set({
        edges: get().edges.filter((edge) => !(
          (edge.target === nodeId && removedTargetHandleIds.includes(edge.targetHandle)) ||
          (edge.source === nodeId && removedSourceHandleIds.includes(edge.sourceHandle))
        )),
      });
    },
  }));
