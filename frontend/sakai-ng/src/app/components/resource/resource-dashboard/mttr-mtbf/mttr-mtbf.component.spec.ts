import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MttrMtbfComponent } from './mttr-mtbf.component';

describe('MttrMtbfComponent', () => {
  let component: MttrMtbfComponent;
  let fixture: ComponentFixture<MttrMtbfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MttrMtbfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MttrMtbfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
