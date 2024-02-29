import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManufacturingCostHistoryComponent } from './product-manufacturing-cost-history.component';

describe('ProductManufacturingCostHistoryComponent', () => {
  let component: ProductManufacturingCostHistoryComponent;
  let fixture: ComponentFixture<ProductManufacturingCostHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductManufacturingCostHistoryComponent]
    });
    fixture = TestBed.createComponent(ProductManufacturingCostHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
