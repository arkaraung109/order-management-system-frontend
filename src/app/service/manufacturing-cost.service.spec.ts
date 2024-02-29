import { TestBed } from '@angular/core/testing';

import { ManufacturingCostService } from './manufacturing-cost.service';

describe('ManufacturingCostService', () => {
  let service: ManufacturingCostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManufacturingCostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
