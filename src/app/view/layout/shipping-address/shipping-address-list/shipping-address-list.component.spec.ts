import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAddressListComponent } from './shipping-address-list.component';

describe('ShippingAddressListComponent', () => {
  let component: ShippingAddressListComponent;
  let fixture: ComponentFixture<ShippingAddressListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingAddressListComponent]
    });
    fixture = TestBed.createComponent(ShippingAddressListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
