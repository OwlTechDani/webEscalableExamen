import { Component, output } from '@angular/core';
@Component({
  selector: 'app-controls',
  imports: [],
  templateUrl: './controls.html',
  styleUrl: './controls.css',
})

export class Controls {
  // Declarar los eventos de salida
  onOrdenarNombre = output<void>();
  onOrdenarId = output<void>();
  onInvertir = output<void>();

  // Métodos que llaman los botones para emitir el evento
  ordenarPorNombre(): void {
    this.onOrdenarNombre.emit();
  }

  ordenarPorId(): void {
    this.onOrdenarId.emit();
  }

  invertir(): void {
    this.onInvertir.emit();
  }
}

