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
};
