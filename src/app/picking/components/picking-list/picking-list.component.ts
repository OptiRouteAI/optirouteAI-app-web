import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PickingService } from '../../services/picking.service';
import { PickingResponse, Ruta } from '../../models/picking-response';

@Component({
  selector: 'app-picking-list',
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
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './picking-list.component.html',
  styleUrls: ['./picking-list.component.css'],
})
export class PickingListComponent {
  displayedColumns: string[] = [
    'select',
    'icono',
    'nroPicking',
    'estado',
    'fechaGeneracion',
    'rutas',
  ];

  pickingData: PickingResponse[] = [];
  filtroPicking = '';
  filtroFecha: Date | null = null;
  selectionMap: { [nro: string]: boolean } = {};

  constructor(private pickingService: PickingService) {}

  ngOnInit(): void {
    this.pickingService.getPickings().subscribe((data) => {
      this.pickingData = data;
    });
  }

  eliminarPicking(nroPicking: string): void {
    if (confirm('¿Estás seguro de que deseas cancelar este picking?')) {
      this.pickingService.cancelPicking(nroPicking).subscribe({
        next: () => {
          alert('Picking cancelado con éxito.');
          // Actualizamos el estado del picking sin eliminarlo de la lista
          const picking = this.pickingData.find(p => p.nro_picking === nroPicking);
          if (picking) {
            picking.estado = 'CANCELADO'; // Cambiar el estado a 'CANCELADO'
          }
        },
        error: (error) => {
          alert('❌ Error al cancelar el picking');
          console.error(error);
        },
      });
    }
  }


  get filteredPickings(): PickingResponse[] {
    return this.pickingData.filter(
      (p) =>
        p.nro_picking
          .toLowerCase()
          .includes(this.filtroPicking.toLowerCase()) &&
        (!this.filtroFecha ||
          p.fecha_generacion === this.filtroFecha.toISOString().split('T')[0])
    );
  }

  toggleAllRows(event: any): void {
    const checked = event.checked;
    this.filteredPickings.forEach(
      (p) => (this.selectionMap[p.nro_picking] = checked)
    );
  }

  isAllSelected(): boolean {
    return this.filteredPickings.every((p) => this.selectionMap[p.nro_picking]);
  }

  isIndeterminate(): boolean {
    const count = this.filteredPickings.filter(
      (p) => this.selectionMap[p.nro_picking]
    ).length;
    return count > 0 && count < this.filteredPickings.length;
  }

  imprimir(picking: PickingResponse) {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('CONSOLIDADO DE PICKING', 105, 20, { align: 'center' });

    this.pickingService.getPickingRoutes(picking.nro_picking).subscribe({
      next: (rutaResponse) => {
        const rutas: any[] = rutaResponse.rutas;
        let currentY = 30;

        rutas.forEach((ruta: any) => {
          doc.setFontSize(12);
          doc.text(
            `Pedido: ${ruta.nro_pedido}    Cliente: ${ruta.cliente}`,
            15,
            currentY
          );
          currentY += 8;

          autoTable(doc, {
            startY: currentY,
            head: [
              ['Código Artículo', 'Descripción', 'Cantidad', 'UM', 'Ubicación'],
            ],
            body: ruta.detalles.map((d: any) => [
              d.cod_articulo,
              d.descripcion,
              d.cantidad,
              d.um,
              d.ubicacion,
            ]),
            columnStyles: {
              0: { cellWidth: 30 },
              1: { cellWidth: 60 },
              2: { cellWidth: 30 },
              3: { cellWidth: 20 },
              4: { cellWidth: 50 },
            },
            headStyles: {
              fillColor: [41, 128, 185],
              textColor: 255,
              halign: 'center',
              fontStyle: 'bold',
              fontSize: 11,
            },
            bodyStyles: {
              halign: 'center',
              fontSize: 10,
            },
            styles: {
              cellPadding: 5,
            },
            didDrawPage: (data: any) => {
              if (data.cursor) {
                currentY = data.cursor.y + 10;
              }
            },
          });
        });

        // Total general
        const total = rutas
          .flatMap((r: any) => r.detalles)
          .reduce((sum: number, d: any) => sum + d.cantidad, 0);

        doc.setFontSize(11);
        doc.text(`Total general: ${total}`, 180, currentY, { align: 'right' });
        doc.save(`picking-${picking.nro_picking}.pdf`);
      },
      error: (error) => {
        alert('❌ Error al obtener las rutas del picking');
        console.error(error);
      },
    });
  }
}
