import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pedidoService } from "../services/pedidoService";
import type { AvanceEstadoRequest } from "../types";

const QUERY_KEY = ["pedidos"];

export function usePedidos(params?: { limit?: number; offset?: number; estado_id?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEY, "list", params],
    queryFn: () => pedidoService.list(params),
  });
}

export function usePedido(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => pedidoService.getById(id),
    enabled: !!id,
  });
}

export function useAvanzarEstado() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AvanceEstadoRequest }) => pedidoService.avanzarEstado(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
