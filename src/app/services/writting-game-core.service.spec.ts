import { TestBed } from '@angular/core/testing';
import {WritingGameCoreService} from './writting-game-core.service';


describe('WritingGameCoreService', () => {
  let service: WritingGameCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WritingGameCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
