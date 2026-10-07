import { Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly usersState = signal<User[]>(
    [{
      "id": 1,
      "name": "Leanne Graham",
      "username": "LeGra",
      "email": "legra@gmail.com",
      "image": "https://i.pravatar.cc/150?img=1"
    },
    {
      "id": 2,
      "name": "Carlos Mendoza",
      "username": "CarMen",
      "email": "cmendoza@yahoo.com",
      "image": "https://i.pravatar.cc/150?img=11"
    },
    {
      "id": 3,
      "name": "Sofia Reyes",
      "username": "SofiR",
      "email": "sreyes@hotmail.com",
      "image": "https://i.pravatar.cc/150?img=5"
    },
    {
      "id": 4,
      "name": "David Smith",
      "username": "DaveS",
      "email": "dsmith@gmail.com",
      "image": "https://i.pravatar.cc/150?img=12"
    },
    {
      "id": 5,
      "name": "Lucía Fernández",
      "username": "LuFer",
      "email": "lucia.fer@empresa.com",
      "image": "https://i.pravatar.cc/150?img=9"
    },
    {
      "id": 6,
      "name": "Mateo López",
      "username": "MattL",
      "email": "mlopez99@gmail.com",
      "image": "https://i.pravatar.cc/150?img=15"
    },
    {
      "id": 7,
      "name": "Elena Martínez",
      "username": "EleMar",
      "email": "elena.martinez@outlook.com",
      "image": "https://i.pravatar.cc/150?img=20"
    }
    ]);

  readonly users = this.usersState.asReadonly();
  private nextId = Math.max(0, ...this.users().map(user => user.id)) + 1;

  addUser(data: Omit<User, 'id'>): void {
    const user: User = { ...data, id: this.nextId++ };
    this.usersState.update(users => [...users, user]);
  }

  deleteUser(id: number): void {
    this.usersState.update(users => users.filter(user => user.id !== id));
  }

  orderByName(): void {
    this.usersState.update(users => [...users].sort((a, b) => a.name.localeCompare(b.name)));
  }

  orderById(): void {
    this.usersState.update(users => [...users].sort((a, b) => a.id - b.id));
  }

  reverse(): void {
    this.usersState.update(users => [...users].reverse());
  }
}
