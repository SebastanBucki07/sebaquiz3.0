import { Observable, Subscription, filter } from 'rxjs';
import { QuestionService } from '../../../../shared/question-service.service';
import { MusicTipsComponent } from '../question/music-tips/music-tips.component';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Hint } from '../../../../shared/models/category/hint.interface';

@Component({
  selector: 'app-music-category',
  standalone: true,
  imports: [CommonModule, MusicTipsComponent],
  templateUrl: './music-category.component.html',
  styleUrl: './music-category.component.css',
})
export class MusicCategoryComponent implements OnInit, OnDestroy {
  @Output() hintUsed = new EventEmitter<Hint>();
  question$!: Observable<any>;
  private questionSub?: Subscription;

  videoError = false;
  answersVisible = false;
  iframeSrc: SafeResourceUrl;

  private currentTimeout: any;
  private readonly FRAGMENT_DURATION = 15;

  constructor(
    private questionService: QuestionService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
  }

  ngOnInit(): void {
    this.question$ = this.questionService.question$;
    this.questionSub = this.question$.pipe(filter((q) => !!q)).subscribe((question) => {
      this.loadNewVideo(question.question);
    });
  }

  ngOnDestroy(): void {
    this.questionSub?.unsubscribe();
    if (this.currentTimeout) clearTimeout(this.currentTimeout);
  }

  private loadNewVideo(videoId: string): void {
    if (this.currentTimeout) clearTimeout(this.currentTimeout);
    this.answersVisible = false;
    this.videoError = false;

    // Generujemy URL embed. Parametr rel=0 i enablejsapi=1 są kluczowe dla kontroli.
    const url = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=0&controls=0&rel=0&origin=${window.location.origin}`;
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.cdr.detectChanges();
  }

  playIntro(): void {
    this.playFromTo(5, this.FRAGMENT_DURATION);
  }

  playMiddle(): void {
    // Przeskok do 60 sekundy
    this.playFromTo(60, this.FRAGMENT_DURATION);
  }

  playOutro(): void {
    // Przeskok do 150 sekundy (zakładając średnią długość piosenki)
    this.playFromTo(150, this.FRAGMENT_DURATION);
  }

  private playFromTo(start: number, duration: number): void {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
    }

    // Najpierw przewijamy, potem puszczamy
    this.sendCommand('seekTo', [start, true]);
    this.sendCommand('playVideo');

    // Odliczamy czas do pauzy
    this.currentTimeout = setTimeout(() => {
      this.sendCommand('pauseVideo');
    }, duration * 1000);
  }

  private sendCommand(func: string, args: any[] = []): void {
    const iframe = document.getElementById('music-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: func,
          args: args,
        }),
        '*'
      );
    }
  }

  onHintUsed(hint: Hint): void {
    this.hintUsed.emit(hint);
  }
}
