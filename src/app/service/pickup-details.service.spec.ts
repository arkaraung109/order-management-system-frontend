import { TestBed } from '@angular/core/testing';

import { PickupDetailsService } from './pickup-details.service';

describe('PickupDetailsService', () => {
  let service: PickupDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PickupDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
