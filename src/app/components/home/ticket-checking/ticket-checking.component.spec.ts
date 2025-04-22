import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCheckingComponent } from './ticket-checking.component';

describe('TicketCheckingComponent', () => {
  let component: TicketCheckingComponent;
  let fixture: ComponentFixture<TicketCheckingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketCheckingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketCheckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
