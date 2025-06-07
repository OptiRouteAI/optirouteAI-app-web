import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface Order {
  nroPedido: string;
  cliente: string;
  estado: string;
  fecha: string;
}

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css'],
})
export class OrdersPageComponent {
  displayedColumns: string[] = [
    'select',
    'nroPedido',
    'cliente',
    'estado',
    'fecha',
  ];

  orders: Order[] = [
    {
      nroPedido: 'PE00000003',
      cliente: 'TIENDAS XYZ SAC',
      estado: 'INGRESADO',
      fecha: '2025-05-14',
    },
    {
      nroPedido: 'PE00000002',
      cliente: 'SUPERMERCADO ABC',
      estado: 'EN PICKING',
      fecha: '2025-05-13',
    },
    {
      nroPedido: 'PE00000001',
      cliente: 'BODEGAS OPQ',
      estado: 'COMPLETO',
      fecha: '2025-05-13',
    },
  ];

  filtroPedido = '';
  filtroCliente = '';
  filtroFecha: Date | null = null;

  selectionMap: { [nroPedido: string]: boolean } = {};

  constructor(private router: Router) {}

  get filteredOrders(): Order[] {
    return this.orders.filter(
      (order) =>
        order.nroPedido
          .toLowerCase()
          .includes(this.filtroPedido.toLowerCase()) &&
        order.cliente
          .toLowerCase()
          .includes(this.filtroCliente.toLowerCase()) &&
        (!this.filtroFecha ||
          order.fecha === this.filtroFecha.toISOString().split('T')[0])
    );
  }

  toggleAllRows(event: any): void {
    const checked = event.checked;
    this.filteredOrders.forEach((order) => {
      this.selectionMap[order.nroPedido] = checked;
    });
  }

  isAllSelected(): boolean {
    return (
      this.filteredOrders.length > 0 &&
      this.filteredOrders.every((order) => this.selectionMap[order.nroPedido])
    );
  }

  isIndeterminate(): boolean {
    const selectedCount = this.filteredOrders.filter(
      (order) => this.selectionMap[order.nroPedido]
    ).length;
    return selectedCount > 0 && selectedCount < this.filteredOrders.length;
  }

  irAGenerarPicking() {
    this.router.navigate(['/picking']);
  }
}
