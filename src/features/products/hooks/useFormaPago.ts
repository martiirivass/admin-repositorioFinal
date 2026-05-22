import { useQuery } from "@tanstack/react-query";
import { formaPagoService } from "../services/formaPagoService";

const QUERY_KEY = ["formas-pago"];

export function useFormasPago() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => formaPagoService.list(),
  });
}
