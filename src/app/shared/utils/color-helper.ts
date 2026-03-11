export const generateTeamColors = (count: number): string[] => {
  const colors: string[] = [];
  const baseHue = Math.floor(Math.random() * 360);
  for (let i = 0; i < count; i++) {
    const hue = (baseHue + (360 / count) * i) % 360;
    colors.push(`hsl(${hue}, 75%, 45%)`);
  }
  return colors;
};
