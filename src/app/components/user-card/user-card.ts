import { Component, input,output } from '@angular/core';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css'
})
export class UserCardComponent {
  // Input requerido recibido desde el componente padre
  user = input.required<User>();

  eliminar = output<number>();

  eliminarUsuario(): void {
  this.eliminar.emit(this.user().id);
  }
}