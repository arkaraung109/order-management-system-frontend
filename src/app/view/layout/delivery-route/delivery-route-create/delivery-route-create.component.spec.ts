import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryRouteCreateComponent } from './delivery-route-create.component';

describe('DeliveryRouteCreateComponent', () => {
  let component: DeliveryRouteCreateComponent;
  let fixture: ComponentFixture<DeliveryRouteCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryRouteCreateComponent]
    });
    fixture = TestBed.createComponent(DeliveryRouteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
