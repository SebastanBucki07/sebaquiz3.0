import { TestBed } from '@angular/core/testing';

import { QuestionHistoryService } from './question-history.service';

describe('QuestionHistoryService', () => {
  let service: QuestionHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
