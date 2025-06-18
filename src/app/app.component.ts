import { Component, OnInit} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ComponentSidebarComponent } from './shared/components/component-sidebar/component-sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    RouterOutlet,
    CommonModule,
    ComponentSidebarComponent,
    MatSidenavModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent implements OnInit{
  title = 'optiroute-ai';
  showAppLayout = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showAppLayout = !event.urlAfterRedirects.includes('/login');
      // Puedes añadir un console.log para depurar si la variable cambia
      console.log('Ruta actual:', event.urlAfterRedirects, 'Show Layout:', this.showAppLayout);
    });
  }
}
