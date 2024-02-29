import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRetailPriceHistoryComponent } from './product-retail-price-history.component';

describe('ProductRetailPriceHistoryComponent', () => {
  let component: ProductRetailPriceHistoryComponent;
  let fixture: ComponentFixture<ProductRetailPriceHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductRetailPriceHistoryComponent]
    });
    fixture = TestBed.createComponent(ProductRetailPriceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
