export interface PagoRead {
  id: number;
  pedido_id: number;
  monto: number;
  forma_pago_codigo: string;
  referencia: string | null;
  created_at: string;
}

export interface PagoCreate {
  pedido_id: number;
  monto: number;
  forma_pago_codigo: string;
  referencia?: string | null;
}
