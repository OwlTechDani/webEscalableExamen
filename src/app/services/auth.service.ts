import { Injectable, signal } from '@angular/core';

import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  users: User[] = [
    { id: 1, name: 'Demo user', email: 'user@freehub.demo', role: 'user' },
    { id: 2, name: 'Demo admin', email: 'admin@freehub.demo', role: 'admin' },
  ];

  private currentUser = signal<User | null>(null);

  user = this.currentUser.asReadonly();

  selectProfile(role: 'user' | 'admin'): void {
    const selectedUser = this.users.find((user) => user.role === role);

    if (selectedUser) {
      this.currentUser.set(selectedUser);
    }
  }

  logout(): void {
    this.currentUser.set(null);
  }
}
