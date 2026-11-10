import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ResourceDetail } from './pages/resource-detail/resource-detail';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ResourceForm } from './pages/resource-form/resource-form';
import { AdminPanel } from './pages/admin-panel/admin-panel';

export const routes: Routes = [
  { path: 'directory', loadComponent: () => import('./pages/directory/directory').then(m => m.Directory), title: 'Directorio — FreeHub' },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home, title: 'Browse — FreeHub' },
  { path: 'login', component: Login, title: 'Login — FreeHub' },
  { path: 'register', component: Register, title: 'Register — FreeHub' },
  {
    path: 'resources/new',
    component: ResourceForm,
    title: 'Add resource — FreeHub',
  },
  {
    path: 'resources/:id',
    component: ResourceDetail,
    title: 'Resource — FreeHub',
  },
  {
    path: 'admin',
    component: AdminPanel,
    title: 'Admin panel — FreeHub',
  },
  { path: '**', redirectTo: 'home' },
];
