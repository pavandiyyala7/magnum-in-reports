import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheduledActualComponent } from './sheduled-actual.component';

describe('SheduledActualComponent', () => {
  let component: SheduledActualComponent;
  let fixture: ComponentFixture<SheduledActualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SheduledActualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SheduledActualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
