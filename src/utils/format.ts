export function titleCase(value: string): string {
  if (!value) return value;
  return value
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function upper(value: string): string {
  return value.toUpperCase();
}
