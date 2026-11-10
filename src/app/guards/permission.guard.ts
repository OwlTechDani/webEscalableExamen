import { CanActivateFn } from '@angular/router';

export const permissionGuard: CanActivateFn = () => {
  // Cambia este valor cuando se conecte la autorización real del usuario.
  const permisoConcedido = false;
  return permisoConcedido;
};
