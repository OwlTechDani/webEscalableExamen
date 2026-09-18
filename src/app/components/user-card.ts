import { Component, Input } from '@angular/core';
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'app-user-card',
  standalone: true,
  templateUrl: './user-card.html',
  styleUrl: './user-card.css'
})
export class UserCardComponent {
  @Input({ required: true }) user!: User;
}