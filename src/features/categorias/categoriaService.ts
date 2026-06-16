import { api } from "../../shared/api";
import { uploadService } from "../products/productService";
import type { CategoriaRead, CategoriaTree, CategoriaCreate, CategoriaUpdate } from "./types";

export const categoriaService = {
  list: async (params?: { limit?: number; offset?: number; parent_id?: number }) => {
    const { data } = await api.get("/categorias", { params });
    return data as { data: CategoriaRead[]; total: number };
  },

  getTree: async () => {
    const { data } = await api.get("/categorias/tree");
    return data as CategoriaTree[];
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/categorias/${id}`);
    return data as CategoriaRead;
  },

  create: async (categoria: CategoriaCreate) => {
    const { data } = await api.post("/categorias", categoria);
    return data as CategoriaRead;
  },

  update: async (id: number, categoria: CategoriaUpdate) => {
    const { data } = await api.put(`/categorias/${id}`, categoria);
    return data as CategoriaRead;
  },

  delete: async (id: number) => {
    await api.delete(`/categorias/${id}`);
  },

  uploadImage: async (id: number, archivo: File) => {
    const result = await uploadService.subirImagen(archivo, "categorias");
    // Then update the category with the new image URL
    const { data } = await api.put(`/categorias/${id}`, { imagen_url: result.secure_url });
    return data as CategoriaRead;
  },
};
