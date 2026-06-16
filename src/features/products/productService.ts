import { api } from "../../shared/api";
import type {
  ProductoReadWithRelations,
  ProductoCreate,
  ProductoUpdate,
  ProductoDisponibilidadUpdate,
} from "./types";

export const productService = {

  /** Sube imagen a Cloudinary */
  cloudinaryUpload: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/uploads/imagen", formData);
    return data as { secure_url: string; public_id: string; width?: number; height?: number; format?: string; resource_type?: string };
  },

  /** Elimina imagen de Cloudinary */
  cloudinaryDelete: async (publicId: string) => {
    await api.delete(`/uploads/imagen/${publicId}`);
  },

  subirImagen: async (id: number, archivo: File) => {
    const formData = new FormData();
    formData.append("archivo", archivo);
    const { data } = await api.post(`/productos/${id}/imagen`, formData);
    return data as ProductoReadWithRelations;
  },
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
