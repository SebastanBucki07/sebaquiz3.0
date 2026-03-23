import { TestBed } from '@angular/core/testing';

import { HintProviderService } from './hint-provider.service';

describe('HintProviderService', () => {
  let service: HintProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HintProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
