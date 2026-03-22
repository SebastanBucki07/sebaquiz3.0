import { TestBed } from '@angular/core/testing';

import { QuestionSelectorService } from './question-selector.service';

describe('QuestionSelectorService', () => {
  let service: QuestionSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
