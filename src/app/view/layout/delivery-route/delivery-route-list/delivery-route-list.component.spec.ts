import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryRouteListComponent } from './delivery-route-list.component';

describe('DeliveryRouteListComponent', () => {
  let component: DeliveryRouteListComponent;
  let fixture: ComponentFixture<DeliveryRouteListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryRouteListComponent]
    });
    fixture = TestBed.createComponent(DeliveryRouteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
