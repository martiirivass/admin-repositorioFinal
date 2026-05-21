export interface CategoriaRead {
  id: number;
  nombre: string;
  descripcion: string | null;
  parent_id: number | null;
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
  precio: number;
  imagen_url: string | null;
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
  precio: number;
  stock_cantidad?: number;
  disponible?: boolean;
  categoria_ids: number[];
  ingrediente_ids: number[];
}

export interface ProductoUpdate {
  nombre?: string;
  descripcion?: string | null;
  precio?: number;
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
  id: number;
  producto_id: number;
  nombre_producto: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
}

export interface HistorialEstadoRead {
  id: number;
  estado_pedido_id: number;
  fecha: string;
  observacion: string | null;
}

export interface PedidoRead {
  id: number;
  usuario_id: number;
  fecha: string;
  total: number;
  estado_actual_id: number;
  forma_pago_id: number;
  direccion_entrega_id: number | null;
  activo: boolean;
}

export interface PedidoReadWithDetalles extends PedidoRead {
  detalles: DetallePedidoRead[];
  historial_estados: HistorialEstadoRead[];
  usuario?: { nombre: string; email: string };
  estado_actual?: { id: number; codigo: string; nombre: string };
  forma_pago?: { id: number; nombre: string };
}

export interface EstadoPedido {
  id: number;
  codigo: string;
  nombre: string;
}

export interface AdminUser {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  deleted_at: string | null;
  roles: { id: number; codigo: string; nombre: string }[];
}

export interface AvanceEstadoRequest {
  estado_id: number;
}
