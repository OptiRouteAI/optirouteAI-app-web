import {Component, OnInit} from '@angular/core';
import { OrderService } from '../../services/order.service';
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
import { PickingService } from '../../../picking/services/picking.service';
import { PickingResponse } from '../../../picking/models/picking-response';
import { OrderDetailDialogComponent } from '../order-detail-dialog/order-detail-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

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
    MatDialogModule,
    MatTableModule,
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
})
export class OrderListComponent implements OnInit {
  estrategiaActiva: string = 'PK_TRAD';

  displayedColumns: string[] = [
    'select',
    'detalle',
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


  constructor(
    private orderService: OrderService,
    private pickingService: PickingService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const estrategiaGuardada = localStorage.getItem('estrategiaActiva');
    if (estrategiaGuardada) {
      this.estrategiaActiva = estrategiaGuardada;
    }

    this.orderService.getOrders().subscribe((data: Order[]) => {
      this.orders = data.map((o) => ({
        nroPedido: o.nro_pedido,
        cliente: o.cliente,
        estado: '...',
        fecha: o.fecha_pedido,
      }));


      this.orderService.getOrdersWithState().subscribe((statusData) => {
        statusData.forEach((status) => {
          const order = this.orders.find(o => o.nroPedido === status.nro_pedido);
          if (order) {
            order.estado = status.estado;
          }
        });
      });
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

    this.pickingService.generatePicking(pedidosSeleccionados).subscribe({
      next: (response: PickingResponse) => {
        alert(`✅ Picking generado: ${response.nro_picking}`);
        console.log('Respuesta completa:', response);
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

  verDetalle(nroPedido: string): void {
    this.orderService.getOrderDetails(nroPedido).subscribe({
      next: (details) => {
        this.dialog.open(OrderDetailDialogComponent, {
          data: details,
        });
      },
      error: (error) => {
        console.error('Error al obtener los detalles del pedido', error);
        alert('❌ No se pudo obtener los detalles del pedido');
      },
    });
  }
}
