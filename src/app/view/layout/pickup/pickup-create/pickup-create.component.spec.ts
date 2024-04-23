import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupCreateComponent } from './pickup-create.component';

describe('PickupCreateComponent', () => {
  let component: PickupCreateComponent;
  let fixture: ComponentFixture<PickupCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PickupCreateComponent]
    });
    fixture = TestBed.createComponent(PickupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
