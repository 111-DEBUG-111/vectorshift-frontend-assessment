import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { cloneNodes } from '../nodes/cloneNodes';

function isEditableTarget(target) {
  if (!target) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

function getSelectionWithInternalEdges(store) {
  const selectedNodes = store.nodes.filter((n) => n.selected);
  const selectedIds = new Set(selectedNodes.map((n) => n.id));
  const internalEdges = store.edges.filter(
    (e) => selectedIds.has(e.source) && selectedIds.has(e.target)
  );
  return { selectedNodes, internalEdges };
}

export function useKeyboardShortcuts({ isPanelOpen, onClosePanel, onTogglePanel } = {}) {
  const clipboardRef = useRef(null);
  const isPanelOpenRef = useRef(isPanelOpen);
  isPanelOpenRef.current = isPanelOpen;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isEditableTarget(event.target)) return;

      const isMod = event.metaKey || event.ctrlKey;
      const store = useStore.getState();

      if (event.key === '?' || (isMod && event.key === '/')) {
        event.preventDefault();
        onTogglePanel?.();
        return;
      }

      if (event.key === 'Escape') {
        if (isPanelOpenRef.current) {
          onClosePanel?.();
        } else {
          store.deselectAll();
        }
        return;
      }

      if (!isMod) return;

      switch (event.key.toLowerCase()) {
        case 'a': {
          event.preventDefault();
          store.selectAll();
          break;
        }
        case 'c': {
          event.preventDefault();
          const { selectedNodes, internalEdges } = getSelectionWithInternalEdges(store);
          if (!selectedNodes.length) return;
          clipboardRef.current = { nodes: selectedNodes, edges: internalEdges };
          break;
        }
        case 'x': {
          event.preventDefault();
          const { selectedNodes, internalEdges } = getSelectionWithInternalEdges(store);
          if (!selectedNodes.length) return;
          clipboardRef.current = { nodes: selectedNodes, edges: internalEdges };
          store.deleteNodesByIds(selectedNodes.map((n) => n.id));
          break;
        }
        case 'v': {
          event.preventDefault();
          const clip = clipboardRef.current;
          if (!clip || !clip.nodes.length) return;
          const { nodes, edges } = cloneNodes(clip.nodes, clip.edges, store.getNodeID);
          store.insertClones(nodes, edges);
          break;
        }
        case 'd': {
          event.preventDefault();
          const { selectedNodes, internalEdges } = getSelectionWithInternalEdges(store);
          if (!selectedNodes.length) return;
          const { nodes, edges } = cloneNodes(selectedNodes, internalEdges, store.getNodeID);
          store.insertClones(nodes, edges);
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClosePanel, onTogglePanel]);
}
