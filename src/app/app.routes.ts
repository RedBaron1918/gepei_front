import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'meal/:id',
    loadComponent: () =>
      import('./pages/meal-detail/meal-detail.component').then(
        (m) => m.MealDetailComponent
      ),
  },
  {
    path: 'meals/:id/edit',
    loadComponent: () =>
      import('./pages/meal-edit/meal-edit.component').then(
        (m) => m.MealEditComponent
      ),
  },
  {
    path: 'user/meals',
    loadComponent: () =>
      import('./pages/user-meals/user-meals.component').then(
        (m) => m.UserMealsComponent
      ),
  },

  {
    path: 'create',
    loadComponent: () =>
      import('./pages/meal-form/meal-form.component').then((m) => m.MealFormComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(
        (m) => m.ContactComponent
      ),
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth/auth.component').then((m) => m.AuthComponent),
  },
];
