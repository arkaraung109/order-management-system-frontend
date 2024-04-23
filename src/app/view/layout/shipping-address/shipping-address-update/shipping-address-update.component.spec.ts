import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAddressUpdateComponent } from './shipping-address-update.component';

describe('ShippingAddressUpdateComponent', () => {
  let component: ShippingAddressUpdateComponent;
  let fixture: ComponentFixture<ShippingAddressUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingAddressUpdateComponent]
    });
    fixture = TestBed.createComponent(ShippingAddressUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
