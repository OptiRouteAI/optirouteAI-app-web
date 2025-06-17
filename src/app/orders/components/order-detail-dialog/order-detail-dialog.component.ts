import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderDetail } from '../../models/order.model';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-order-detail-dialog',
  imports: [MatTableModule],
  templateUrl: './order-detail-dialog.component.html',
  styleUrl: './order-detail-dialog.component.css',
})
export class OrderDetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: OrderDetail[]) {}
}
