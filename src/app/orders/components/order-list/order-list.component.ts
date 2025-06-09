import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Order } from '../../models/order.model';
import { HttpErrorResponse } from '@angular/common/http';
import { PickingResponse } from '../../models/picking-response';

@Component({
  selector: 'app-order-list',
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
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
})
export class OrderListComponent {
  displayedColumns: string[] = [
    'select',
    'nroPedido',
    'cliente',
    'estado',
    'fecha',
  ];

  orders: {
    nroPedido: string;
    cliente: string;
    estado: string;
    fecha: string;
  }[] = [];

  filtroPedido = '';
  filtroCliente = '';
  filtroFecha: Date | null = null;

  selectionMap: { [nroPedido: string]: boolean } = {};

  constructor(private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe((data: Order[]) => {
      this.orders = data.map((o) => ({
        nroPedido: o.nro_pedido,
        cliente: o.cliente,
        estado: 'PENDIENTE',
        fecha: o.fecha_pedido,
      }));
    });
  }

  get filteredOrders() {
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
    const pedidosSeleccionados = this.filteredOrders
      .filter((order) => this.selectionMap[order.nroPedido])
      .map((order) => ({ nro_pedido: order.nroPedido }));

    if (pedidosSeleccionados.length === 0) {
      alert('Por favor selecciona al menos un pedido para generar el picking.');
      return;
    }

    // ✅ Llamada al endpoint correcto: /picking/picking/
    this.orderService.generatePicking(pedidosSeleccionados).subscribe({
      next: (response: PickingResponse) => {
        alert(`✅ Picking generado: ${response.nro_picking}`);
        console.log('Respuesta completa:', response);
        // Opcional: limpiar selección
        this.selectionMap = {};
      },
      error: (error: HttpErrorResponse) => {
        alert(
          `❌ Error al generar picking: ${
            error.error.detail || 'Error desconocido'
          }`
        );
        console.error(error);
      },
    });
  }
}
