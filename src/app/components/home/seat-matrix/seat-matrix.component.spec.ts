import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatMatrixComponent } from './seat-matrix.component';

describe('SeatMatrixComponent', () => {
  let component: SeatMatrixComponent;
  let fixture: ComponentFixture<SeatMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatMatrixComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeatMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
