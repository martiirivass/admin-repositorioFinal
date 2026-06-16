export interface DetallePedidoRead {
  pedido_id: number;
  producto_id: number;
  nombre_snapshot: string;
  precio_snapshot: number;
  cantidad: number;
  subtotal_snap: number;
  personalizacion: string | null;
  created_at: string;
}

export interface HistorialEstadoRead {
  id: number;
  pedido_id: number;
  estado_desde: string | null;
  estado_hacia: string;
  usuario_id: number | null;
  motivo: string | null;
  created_at: string;
}

export interface PedidoRead {
  id: number;
  usuario_id: number;
  direccion_id: number | null;
  estado_codigo: string;
  forma_pago_codigo: string;
  subtotal: number;
  descuento: number;
  costo_envio: number;
  total: number;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface PedidoReadWithDetalles extends PedidoRead {
  detalles: DetallePedidoRead[];
  historial_estados: HistorialEstadoRead[];
  pagos: import("../pagos/types").PagoRead[];
  usuario?: { nombre: string; email: string };
}

export interface AvanceEstadoRequest {
  estado_codigo: string;
  motivo?: string;
}
