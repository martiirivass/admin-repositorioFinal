export interface ProductoRead {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  precio: number;
  imagen_url: string | null;
  imagenes_url: string[] | null;
  imagen_public_id: string | null;
  stock_cantidad: number;
  disponible: boolean;
}

export interface ProductoReadWithRelations extends ProductoRead {
  categorias: import("../categorias/types").CategoriaRead[];
  ingredientes: import("../ingredientes/types").IngredienteRead[];
}

export interface ProductoCreate {
  nombre: string;
  descripcion?: string | null;
  precio_base: number;
  stock_cantidad?: number;
  disponible?: boolean;
  categoria_ids: number[];
  ingrediente_ids: number[];
  imagenes_url?: string[];
  imagen_public_id?: string;
}

export interface ProductoUpdate {
  nombre?: string;
  descripcion?: string | null;
  precio_base?: number;
  stock_cantidad?: number;
  disponible?: boolean;
  categoria_ids?: number[];
  ingrediente_ids?: number[];
  imagenes_url?: string[];
  imagen_public_id?: string;
}

export interface ProductoDisponibilidadUpdate {
  disponible: boolean;
  stock_cantidad?: number | null;
}
