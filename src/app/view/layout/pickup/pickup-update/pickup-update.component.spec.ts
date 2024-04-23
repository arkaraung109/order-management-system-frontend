import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupUpdateComponent } from './pickup-update.component';

describe('PickupUpdateComponent', () => {
  let component: PickupUpdateComponent;
  let fixture: ComponentFixture<PickupUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PickupUpdateComponent]
    });
    fixture = TestBed.createComponent(PickupUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
