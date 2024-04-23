import { TestBed } from '@angular/core/testing';

import { DeliveryRouteService } from './delivery-route.service';

describe('DeliveryRouteService', () => {
  let service: DeliveryRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
