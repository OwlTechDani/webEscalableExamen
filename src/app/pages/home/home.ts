import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResourceCard } from '../../components/resource-card/resource-card';
import { AuthService } from '../../services/auth.service';
import { ResourcesService } from '../../services/resources.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ResourceCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  auth = inject(AuthService);
  catalog = inject(ResourcesService);
}
