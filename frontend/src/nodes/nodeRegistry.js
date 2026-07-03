import { createNode } from './createNode';

export const nodeDefinitions = [
  {
    type: 'customInput',
    label: 'Input',
    toolbarLabel: 'Input',
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
    handles: {
      outputs: [{ id: 'output' }],
    },
    fields: [
      {
        name: 'text',
        label: 'Text',
        type: 'text',
        default: '{{input}}',
      },
    ],
  },
  {
    type: 'condition',
    label: 'Condition',
    toolbarLabel: 'Condition',
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

export const toolbarNodes = nodeDefinitions.map(({ type, toolbarLabel }) => ({
  type,
  label: toolbarLabel,
}));
