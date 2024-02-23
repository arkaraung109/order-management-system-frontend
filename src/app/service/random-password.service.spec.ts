import { TestBed } from '@angular/core/testing';

import { RandomPasswordService } from './random-password.service';

describe('RandomPasswordService', () => {
  let service: RandomPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
