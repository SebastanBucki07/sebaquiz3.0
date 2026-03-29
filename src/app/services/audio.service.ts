export class AudioService {
  private sounds: Record<string, HTMLAudioElement> = {};

  private readonly SOUND_MAP: Record<string, string> = {
    correct: '/sounds/correct.mp3',
    wrong: '/sounds/wrong.mp3',
    '1z10zle': '/sounds/1z10zle.mp3',
    '1z10dobrzee': '/sounds/1z10dobrzee.mp3',
  };

  constructor() {
    this.preload();
  }

  private preload(): void {
    Object.entries(this.SOUND_MAP).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.load();
      this.sounds[key] = audio;
    });
  }

  public play(key: string): void {
    const sound = this.sounds[key];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    } else {
      console.warn(`AudioService: Dźwięk o kluczu "${key}" nie został znaleziony.`);
    }
  }
}

export const audioService = new AudioService();
