export interface PickingResumen {
  nro_picking: string;
  fecha_generacion: string;
  estado: string;
  detalles: {
    cod_lpn: string;
    cantidad: number;
    ubicacion: string;
    um: string;
  }[];
}
