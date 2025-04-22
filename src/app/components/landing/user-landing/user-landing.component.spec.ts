import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLandingComponent } from './user-landing.component';

describe('UserLandingComponent', () => {
  let component: UserLandingComponent;
  let fixture: ComponentFixture<UserLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLandingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
