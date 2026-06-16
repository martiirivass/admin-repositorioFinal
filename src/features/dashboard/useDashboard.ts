import { useQuery } from "@tanstack/react-query";
import { adminService } from "./adminService";

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

export function usePedidosPorEstado() {
  return useQuery({
    queryKey: ["admin", "stats", "pedidos-por-estado"],
    queryFn: () => adminService.getPedidosPorEstado(),
  });
}

export function useIngresosPorFormaPago() {
  return useQuery({
    queryKey: ["admin", "stats", "ingresos-por-forma-pago"],
    queryFn: () => adminService.getIngresosPorFormaPago(),
  });
}
