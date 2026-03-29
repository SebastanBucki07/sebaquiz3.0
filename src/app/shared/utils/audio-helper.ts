import { audioService } from '../../services/audio.service';

export const playSound = (soundKey: string) => {
  audioService.play(soundKey);
};
