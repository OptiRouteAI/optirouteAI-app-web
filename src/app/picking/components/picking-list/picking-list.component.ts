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

  // Método para imprimir el picking y generar el PDF
  imprimir(picking: PickingResponse) {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('CONSOLIDADO DE PICKING', 105, 20, { align: 'center' });

    this.pickingService.getPickingRoutes(picking.nro_picking).subscribe({
      next: (rutaResponse) => {
        const rutas = rutaResponse.rutas;

        autoTable(doc, {
          startY: 30,
          head: [['Nro Pedido', 'Cliente']],
          body: rutas.map((ruta: Ruta) => [ruta.nro_pedido, ruta.cliente]),
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 50 },
          },
          styles: {
            cellPadding: 5,
            fontSize: 12,
            halign: 'center',
            valign: 'middle',
          },
        });

        const detalles = rutas.flatMap((ruta: Ruta) =>
          ruta.detalles.map((d) => ({
            cod_lpn: d.cod_articulo,
            descripcion: d.descripcion,
            cantidad: d.cantidad,
            um: d.um,
            ubicacion: d.ubicacion,
          }))
        );

        autoTable(doc, {
          startY: 80, // Ajusta la posición vertical
          head: [
            ['Código Artículo', 'Descripción', 'Cantidad', 'UM', 'Ubicación'],
          ],
          body: detalles.map((d: any) => [
            d.cod_lpn,
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

          styles: {
            cellPadding: 5,
            fontSize: 12,
            halign: 'center',
            valign: 'middle',
          },
        });

        const finalY = (doc as any).lastAutoTable.finalY;
        const total = detalles.reduce(
          (sum: number, d: any) => sum + d.cantidad,
          0
        );
        doc.text(`Total: ${total}`, 180, finalY + 10, { align: 'right' });

        doc.save(`picking-${picking.nro_picking}.pdf`);
      },
      error: (error) => {
        alert('❌ Error al obtener las rutas del picking');
        console.error(error);
      },
    });
  }
}
