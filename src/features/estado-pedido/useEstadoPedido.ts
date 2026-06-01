import { useQuery } from "@tanstack/react-query";
import { estadoPedidoService } from "./estadoPedidoService";

const QUERY_KEY = ["estados-pedido"];

export function useEstadosPedido() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => estadoPedidoService.list(),
  });
}
