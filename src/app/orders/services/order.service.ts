import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  //private readonly API_URL = 'http://127.0.0.1:8000/purchase/purchase-order/';
  private readonly API_URL = 'http://127.0.0.1:8000/orders';

  constructor(private http: HttpClient) {}

  /**
   * GET /orders
   * Obtiene la lista de órdenes desde el servidor mock
   */
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.API_URL);
  }
}
