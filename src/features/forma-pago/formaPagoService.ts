import { api } from "../../shared/api";
import type { FormaPagoRead } from "./types";

export const formaPagoService = {
  list: async () => {
    const { data } = await api.get("/formas-pago");
    return data as FormaPagoRead[];
  },
};
