import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriaService } from "./categoriaService";
import type { CategoriaCreate, CategoriaUpdate } from "./types";

const QUERY_KEY = ["categorias"];

export function useCategorias(params?: { limit?: number; offset?: number; parent_id?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEY, "list", params],
    queryFn: () => categoriaService.list(params),
  });
}

export function useCategoriaTree() {
  return useQuery({
    queryKey: [...QUERY_KEY, "tree"],
    queryFn: () => categoriaService.getTree(),
  });
}

export function useCrearCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoriaCreate) => categoriaService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useActualizarCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaUpdate }) => categoriaService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useEliminarCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoriaService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useSubirImagenCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, archivo }: { id: number; archivo: File }) => categoriaService.uploadImage(id, archivo),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
