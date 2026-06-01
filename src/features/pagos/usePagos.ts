import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pagoService } from "./pagoService";
import type { PagoCreate } from "./types";

const QUERY_KEY = ["pagos"];

export function usePagos(params?: { pedido_id?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => pagoService.list(params),
  });
}

export function useCrearPago() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PagoCreate) => pagoService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
