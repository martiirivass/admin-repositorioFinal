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
  imagen_url?: string;
}

export interface CategoriaUpdate {
  nombre?: string;
  descripcion?: string | null;
  imagen_url?: string;
}
