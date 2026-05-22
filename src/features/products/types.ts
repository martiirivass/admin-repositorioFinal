export interface CategoriaRead {
  id: number;
  nombre: string;
  descripcion: string | null;
  parent_id: number | null;
  imagen_url: string | null;
}

export interface CategoriaTree extends CategoriaRead {
  subcategorias: CategoriaTree[];
}

export interface CategoriaCreate {
  nombre: string;
  descripcion?: string | null;
}

export interface CategoriaUpdate {
  nombre?: string;
  descripcion?: string | null;
}

export interface IngredienteRead {
  id: number;
  nombre: string;
  descripcion: string | null;
  es_alergeno: boolean;
}

export interface IngredienteCreate {
  nombre: string;
  descripcion?: string | null;
  es_alergeno?: boolean;
}

export interface IngredienteUpdate {
  nombre?: string;
  descripcion?: string | null;
  es_alergeno?: boolean;
}

export interface ProductoRead {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  precio: number; // alias property
  imagen_url: string | null;
  imagenes_url: string | null;
  stock_cantidad: number;
  disponible: boolean;
}

export interface ProductoReadWithRelations extends ProductoRead {
  categorias: CategoriaRead[];
  ingredientes: IngredienteRead[];
}

export interface ProductoCreate {
  nombre: string;
  descripcion?: string | null;
  precio_base: number;
  stock_cantidad?: number;
  disponible?: boolean;
  categoria_ids: number[];
  ingrediente_ids: number[];
}

export interface ProductoUpdate {
  nombre?: string;
  descripcion?: string | null;
  precio_base?: number;
  stock_cantidad?: number;
  disponible?: boolean;
  categoria_ids?: number[];
  ingrediente_ids?: number[];
}

export interface ProductoDisponibilidadUpdate {
  disponible: boolean;
  stock_cantidad?: number | null;
}

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
  pagos: PagoRead[];
  usuario?: { nombre: string; email: string };
}

export interface EstadoPedidoRead {
  codigo: string;
  descripcion: string;
  orden: number;
  es_terminal: boolean;
}

export interface AdminUser {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  deleted_at: string | null;
  roles: { codigo: string; nombre: string }[];
}

export interface AvanceEstadoRequest {
  estado_codigo: string;
}

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

export interface FormaPagoRead {
  codigo: string;
  descripcion: string;
  habilitado: boolean;
}

export interface UnidadMedidaRead {
  id: number;
  nombre: string;
  simbolo: string;
  tipo: string;
}

export interface UnidadMedidaCreate {
  nombre: string;
  simbolo: string;
  tipo: string;
}

export interface UnidadMedidaUpdate {
  nombre?: string;
  simbolo?: string;
  tipo?: string;
}
