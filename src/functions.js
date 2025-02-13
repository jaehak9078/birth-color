export const getContrastingColor = (hexColor) => {
  const [r, g, b] = hexToRgb(hexColor);
  const brightness = getBrightness(r, g, b);
  return brightness > 128 ? "#666666" : "#dddddd";
};

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

const getBrightness = (r, g, b) => r * 0.299 + g * 0.587 + b * 0.114;
