import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupDetailsComponent } from './pickup-details.component';

describe('PickupDetailsComponent', () => {
  let component: PickupDetailsComponent;
  let fixture: ComponentFixture<PickupDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PickupDetailsComponent]
    });
    fixture = TestBed.createComponent(PickupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
