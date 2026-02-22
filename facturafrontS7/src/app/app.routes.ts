import { Routes } from '@angular/router';
import { Docente } from './components/docente/docente';
import { NuevoDocente } from './components/docente/nuevo-docente/nuevo-docente';

export const routes: Routes = [
  {
    path: '',
    component: Docente,
    pathMatch: 'full',
  },
  {
    path: 'docentes',
    component: Docente,
  },
  {
    path: 'nuevoDocente',
    component: NuevoDocente,
  },
  {
    path: 'editarDocente/:id',
    component: NuevoDocente,
  },
];
