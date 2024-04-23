import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryRouteComponent } from './delivery-route.component';

describe('DeliveryRouteComponent', () => {
  let component: DeliveryRouteComponent;
  let fixture: ComponentFixture<DeliveryRouteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryRouteComponent]
    });
    fixture = TestBed.createComponent(DeliveryRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
