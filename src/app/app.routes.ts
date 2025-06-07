import { Routes } from '@angular/router';
import { OrdersPageComponent } from './orders/pages/orders-page/orders-page.component';
import { SettingsPageComponent } from './settings/pages/settings-page/settings-page.component';
import { PickingPageComponent } from './picking/pages/picking-page/picking-page.component';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'configurations', component: SettingsPageComponent },
  { path: 'orders', component: OrdersPageComponent },
  { path: 'picking', component: PickingPageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
