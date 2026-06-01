import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "./productService";
import type { ProductoCreate, ProductoUpdate, ProductoDisponibilidadUpdate } from "./types";

const QUERY_KEY = ["productos"];

export function useProductos(params?: { limit?: number; offset?: number; categoria_id?: number; disponible?: boolean; q?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => productService.list(params),
  });
}

export function useProducto(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

export function useCrearProducto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductoCreate) => productService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useActualizarProducto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductoUpdate }) => productService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useActualizarDisponibilidad() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductoDisponibilidadUpdate }) =>
      productService.updateDisponibilidad(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useEliminarProducto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useSubirImagen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, archivo }: { id: number; archivo: File }) =>
      productService.subirImagen(id, archivo),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
