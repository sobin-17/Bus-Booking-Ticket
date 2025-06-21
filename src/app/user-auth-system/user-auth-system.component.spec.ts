import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuthSystemComponent } from './user-auth-system.component';

describe('UserAuthSystemComponent', () => {
  let component: UserAuthSystemComponent;
  let fixture: ComponentFixture<UserAuthSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAuthSystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAuthSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
