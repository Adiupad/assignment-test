export function sanitizeIdentifier(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_')
    .replace(/^[0-9]/, '_$&') || 'col';
}

export function quoteIdentifier(identifier) {
  return `"${identifier.replace(/"/g, '""')}"`;
}
