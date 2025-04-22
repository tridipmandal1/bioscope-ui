import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostLandingComponent } from './host-landing.component';

describe('HostLandingComponent', () => {
  let component: HostLandingComponent;
  let fixture: ComponentFixture<HostLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostLandingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HostLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
