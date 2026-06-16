import { useState } from "react";
import { usePedidos, useAvanzarEstado } from "./usePedidos";

const ESTADOS_MAP: Record<string, { label: string; color: string }> = {
  PENDIENTE: { label: "Pendiente", color: "bg-orange-900/30 text-primary border-primary/20" },
  CONFIRMADO: { label: "Confirmado", color: "bg-blue-900/30 text-blue-400 border-blue-400/20" },
  EN_PREP: { label: "En Preparaci&oacute;n", color: "bg-yellow-900/30 text-yellow-400 border-yellow-400/20" },
  EN_CAMINO: { label: "En Camino", color: "bg-cyan-900/30 text-cyan-400 border-cyan-400/20" },
  ENTREGADO: { label: "Entregado", color: "bg-green-900/30 text-green-400 border-green-400/20" },
  CANCELADO: { label: "Cancelado", color: "bg-red-900/30 text-red-400 border-red-400/20" },
};

const TRANSICIONES: Record<string, { codigo: string }[]> = {
  PENDIENTE: [{ codigo: "CONFIRMADO" }, { codigo: "CANCELADO" }],
  CONFIRMADO: [{ codigo: "EN_PREP" }, { codigo: "CANCELADO" }],
  EN_PREP: [{ codigo: "EN_CAMINO" }, { codigo: "CANCELADO" }],
  EN_CAMINO: [{ codigo: "ENTREGADO" }, { codigo: "CANCELADO" }],
};

export function PedidosPage() {
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const { data, isLoading } = usePedidos({ limit: 50, offset: 0, estado_codigo: filter });
  const { mutate: avanzar } = useAvanzarEstado();

  return (
    <div>
      <header className="mb-2xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Gesti&oacute;n de Pedidos</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Administre y avance el estado de los pedidos.</p>
      </header>

      <section className="bg-surface-container border border-outline-variant rounded-lg p-md mb-lg flex gap-md items-center shadow-md">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Filtrar:</span>
        {Object.entries(ESTADOS_MAP).map(([key, val]) => (
          <button key={key} onClick={() => setFilter(filter === undefined ? key === "PENDIENTE" ? key : undefined : undefined)}
            className={`px-sm py-1 rounded-lg font-label-sm text-label-sm border transition-colors ${val.color}`}
          >
            {val.label}
          </button>
        ))}
        {filter && <button onClick={() => setFilter(undefined)} className="text-on-surface-variant hover:text-primary font-label-sm">Limpiar</button>}
      </section>

      <section className="space-y-lg">
        {isLoading ? (
          <p className="text-center py-xl text-on-surface-variant">Cargando...</p>
        ) : data?.data.length === 0 ? (
          <p className="text-center py-xl text-on-surface-variant">No hay pedidos</p>
        ) : (
          data?.data.map((pedido) => {
            const estadoActual = ESTADOS_MAP[pedido.estado_codigo] || ESTADOS_MAP.PENDIENTE;
            const transiciones = TRANSICIONES[pedido.estado_codigo] || [];

            return (
              <article key={pedido.id} className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden hover:border-outline transition-all">
                <div className="p-lg md:p-xl space-y-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
                    <div className="space-y-1">
                      <h3 className="font-title-lg text-title-lg text-primary font-bold">#ORD-{String(pedido.id).padStart(4, "0")}</h3>
                      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        {new Date(pedido.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-xl">
                      <div className="text-right">
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Total</p>
                        <p className="font-title-lg text-title-lg text-on-surface font-bold">${pedido.total.toFixed(2)}</p>
                      </div>
                      <span className={`inline-flex items-center px-md py-base rounded-lg font-label-sm text-label-sm border backdrop-blur-sm ${estadoActual.color}`}>
                        {estadoActual.label}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    {pedido.detalles?.map((det: import("./types").DetallePedidoRead, idx: number) => (
                      <div key={`${det.pedido_id}-${det.producto_id}-${idx}`} className="flex items-center gap-md bg-surface-container/50 p-md rounded-lg border border-outline-variant">
                        <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                          <span className="material-symbols-outlined">restaurant</span>
                        </div>
                        <div className="flex-grow">
                          <p className="font-label-lg text-label-lg text-on-surface">{det.nombre_snapshot}</p>
                          <p className="font-body-md text-body-md text-on-surface-variant">{det.cantidad}x ${det.precio_snapshot.toFixed(2)}</p>
                        </div>
                        <p className="font-label-lg text-label-lg text-primary font-bold">${det.subtotal_snap.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {transiciones.length > 0 && (
                    <div className="flex flex-wrap justify-end gap-md pt-md border-t border-outline-variant">
                      {transiciones.map((t) => (
                        <button
                          key={t.codigo}
                          onClick={() => avanzar({ id: pedido.id, data: { estado_codigo: t.codigo } })}
                          className="px-xl py-md bg-primary text-on-primary font-label-lg text-label-lg rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/10"
                        >
                          {t.codigo === "CANCELADO" ? "Cancelar" : `Avanzar a ${ESTADOS_MAP[t.codigo]?.label || t.codigo}`}
                        </button>
                      ))}
                    </div>
                  )}

                  {pedido.historial_estados && pedido.historial_estados.length > 0 && (
                    <div className="pt-md border-t border-outline-variant">
                      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-sm">Historial:</p>
                      <div className="flex flex-wrap gap-sm">
                        {pedido.historial_estados.map((h: import("./types").HistorialEstadoRead) => (
                          <span key={h.id} className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-sm py-1 rounded-lg">
                            {h.motivo || `Estado -> ${h.estado_hacia}`} &mdash; {new Date(h.created_at).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
