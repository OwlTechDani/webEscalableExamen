import { Component, computed, inject, signal } from '@angular/core';
import { UserCard } from '../../components/user-card/user-card';
import { Control } from '../../components/control/control';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-home-page',
  imports: [UserCard, Control],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  private readonly usersService = inject(UsersService);
  private readonly searchValue = signal('');

  public readonly users = computed(() =>
    this.usersService.users().filter(user =>
      user.name.toLowerCase().includes(this.searchValue())
    )
  );

  public orderByName(): void {
    this.usersService.orderByName();
  }

  public orderById(): void {
    this.usersService.orderById();
  }

  public reverse(): void {
    this.usersService.reverse();
  }

  public deleteUser(id: number): void {
    this.usersService.deleteUser(id);
  }

  search(value: string): void {
    this.searchValue.set(value.trim().toLowerCase());
  }
}
