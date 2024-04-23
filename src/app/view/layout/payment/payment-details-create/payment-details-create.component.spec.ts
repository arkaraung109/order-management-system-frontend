import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailsCreateComponent } from './payment-details-create.component';

describe('PaymentDetailsCreateComponent', () => {
  let component: PaymentDetailsCreateComponent;
  let fixture: ComponentFixture<PaymentDetailsCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentDetailsCreateComponent]
    });
    fixture = TestBed.createComponent(PaymentDetailsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
