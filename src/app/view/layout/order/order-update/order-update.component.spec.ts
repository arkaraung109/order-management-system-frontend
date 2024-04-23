import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderUpdateComponent } from './order-update.component';

describe('OrderUpdateComponent', () => {
  let component: OrderUpdateComponent;
  let fixture: ComponentFixture<OrderUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderUpdateComponent]
    });
    fixture = TestBed.createComponent(OrderUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
