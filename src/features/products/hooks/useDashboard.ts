import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

export function useResumenStats() {
  return useQuery({
    queryKey: ["admin", "stats", "resumen"],
    queryFn: () => adminService.getResumenStats(),
  });
}

export function useVentasSemanales() {
  return useQuery({
    queryKey: ["admin", "stats", "ventas-semanales"],
    queryFn: () => adminService.getVentasSemanales(),
  });
}
