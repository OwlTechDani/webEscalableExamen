import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="container text-center py-5">
      <p class="display-1 fw-bold text-primary mb-0">404</p>
      <h1 class="h3">Página no encontrada</h1>
      <p class="text-secondary">La dirección que buscas no existe.</p>
      <a class="btn btn-primary" routerLink="/inicio">Volver al directorio</a>
    </section>
  `
})
export class NotFoundComponent {}
