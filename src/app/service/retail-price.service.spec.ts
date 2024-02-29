import { TestBed } from '@angular/core/testing';

import { RetailPriceService } from './retail-price.service';

describe('RetailPriceService', () => {
  let service: RetailPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetailPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
