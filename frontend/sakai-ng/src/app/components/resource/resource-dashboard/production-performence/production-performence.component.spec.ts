import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPerformenceComponent } from './production-performence.component';

describe('ProductionPerformenceComponent', () => {
  let component: ProductionPerformenceComponent;
  let fixture: ComponentFixture<ProductionPerformenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductionPerformenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductionPerformenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
