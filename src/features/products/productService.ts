import { api } from "../../shared/api";
import type {
  ProductoReadWithRelations,
  ProductoCreate,
  ProductoUpdate,
  ProductoDisponibilidadUpdate,
} from "./types";

export interface UploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export const uploadService = {
  subirImagen: async (file: File, folder: string = "productos"): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const { data } = await api.post("/uploads/imagen", formData);
    return data as UploadResponse;
  },

  eliminarImagen: async (publicId: string): Promise<void> => {
    await api.delete(`/uploads/imagen/${publicId}`);
  },
};

export const productService = {
  list: async (params?: { limit?: number; offset?: number; categoria_id?: number; disponible?: boolean; q?: string }) => {
    const { data } = await api.get("/productos", { params });
    return data as { data: ProductoReadWithRelations[]; total: number };
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/productos/${id}`);
    return data as ProductoReadWithRelations;
  },

  create: async (producto: ProductoCreate) => {
    const { data } = await api.post("/productos", producto);
    return data as ProductoReadWithRelations;
  },

  update: async (id: number, producto: ProductoUpdate) => {
    const { data } = await api.put(`/productos/${id}`, producto);
    return data as ProductoReadWithRelations;
  },

  updateDisponibilidad: async (id: number, datos: ProductoDisponibilidadUpdate) => {
    const { data } = await api.patch(`/productos/${id}/disponibilidad`, datos);
    return data as ProductoReadWithRelations;
  },

  delete: async (id: number) => {
    await api.delete(`/productos/${id}`);
  },

  createWithImage: async (producto: ProductoCreate, archivo: File | null): Promise<ProductoReadWithRelations> => {
    const formData = new FormData();
    formData.append("nombre", producto.nombre);
    if (producto.descripcion) formData.append("descripcion", producto.descripcion);
    formData.append("precio_base", String(producto.precio_base));
    formData.append("stock_cantidad", String(producto.stock_cantidad || 0));
    formData.append("disponible", String(producto.disponible ?? true));
    formData.append("categoria_ids", JSON.stringify(producto.categoria_ids));
    formData.append("ingrediente_ids", JSON.stringify(producto.ingrediente_ids));

    if (archivo) {
      formData.append("imagen", archivo);
    }

    const { data } = await api.post("/productos/con-imagen", formData);
    return data as ProductoReadWithRelations;
  },

  updateWithImage: async (id: number, producto: ProductoUpdate, archivo: File | null, eliminarImagen: boolean = false): Promise<ProductoReadWithRelations> => {
    const formData = new FormData();

    if (producto.nombre !== undefined) formData.append("nombre", producto.nombre);
    if (producto.descripcion !== undefined) formData.append("descripcion", producto.descripcion || "");
    if (producto.precio_base !== undefined) formData.append("precio_base", String(producto.precio_base));
    if (producto.stock_cantidad !== undefined) formData.append("stock_cantidad", String(producto.stock_cantidad));
    if (producto.disponible !== undefined) formData.append("disponible", String(producto.disponible));
    if (producto.categoria_ids !== undefined) formData.append("categoria_ids", JSON.stringify(producto.categoria_ids));
    if (producto.ingrediente_ids !== undefined) formData.append("ingrediente_ids", JSON.stringify(producto.ingrediente_ids));

    if (archivo) {
      formData.append("imagen", archivo);
    }

    if (eliminarImagen) {
      formData.append("eliminar_imagen", "true");
    }

    const { data } = await api.put(`/productos/${id}/con-imagen`, formData);
    return data as ProductoReadWithRelations;
  },
};
