import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlConfigService {
  private readonly BASE_URL = 'http://127.0.0.1:8000';

  public readonly PICKING_URL = `${this.BASE_URL}/picking/picking/`;
  public readonly PICKING_ROUTE_URL = `${this.BASE_URL}/picking/picking/ruta/`;

  public readonly ORDER_URL = `${this.BASE_URL}/purchase/purchase-order/`;
  public readonly ORDER_DETAIL_URL = `${this.BASE_URL}/purchase/purchase-order/{nroPedido}/details`;

  public readonly CONFIGURATION_URL = `${this.BASE_URL}/configuration/configuration/configuracion/`;

  constructor() {}
}
