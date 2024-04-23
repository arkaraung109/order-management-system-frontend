import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsFulfilmentHistoryComponent } from './order-details-fulfilment-history.component';

describe('OrderDetailsFulfilmentHistoryComponent', () => {
  let component: OrderDetailsFulfilmentHistoryComponent;
  let fixture: ComponentFixture<OrderDetailsFulfilmentHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderDetailsFulfilmentHistoryComponent]
    });
    fixture = TestBed.createComponent(OrderDetailsFulfilmentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
