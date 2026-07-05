import {
  FiLogIn,
  FiLogOut,
  FiCpu,
  FiType,
  FiGitBranch,
  FiGitMerge,
  FiGlobe,
  FiClock,
  FiFileText,
} from 'react-icons/fi';
import { createNode } from './createNode';
import { extractVariables, computeTextNodeWidth } from './textNodeUtils';

export const nodeDefinitions = [
  {
    type: 'customInput',
    label: 'Input',
    toolbarLabel: 'Input',
    icon: FiLogIn,
    accent: 'var(--accent-input)',
    handles: {
      outputs: [{ id: 'value' }],
    },
    fields: [
      {
        name: 'inputName',
        label: 'Name',
        type: 'text',
        default: (id) => id.replace('customInput-', 'input_'),
      },
      {
        name: 'inputType',
        label: 'Type',
        type: 'select',
        default: 'Text',
        options: ['Text', 'File'],
      },
    ],
  },
  {
    type: 'llm',
    label: 'LLM',
    toolbarLabel: 'LLM',
    icon: FiCpu,
    accent: 'var(--accent-llm)',
    description: 'This is a LLM.',
    handles: {
      inputs: [{ id: 'system' }, { id: 'prompt' }],
      outputs: [{ id: 'response' }],
    },
  },
  {
    type: 'customOutput',
    label: 'Output',
    toolbarLabel: 'Output',
    icon: FiLogOut,
    accent: 'var(--accent-output)',
    handles: {
      inputs: [{ id: 'value' }],
    },
    fields: [
      {
        name: 'outputName',
        label: 'Name',
        type: 'text',
        default: (id) => id.replace('customOutput-', 'output_'),
      },
      {
        name: 'outputType',
        label: 'Type',
        type: 'select',
        default: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'Image' },
        ],
      },
    ],
  },
  {
    type: 'text',
    label: 'Text',
    toolbarLabel: 'Text',
    icon: FiType,
    accent: 'var(--accent-text)',
    handles: (fields) => ({
      inputs: extractVariables(fields.text).map((name) => ({
        id: `var-${name}`,
        label: name,
      })),
      outputs: [{ id: 'output' }],
    }),
    style: (fields) => ({ width: computeTextNodeWidth(fields.text) }),
    fields: [
      {
        name: 'text',
        label: 'Text',
        type: 'autoTextarea',
        default: '{{input}}',
      },
    ],
  },
  {
    type: 'condition',
    label: 'Condition',
    toolbarLabel: 'Condition',
    icon: FiGitBranch,
    accent: 'var(--accent-condition)',
    description: 'Routes based on expression',
    handles: {
      inputs: [{ id: 'input' }],
      outputs: [{ id: 'true' }, { id: 'false' }],
    },
    fields: [
      {
        name: 'expression',
        label: 'If',
        type: 'text',
        default: 'value > 0',
      },
    ],
  },
  {
    type: 'merge',
    label: 'Merge',
    toolbarLabel: 'Merge',
    icon: FiGitMerge,
    accent: 'var(--accent-merge)',
    description: 'Combines multiple inputs',
    handles: {
      inputs: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
      outputs: [{ id: 'merged' }],
    },
    fields: [
      {
        name: 'strategy',
        label: 'Strategy',
        type: 'select',
        default: 'concat',
        options: ['concat', 'zip', 'first'],
      },
    ],
  },
  {
    type: 'apiRequest',
    label: 'API Request',
    toolbarLabel: 'API',
    icon: FiGlobe,
    accent: 'var(--accent-api)',
    handles: {
      inputs: [{ id: 'payload' }],
      outputs: [{ id: 'response' }],
    },
    fields: [
      {
        name: 'method',
        label: 'Method',
        type: 'select',
        default: 'GET',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
      },
      {
        name: 'url',
        label: 'URL',
        type: 'text',
        default: 'https://api.example.com',
      },
    ],
  },
  {
    type: 'delay',
    label: 'Delay',
    toolbarLabel: 'Delay',
    icon: FiClock,
    accent: 'var(--accent-delay)',
    description: 'Waits before passing data through',
    handles: {
      inputs: [{ id: 'input' }],
      outputs: [{ id: 'output' }],
    },
    fields: [
      {
        name: 'seconds',
        label: 'Seconds',
        type: 'number',
        default: 1,
      },
    ],
  },
  {
    type: 'note',
    label: 'Note',
    toolbarLabel: 'Note',
    icon: FiFileText,
    accent: 'var(--accent-note)',
    className: 'node-card--note',
    style: { minHeight: 120 },
    fields: [
      {
        name: 'content',
        label: 'Note',
        type: 'textarea',
        default: 'Add a comment...',
      },
    ],
  },
];

export const nodeTypes = Object.fromEntries(
  nodeDefinitions.map((config) => [config.type, createNode(config)])
);

export const toolbarNodes = nodeDefinitions.map(({ type, toolbarLabel, icon, accent }) => ({
  type,
  label: toolbarLabel,
  icon,
  accent,
}));

const resolveFieldDefault = (field, id, seedData) => {
  if (seedData?.[field.name] !== undefined) return seedData[field.name];
  if (typeof field.default === 'function') return field.default(id, seedData);
  if (field.default !== undefined) return field.default;
  return '';
};

export function buildNodeData(type, id, seedData = {}) {
  const config = nodeDefinitions.find((c) => c.type === type);
  const data = { id, nodeType: type };
  (config?.fields || []).forEach((field) => {
    data[field.name] = resolveFieldDefault(field, id, seedData);
  });
  return { ...data, ...seedData };
}
