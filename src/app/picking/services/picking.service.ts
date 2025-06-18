import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PickingResponse } from '../models/picking-response';
import { UrlConfigService } from '../../services/url-config-service.service';

@Injectable({
  providedIn: 'root',
})
export class PickingService {
  constructor(private http: HttpClient, private urlConfig: UrlConfigService) {}

  generatePicking(
    pedidos: { nro_pedido: string }[]
  ): Observable<PickingResponse> {
    return this.http.post<PickingResponse>(this.urlConfig.PICKING_URL, {
      pedidos,
    });
  }

  getPickings(): Observable<PickingResponse[]> {
    return this.http.get<PickingResponse[]>(this.urlConfig.PICKING_URL);
  }

  getPickingRoutes(nro_picking: string): Observable<any> {
    const url = `${this.urlConfig.PICKING_ROUTE_URL}${nro_picking}`;
    return this.http.get<any>(url);
  }

  cancelPicking(nro_picking: string): Observable<any> {
    const url = this.urlConfig.CANCEL_PICKING_URL.replace(
      '{nro_picking}',
      nro_picking
    );
    return this.http.put<any>(url, {});
  }
}
