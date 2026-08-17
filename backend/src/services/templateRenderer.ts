import { RenderFieldsInput } from '../types';

// Replaces {{field}} tokens with values from `fields`. Unmatched placeholders
// are left as-is (visible gap) rather than silently turning into "undefined".
export function renderTemplate(template: string, fields: RenderFieldsInput): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) => {
    const value = fields[key];
    return value !== undefined && value !== '' ? value : match;
  });
}
