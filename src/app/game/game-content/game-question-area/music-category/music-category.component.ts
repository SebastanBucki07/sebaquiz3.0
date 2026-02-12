import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Observable, Subscription } from 'rxjs';
import { Question } from '../../../../shared/questions/question.interface';
import { QuestionService } from '../../../../shared/question-service.service';
import {MusicTipsComponent} from '../question/music-tips/music-tips.component';
import {Hint} from '../../../../shared/category/category.interface';

declare const YT: {
  Player: new (
    elementId: string,
    options: {
      height: string;
      width: string;
      videoId: string;
      playerVars?: Record<string, string | number | boolean>;
      events?: {
        onReady?: (event: any) => void;
      };
    }
  ) => {
    loadVideoById: (options: {
      videoId: string;
      startSeconds?: number;
      endSeconds?: number;
    }) => void;
    getDuration: () => number;
    destroy: () => void;
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
  @Output() hintUsed = new EventEmitter<Hint>();
  question$!: Observable<Question | null>;
  // @ts-ignore
  private player?: ReturnType<typeof YT.Player>;
  private questionSub?: Subscription;
  private fragmentCheckInterval?: any;
  private currentVideoId?: string;
  private readonly FRAGMENT_DURATION = 15;
  private videoDuration = 0;

  answersVisible = false;
  private playerReady = false;

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
    this.playerReady = false;
    this.questionSub?.unsubscribe();

    if (this.fragmentCheckInterval) {
      clearInterval(this.fragmentCheckInterval);
    }
  }

  showAnswers(): void {
    this.answersVisible = true;
  }

// =========================
// Odtwarzanie fragmentów
// =========================

  playIntro(): void {
    const SAFE_OFFSET = 5;

    if (!this.playerReady) {
      const checkReady = setInterval(() => {
        if (this.playerReady) {
          clearInterval(checkReady);
          this.playFragment(SAFE_OFFSET);
        }
      }, 100);
      return;
    }

    this.playFragment(SAFE_OFFSET);
  }




  playMiddle(): void {
    if (!this.videoDuration) return;

    const min = this.FRAGMENT_DURATION;
    const max = this.videoDuration - this.FRAGMENT_DURATION * 2;

    if (max <= min) {
      // jeśli piosenka za krótka
      this.playFragment(this.FRAGMENT_DURATION);
      return;
    }

    const start = Math.floor(Math.random() * (max - min)) + min;

    this.playFragment(start);
  }


  playOutro(): void {
    if (!this.videoDuration) return;

    const SAFE_OFFSET = 5;

    const start = Math.max(
      this.videoDuration - this.FRAGMENT_DURATION - SAFE_OFFSET,
      0
    );

    this.playFragment(start);
  }



  private playFragment(start: number): void {
    if (!this.player || !this.currentVideoId) return;

    this.player.loadVideoById({
      videoId: this.currentVideoId,
      startSeconds: start,
      endSeconds: start + this.FRAGMENT_DURATION
    });
  }





// =========================
// prywatne metody
// =========================

  private initPlayer(videoId: string): void {
    this.currentVideoId = videoId;
    this.videoDuration = 0;

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
      },
      events: {
        onReady: () => {
          this.videoDuration = this.player?.getDuration() ?? 0;
          this.playerReady = true;
          console.log('Duration:', this.videoDuration);
        }
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

  onHintUsed(hint: Hint): void {
    console.log('FORWARDING HINT FROM MUSIC', hint);
    this.hintUsed.emit(hint);
  }


}
