import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Observable, Subscription } from 'rxjs';
import { Question } from '../../../../shared/questions/question.interface';
import { QuestionService } from '../../../../shared/question-service.service';
import {MusicTipsComponent} from '../question/music-tips/music-tips.component';

declare const YT: {
  Player: new (
    elementId: string,
    options: {
      height: string;
      width: string;
      videoId: string;
      playerVars?: Record<string, string | number | boolean>;
    }
  ) => {
    playVideo: () => void;
    stopVideo: () => void;
    destroy: () => void;
    getDuration: () => number;
    seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  };
};


@Component ({
  selector: 'app-music-category',
  standalone: true,
  imports: [CommonModule, MusicTipsComponent],
  templateUrl: './music-category.component.html',
  styleUrl: './music-category.component.css'
})
export class MusicCategoryComponent implements OnInit, OnDestroy {

  question$!: Observable<Question | null>;
  // @ts-ignore
  private player?: ReturnType<typeof YT.Player>;
  private questionSub?: Subscription;
  answersVisible = false;

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.question$ = this.questionService.question$;

    this.loadYouTubeApi().then(() => {
      this.questionSub = this.question$.subscribe(question => {
        if (!question) return;
        this.initPlayer(question.question);
      });
    });
  }

  ngOnDestroy(): void {
    this.player?.destroy();
    this.questionSub?.unsubscribe();
  }

  showAnswers(): void {
    this.answersVisible = true;
  }

// =========================
// Odtwarzanie fragmentów
// =========================

  playIntro(): void {
    this.playFragment(15);
  }

  playMiddle(): void {
    if (!this.player) return;
    const duration = this.player.getDuration();
    if (!duration || duration < 60) {
// fallback
      this.playFragment(10);
      return;
    }
    const middleMin = 30;
    const middleMax = duration - 60;
    const start = Math.floor(Math.random() * (middleMax - middleMin)) + middleMin;
    this.playFragment(start);
  }

  playOutro(): void {
    if (!this.player) return;
    const duration = this.player.getDuration();
    const start = duration ? Math.max(duration - 30, 0) : 0;
    this.playFragment(start);
  }

  private playFragment(start: number, fragmentDuration = 30): void {
    if (!this.player) return;

    this.player.seekTo(start, true);
    this.player.playVideo();

    setTimeout(() => {
      this.player.stopVideo();
    }, fragmentDuration * 1000);
  }

// =========================
// prywatne metody
// =========================

  private initPlayer(videoId: string): void {
    this.player?.destroy();

    this.player = new YT.Player('player', {
      height: '0',
      width: '0',
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0
      }
    });
  }

  private loadYouTubeApi(): Promise<void> {
    return new Promise(resolve => {
      if ((window as any).YT?.Player) {
        resolve();
        return;
      }

      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);

      (window as any).onYouTubeIframeAPIReady = () => resolve();
    });
  }
}
