import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderDetail } from '../models/order.model';
import { UrlConfigService } from '../../services/url-config-service.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient, private urlConfig: UrlConfigService) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.urlConfig.ORDER_URL);
  }

  getOrderDetails(nroPedido: string): Observable<OrderDetail[]> {
    const url = this.urlConfig.ORDER_DETAIL_URL.replace(
      '{nroPedido}',
      nroPedido
    );
    return this.http.get<OrderDetail[]>(url);
  }
}
