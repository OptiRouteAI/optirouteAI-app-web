export interface OrderDetail {
  cod_articulo: string;
  descripcion: string;
  cantidad: number;
  UM: string;
}

export interface Order {
  nro_pedido: string;
  cliente: string;
  direccion: string;
  fecha_pedido: string;
  detalles: OrderDetail[];
}
