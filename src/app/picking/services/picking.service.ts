import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PickingResponse } from '../models/picking-response';
import { PickingResumen } from '../models/picking.resumen';

@Injectable({
  providedIn: 'root',
})
export class PickingService {
  private readonly PICKING_URL = 'http://127.0.0.1:8000/picking/picking/';

  constructor(private http: HttpClient) {}

  /**
   * POST /picking/picking/
   * Genera un picking a partir de pedidos seleccionados
   */
  generatePicking(
    pedidos: { nro_pedido: string }[]
  ): Observable<PickingResponse> {
    return this.http.post<PickingResponse>(this.PICKING_URL, { pedidos });
  }

  /**
   * GET /picking/picking/
   * Lista todos los pickings generados
   */
  getPickings(): Observable<PickingResponse[]> {
    return this.http.get<PickingResponse[]>(this.PICKING_URL);
  }
}
