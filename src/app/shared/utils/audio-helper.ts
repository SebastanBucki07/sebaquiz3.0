export const playSound = (path: string) => {
  const audio = new Audio(path);
  audio.currentTime = 0;
  audio.play().catch(() => {});
};
