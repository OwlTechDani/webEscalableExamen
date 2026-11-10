import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ResourcesService } from './services/resources.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  auth = inject(AuthService);
  catalog = inject(ResourcesService);
  private router = inject(Router);

  search(value: string): void {
    this.catalog.search(value);
    this.router.navigate(['/home']);
  }

  filterCategory(value: string): void {
    this.catalog.category.set(value);
    this.router.navigate(['/home']);
  }

  filterTag(value: string): void {
    this.catalog.tag.set(value);
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}
