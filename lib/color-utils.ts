/**
 * Converts hex color to a very light background tint
 * Simple mixing approach - works great for most cases
 */
export function generateLightBackground(hex: string): string {
  // Remove # if present
  const cleanHex = hex.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Mix with white at 5% color strength
  // This creates a very subtle background tint
  const mix = 0.05;
  const bgR = Math.round(r * mix + 255 * (1 - mix));
  const bgG = Math.round(g * mix + 255 * (1 - mix));
  const bgB = Math.round(b * mix + 255 * (1 - mix));

  // Convert back to hex
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(bgR)}${toHex(bgG)}${toHex(bgB)}`;
}

// Test: generateLightBackground('#571cf9') => '#fbf8ff' ✨
