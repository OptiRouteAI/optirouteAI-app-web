import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly API_URL = 'http://127.0.0.1:8000/purchase/purchase-order/';

  constructor(private http: HttpClient) {}

  /**
   * GET /purchase/purchase-order/
   * Obtiene la lista de pedidos desde el backend
   */
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.API_URL);
  }
}
