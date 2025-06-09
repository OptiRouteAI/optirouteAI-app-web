import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PickingResponse } from '../models/picking-response';
import { PickingResumen } from '../models/picking.resumen';

@Injectable({
  providedIn: 'root',
})
export class PickingService {
  //private readonly PICKING_URL = 'http://127.0.0.1:8000/picking/picking/';

  private readonly PICKING_URL = 'http://127.0.0.1:8000/pickings';

  constructor(private http: HttpClient) {}

  /**
   * POST /pickings
   * Genera un nuevo picking a partir de pedidos seleccionados
   * (No funcional con json-server a menos que lo configures)
   */
  generatePicking(
    pedidos: { nro_pedido: string }[]
  ): Observable<PickingResponse> {
    return this.http.post<PickingResponse>(this.PICKING_URL, { pedidos });
  }

  /**
   * GET /pickings
   * Obtiene todos los pickings registrados (resumen)
   */
  getPickings(): Observable<PickingResumen[]> {
    return this.http.get<PickingResumen[]>(this.PICKING_URL);
  }
}
