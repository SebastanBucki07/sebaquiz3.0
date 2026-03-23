import { TestBed } from '@angular/core/testing';

import { QuestionEnricherService } from './question-enricher.service';

describe('QuestionEnricherService', () => {
  let service: QuestionEnricherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionEnricherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
