import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PDCComponent } from './pdc.component';

describe('PDCComponent', () => {
  let component: PDCComponent;
  let fixture: ComponentFixture<PDCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PDCComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PDCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
