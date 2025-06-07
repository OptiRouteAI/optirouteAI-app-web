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

interface Picking {
  nroPicking: string;
  estado: string;
  fechaGeneracion: string;
}

@Component({
  selector: 'app-picking-page',
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
  templateUrl: './picking-page.component.html',
  styleUrls: ['./picking-page.component.css'],
})
export class PickingPageComponent {
  displayedColumns: string[] = [
    'select',
    'icono',
    'nroPicking',
    'estado',
    'fechaGeneracion',
    'rutas',
  ];
  pickingData: Picking[] = [
    {
      nroPicking: 'PK00000002',
      estado: 'EN PROCESO',
      fechaGeneracion: '2025-05-15',
    },
    {
      nroPicking: 'PK00000001',
      estado: 'PICKING COMPLETO',
      fechaGeneracion: '2025-05-14',
    },
  ];

  filtroPicking = '';
  filtroFecha: Date | null = null;
  selectionMap: { [nro: string]: boolean } = {};

  get filteredPickings(): Picking[] {
    return this.pickingData.filter(
      (p) =>
        p.nroPicking.toLowerCase().includes(this.filtroPicking.toLowerCase()) &&
        (!this.filtroFecha ||
          p.fechaGeneracion === this.filtroFecha.toISOString().split('T')[0])
    );
  }

  toggleAllRows(event: any): void {
    const checked = event.checked;
    this.filteredPickings.forEach(
      (p) => (this.selectionMap[p.nroPicking] = checked)
    );
  }

  isAllSelected(): boolean {
    return this.filteredPickings.every((p) => this.selectionMap[p.nroPicking]);
  }

  isIndeterminate(): boolean {
    const count = this.filteredPickings.filter(
      (p) => this.selectionMap[p.nroPicking]
    ).length;
    return count > 0 && count < this.filteredPickings.length;
  }

  imprimir(picking: Picking) {
    const nroPedido = 'PE00000002';
    const cliente = 'SUPERMERCADO ABC';
    const detalle = [
      ['SKU_A', 'Lorem ipsum dolor sit amet', 'X', 'CJ', 'ABC.XS.03'],
      ['SKU_B', 'Jorem ipsum consectetur adipisci.', 'Y', 'CJ', 'ABC.XP.01'],
    ];

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('CONSOLIDADO DE PICKING', 105, 20, { align: 'center' });

    autoTable(doc, {
      startY: 30,
      head: [['Nro Pedido', 'Cliente']],
      body: [[nroPedido, cliente]],
      styles: { halign: 'left' },
    });

    autoTable(doc, {
      startY: 50,
      head: [
        [
          'Código Artículo',
          'Descripción del Artículo',
          'Cantidad',
          'UM',
          'Ubicación',
        ],
      ],
      body: detalle,
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    doc.text('Total: X+Y', 180, finalY + 10, { align: 'right' });

    doc.save(`picking-${picking.nroPicking}.pdf`);
  }
}
