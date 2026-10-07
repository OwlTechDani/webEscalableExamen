import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCard } from './user-card';

describe('UserCard', () => {
  let component: UserCard;
  let fixture: ComponentFixture<UserCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCard],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCard);

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
