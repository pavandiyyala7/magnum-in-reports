import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakdownReportComponent } from './breakdown-report.component';

describe('BreakdownReportComponent', () => {
  let component: BreakdownReportComponent;
  let fixture: ComponentFixture<BreakdownReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BreakdownReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BreakdownReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
