import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OEEReportComponent } from './oee-report.component';

describe('OEEReportComponent', () => {
  let component: OEEReportComponent;
  let fixture: ComponentFixture<OEEReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OEEReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OEEReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
