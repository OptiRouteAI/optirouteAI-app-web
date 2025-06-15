export interface PickingResponse {
  nro_picking: string;
  fecha_generacion: string;
  estado: string;
}

export interface Ruta {
  nro_pedido: string;
  cliente: string;
  detalles: {
    cod_articulo: string;
    descripcion: string;
    cantidad: number;
    um: string;
    ubicacion: string;
  }[];
}
