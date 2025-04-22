import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSeatingComponent } from './show-seating.component';

describe('ShowSeatingComponent', () => {
  let component: ShowSeatingComponent;
  let fixture: ComponentFixture<ShowSeatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowSeatingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowSeatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
