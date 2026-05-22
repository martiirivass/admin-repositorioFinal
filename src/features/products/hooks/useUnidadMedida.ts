import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { unidadMedidaService } from "../services/unidadMedidaService";
import type { UnidadMedidaCreate, UnidadMedidaUpdate } from "../types";

const QUERY_KEY = ["unidades-medida"];

export function useUnidadesMedida() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => unidadMedidaService.list(),
  });
}

export function useCrearUnidadMedida() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UnidadMedidaCreate) => unidadMedidaService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useActualizarUnidadMedida() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UnidadMedidaUpdate }) => unidadMedidaService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useEliminarUnidadMedida() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => unidadMedidaService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
