import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfulfilledOrderComponent } from './unfulfilled-order.component';

describe('UnfulfilledOrderComponent', () => {
  let component: UnfulfilledOrderComponent;
  let fixture: ComponentFixture<UnfulfilledOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnfulfilledOrderComponent]
    });
    fixture = TestBed.createComponent(UnfulfilledOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
