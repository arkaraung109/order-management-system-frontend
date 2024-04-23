import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryRouteUpdateComponent } from './delivery-route-update.component';

describe('DeliveryRouteUpdateComponent', () => {
  let component: DeliveryRouteUpdateComponent;
  let fixture: ComponentFixture<DeliveryRouteUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryRouteUpdateComponent]
    });
    fixture = TestBed.createComponent(DeliveryRouteUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
