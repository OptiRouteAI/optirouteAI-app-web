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

  /**
   * Obtener todos los pedidos
   */
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.urlConfig.ORDER_URL);
  }

  /**
   * Obtener detalles de un pedido por su número
   */
  getOrderDetails(nroPedido: string): Observable<OrderDetail[]> {
    const url = this.urlConfig.ORDER_DETAIL_URL.replace(
      '{nroPedido}',
      nroPedido
    );
    return this.http.get<OrderDetail[]>(url);
  }

  /**
   * Obtener el estado de los pedidos
   */
  getOrdersWithState(): Observable<any[]> {
    return this.http.get<any[]>(this.urlConfig.ORDER_STATUS_URL);
  }

}
