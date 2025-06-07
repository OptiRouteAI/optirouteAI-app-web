import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-component-sidebar',
  imports: [MatListModule, MatIconModule, RouterModule],
  templateUrl: './component-sidebar.component.html',
  styleUrl: './component-sidebar.component.css',
})
export class ComponentSidebarComponent {}
