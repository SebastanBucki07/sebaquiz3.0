import { TestBed } from '@angular/core/testing';
import { PointsService } from './points-service.service';
import { GameService } from './game.service';

describe('PointsService', () => {
  let service: PointsService;
  let gameServiceSpy: any;

  beforeEach(() => {


    TestBed.configureTestingModule({
      providers: [
        PointsService,
        { provide: GameService, useValue: gameServiceSpy }
      ]
    });
    service = TestBed.inject(PointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
