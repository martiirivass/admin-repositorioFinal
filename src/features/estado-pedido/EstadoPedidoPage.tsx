import { useEstadosPedido } from "./useEstadoPedido";

const ESTADOS_MAP: Record<string, { color: string }> = {
  PENDIENTE: { color: "bg-orange-900/30 text-primary border-primary/20" },
  CONFIRMADO: { color: "bg-blue-900/30 text-blue-400 border-blue-400/20" },
  EN_PREP: { color: "bg-yellow-900/30 text-yellow-400 border-yellow-400/20" },
  EN_CAMINO: { color: "bg-cyan-900/30 text-cyan-400 border-cyan-400/20" },
  ENTREGADO: { color: "bg-green-900/30 text-green-400 border-green-400/20" },
  CANCELADO: { color: "bg-red-900/30 text-red-400 border-red-400/20" },
};

export function EstadoPedidoPage() {
  const { data, isLoading } = useEstadosPedido();

  return (
    <div>
      <header className="mb-2xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Estados de Pedido</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Cat&aacute;logo de estados posibles para los pedidos.</p>
      </header>

      <section className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-high border-b border-outline-variant">
            <tr>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">C&oacute;digo</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Descripci&oacute;n</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-center">Orden</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-center">Terminal</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-xl text-on-surface-variant">Cargando...</td></tr>
            ) : !data?.length ? (
              <tr><td colSpan={5} className="text-center py-xl text-on-surface-variant">No hay estados de pedido</td></tr>
            ) : (
              data.map((ep) => {
                const estilo = ESTADOS_MAP[ep.codigo];
                return (
                  <tr key={ep.codigo} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-lg py-lg font-label-lg text-label-lg text-primary font-bold">{ep.codigo}</td>
                    <td className="px-lg py-lg font-body-md text-body-md text-on-surface">{ep.descripcion}</td>
                    <td className="px-lg py-lg text-center font-body-md text-body-md text-on-surface">{ep.orden}</td>
                    <td className="px-lg py-lg text-center">
                      {ep.es_terminal ? (
                        <span className="material-symbols-outlined text-green-400">check_circle</span>
                      ) : (
                        <span className="material-symbols-outlined text-on-surface-variant">radio_button_unchecked</span>
                      )}
                    </td>
                    <td className="px-lg py-lg">
                      {estilo && (
                        <span className={`inline-flex items-center px-md py-base rounded-lg font-label-sm text-label-sm border backdrop-blur-sm ${estilo.color}`}>
                          {ep.codigo}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
