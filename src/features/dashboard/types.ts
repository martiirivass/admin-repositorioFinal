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
