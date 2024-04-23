import { TestBed } from '@angular/core/testing';

import { DeliveryRouteDetailsService } from './delivery-route-details.service';

describe('DeliveryRouteDetailsService', () => {
  let service: DeliveryRouteDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryRouteDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
