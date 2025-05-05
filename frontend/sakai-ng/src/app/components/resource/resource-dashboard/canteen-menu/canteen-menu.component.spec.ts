import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenMenuComponent } from './canteen-menu.component';

describe('CanteenMenuComponent', () => {
  let component: CanteenMenuComponent;
  let fixture: ComponentFixture<CanteenMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanteenMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CanteenMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
