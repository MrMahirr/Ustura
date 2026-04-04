export function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');

  if (normalized.length !== 6) {
    return hex;
  }

  const value = Number.parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
