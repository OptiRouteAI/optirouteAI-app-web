import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ComponentSidebarComponent } from './shared/components/component-sidebar/component-sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    RouterOutlet,
    ComponentSidebarComponent,
    MatSidenavModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'optiroute-ai';
}
