import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryRouteDetailsComponent } from './delivery-route-details.component';

describe('DeliveryRouteDetailsComponent', () => {
  let component: DeliveryRouteDetailsComponent;
  let fixture: ComponentFixture<DeliveryRouteDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryRouteDetailsComponent]
    });
    fixture = TestBed.createComponent(DeliveryRouteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
