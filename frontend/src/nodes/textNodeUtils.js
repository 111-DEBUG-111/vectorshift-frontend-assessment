const VARIABLE_PATTERN = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;

export function extractVariables(text) {
  const seen = new Set();
  const names = [];
  let match;
  VARIABLE_PATTERN.lastIndex = 0;
  while ((match = VARIABLE_PATTERN.exec(text || '')) !== null) {
    const name = match[1];
    if (!seen.has(name)) {
      seen.add(name);
      names.push(name);
    }
  }
  return names;
}

export const MIN_TEXTAREA_WIDTH = 220;
export const MAX_TEXTAREA_WIDTH = 480;
export const MAX_TEXTAREA_HEIGHT = 240;

const TEXT_FONT = '12px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const HORIZONTAL_PADDING = 56;

let measureContext = null;

function getMeasureContext() {
  if (!measureContext) {
    const canvas = document.createElement('canvas');
    measureContext = canvas.getContext('2d');
    measureContext.font = TEXT_FONT;
  }
  return measureContext;
}

export function computeTextNodeWidth(text) {
  const ctx = getMeasureContext();
  const lines = (text || '').split('\n');
  const longest = lines.reduce(
    (max, line) => Math.max(max, ctx.measureText(line).width),
    0
  );
  const desired = longest + HORIZONTAL_PADDING;
  return Math.min(MAX_TEXTAREA_WIDTH, Math.max(MIN_TEXTAREA_WIDTH, desired));
}
