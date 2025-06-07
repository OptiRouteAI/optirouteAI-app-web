import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ComponentSidebarComponent } from './shared/components/component-sidebar/component-sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    RouterOutlet,
    ComponentSidebarComponent,
    MatSidenavModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'optiroute-ai';
}
