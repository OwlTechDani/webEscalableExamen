import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardComponent } from './user-card';

describe('UserCard', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);

    fixture.componentRef.setInput('user', {
      id: 1,
      name: 'Test User',
      username: 'test',
      email: 'test@example.com',
      image: 'https://i.pravatar.cc/150?img=1',
    });

    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
