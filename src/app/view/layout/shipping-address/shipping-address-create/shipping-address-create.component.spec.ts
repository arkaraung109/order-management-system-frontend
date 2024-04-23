import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAddressCreateComponent } from './shipping-address-create.component';

describe('ShippingAddressCreateComponent', () => {
  let component: ShippingAddressCreateComponent;
  let fixture: ComponentFixture<ShippingAddressCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingAddressCreateComponent]
    });
    fixture = TestBed.createComponent(ShippingAddressCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
