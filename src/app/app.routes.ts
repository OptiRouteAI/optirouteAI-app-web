import { Routes } from '@angular/router';
import { OrdersPageComponent } from './orders/pages/orders-page/orders-page.component';
import { SettingsPageComponent } from './settings/pages/settings-page/settings-page.component';
import { PickingPageComponent } from './picking/pages/picking-page/picking-page.component';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { LoginComponent  } from './login/login.component';

export const routes: Routes = [

 /* { path: 'home', redirectTo: '/login', pathMatch: 'full' }, // O a '/home' si tienes una página pública de inicio
  { path: 'login', component: LoginComponent },*/
  // ... otras rutas protegidas

  { path: 'login', component: LoginComponent},
  { path: 'home', component: HomePageComponent },
  { path: 'configurations', component: SettingsPageComponent },
  { path: 'orders', component: OrdersPageComponent },
  { path: 'picking', component: PickingPageComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
