import { Component, input, output } from '@angular/core';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
})
export class UserCard {
  public user = input.required<User>();

  public deleteClick = output<number>();

  public delete(): void {
    this.deleteClick.emit(this.user().id);
  }

}
