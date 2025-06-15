export interface PickingResponse {
  nro_picking: string;
  fecha_generacion: string;
  estado: string;
  detalles?: PickingDetalle[];
}

export interface PickingDetalle {
  cod_lpn: string;
  cantidad: number;
  um: string;
  ubicacion: string;
}
