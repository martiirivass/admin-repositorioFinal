import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ingredienteService } from "./ingredienteService";
import type { IngredienteCreate, IngredienteUpdate } from "./types";

const QUERY_KEY = ["ingredientes"];

export function useIngredientes(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEY, "list", params],
    queryFn: () => ingredienteService.list(params),
  });
}

export function useCrearIngrediente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: IngredienteCreate) => ingredienteService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useActualizarIngrediente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredienteUpdate }) => ingredienteService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useEliminarIngrediente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ingredienteService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
