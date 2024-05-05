import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfulfilledOrderListComponent } from './unfulfilled-order-list.component';

describe('UnfulfilledOrderListComponent', () => {
  let component: UnfulfilledOrderListComponent;
  let fixture: ComponentFixture<UnfulfilledOrderListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnfulfilledOrderListComponent]
    });
    fixture = TestBed.createComponent(UnfulfilledOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
