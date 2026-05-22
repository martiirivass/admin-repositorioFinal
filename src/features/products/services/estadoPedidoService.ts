import { api } from "../../../shared/api";
import type { EstadoPedidoRead } from "../types";

export const estadoPedidoService = {
  list: async () => {
    const { data } = await api.get("/estados-pedido");
    return data as EstadoPedidoRead[];
  },
};
