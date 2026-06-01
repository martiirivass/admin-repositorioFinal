import { api } from "../../shared/api";
import type { IngredienteRead, IngredienteCreate, IngredienteUpdate } from "./types";

export const ingredienteService = {
  list: async (params?: { limit?: number; offset?: number }) => {
    const { data } = await api.get("/ingredientes", { params });
    return data as { data: IngredienteRead[]; total: number };
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/ingredientes/${id}`);
    return data as IngredienteRead;
  },

  create: async (ingrediente: IngredienteCreate) => {
    const { data } = await api.post("/ingredientes", ingrediente);
    return data as IngredienteRead;
  },

  update: async (id: number, ingrediente: IngredienteUpdate) => {
    const { data } = await api.put(`/ingredientes/${id}`, ingrediente);
    return data as IngredienteRead;
  },

  delete: async (id: number) => {
    await api.delete(`/ingredientes/${id}`);
  },
};
