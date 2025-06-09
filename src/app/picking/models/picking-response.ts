export interface PickingDetSalida {
  cod_lpn: string;
  cantidad: number;
  ubicacion: string;
  um: string;
}

export interface PickingResponse {
  nro_picking: string;
  fecha_generacion: string;
  estado: string;
  detalles: PickingDetSalida[];
}
