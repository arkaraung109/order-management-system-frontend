import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupDetailsCreateComponent } from './pickup-details-create.component';

describe('PickupDetailsCreateComponent', () => {
  let component: PickupDetailsCreateComponent;
  let fixture: ComponentFixture<PickupDetailsCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PickupDetailsCreateComponent]
    });
    fixture = TestBed.createComponent(PickupDetailsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
