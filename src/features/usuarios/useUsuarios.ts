import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usuarioService } from "./usuarioService";

const QUERY_KEY = ["usuarios"];

export function useUsuarios(params?: { limit?: number; offset?: number; rol_codigo?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => usuarioService.list(params),
  });
}

export function useEliminarUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usuarioService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
