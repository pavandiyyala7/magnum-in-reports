import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorSupervisorPerformanceComponent } from './operator-supervisor-performance.component';

describe('OperatorSupervisorPerformanceComponent', () => {
  let component: OperatorSupervisorPerformanceComponent;
  let fixture: ComponentFixture<OperatorSupervisorPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperatorSupervisorPerformanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperatorSupervisorPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
