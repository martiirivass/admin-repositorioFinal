export interface AdminUser {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  deleted_at: string | null;
  roles: { codigo: string; nombre: string }[];
}

export interface ResumenStats {
  ventas_totales: number;
  pedidos_hoy: number;
  clientes_nuevos: number;
  pedidos_pendientes: number;
}

export interface VentaDiaria {
  fecha: string;
  total: number;
  cantidad: number;
}

export interface VentasSemanalesResponse {
  data: VentaDiaria[];
}

export interface PedidosPorEstadoItem {
  estado_codigo: string;
  cantidad: number;
}

export interface PedidosPorEstadoResponse {
  data: PedidosPorEstadoItem[];
}

export interface IngresoPorFormaPagoItem {
  forma_pago_codigo: string;
  total: number;
  cantidad: number;
}

export interface IngresosPorFormaPagoResponse {
  data: IngresoPorFormaPagoItem[];
}
