/** Escapes user input before it is interpolated into an HTML email. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Reads a trimmed, length-capped string field from FormData. */
export function formField(formData: FormData, name: string, max = 200): string {
  const v = formData.get(name);
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
