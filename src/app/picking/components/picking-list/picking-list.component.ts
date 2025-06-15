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
import { PickingResponse } from '../../models/picking-response';

interface Picking {
  nroPicking: string;
  estado: string;
  fechaGeneracion: string;
}

@Component({
  selector: 'app-picking-list',
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
  styleUrl: './picking-list.component.css',
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

  /*ngOnInit(): void {
    this.pickingService.getPickings().subscribe((data) => {
      this.pickingData = data;
    });
  }*/
  ngOnInit(): void {
    this.pickingService.getPickings().subscribe((data) => {
      this.pickingData = data.map((p) => ({
        ...p,
        detalles:
          p.detalles && p.detalles.length > 0
            ? p.detalles
            : [
                {
                  cod_lpn: 'DEMO123',
                  cantidad: 5,
                  um: 'CJ',
                  ubicacion: 'A1-B1',
                },
                {
                  cod_lpn: 'DEMO456',
                  cantidad: 8,
                  um: 'CJ',
                  ubicacion: 'C2-D4',
                },
              ],
      }));
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

  /*imprimir(picking: PickingResponse) {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('CONSOLIDADO DE PICKING', 105, 20, { align: 'center' });

    autoTable(doc, {
      startY: 30,
      head: [['Nro Picking', 'Fecha', 'Estado']],
      body: [
        [
          picking.nro_picking,
          picking.fecha_generacion,
          picking.estado === 'EP'
            ? 'EN PROCESO'
            : picking.estado === 'PC'
            ? 'PICKING COMPLETO'
            : picking.estado,
        ],
      ],
    });

    autoTable(doc, {
      startY: 50,
      head: [['Código Artículo', 'Cantidad', 'UM', 'Ubicación']],
      body: picking.detalles.map((d) => [
        d.cod_lpn,
        d.cantidad,
        d.um,
        d.ubicacion,
      ]),
    });

    const finalY = (doc as any).lastAutoTable.finalY;
    const total = picking.detalles.reduce((sum, d) => sum + d.cantidad, 0);
    doc.text(`Total: ${total}`, 180, finalY + 10, { align: 'right' });

    doc.save(`picking-${picking.nro_picking}.pdf`);
  }*/
  imprimir(picking: PickingResponse) {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('CONSOLIDADO DE PICKING', 105, 20, { align: 'center' });

    autoTable(doc, {
      startY: 30,
      head: [['Nro Picking', 'Fecha', 'Estado']],
      body: [
        [
          picking.nro_picking,
          picking.fecha_generacion,
          picking.estado === 'EP'
            ? 'EN PROCESO'
            : picking.estado === 'PC'
            ? 'PICKING COMPLETO'
            : picking.estado,
        ],
      ],
    });

    const detalles =
      picking.detalles && picking.detalles.length > 0
        ? picking.detalles
        : [
            { cod_lpn: 'DEMO123', cantidad: 5, um: 'CJ', ubicacion: 'A1-B1' },
            { cod_lpn: 'DEMO456', cantidad: 8, um: 'CJ', ubicacion: 'C2-D4' },
          ];

    autoTable(doc, {
      startY: 50,
      head: [['Código Artículo', 'Cantidad', 'UM', 'Ubicación']],
      body: detalles.map((d) => [d.cod_lpn, d.cantidad, d.um, d.ubicacion]),
    });

    const finalY = (doc as any).lastAutoTable.finalY;
    const total = detalles.reduce((sum, d) => sum + d.cantidad, 0);
    doc.text(`Total: ${total}`, 180, finalY + 10, { align: 'right' });

    doc.save(`picking-${picking.nro_picking}.pdf`);
  }
}
