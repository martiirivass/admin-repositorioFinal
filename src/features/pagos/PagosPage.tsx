import { useState } from "react";
import { usePagos, useCrearPago } from "./usePagos";
import { useFormasPago } from "../forma-pago/useFormaPago";
import { formatARS } from "../../shared/currency";

export function PagosPage() {
  const [pedidoFilter] = useState<number | undefined>(undefined);
  const { data, isLoading } = usePagos({ pedido_id: pedidoFilter });
  const { mutate: crear } = useCrearPago();
  const { data: formasPago } = useFormasPago();

  const [showForm, setShowForm] = useState(false);
  const [pedidoId, setPedidoId] = useState(0);
  const [monto, setMonto] = useState(0);
  const [formaPagoCodigo, setFormaPagoCodigo] = useState("");
  const [referencia, setReferencia] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    crear(
      { pedido_id: pedidoId, monto, forma_pago_codigo: formaPagoCodigo, referencia: referencia || null },
      { onSuccess: () => { setShowForm(false); setPedidoId(0); setMonto(0); setReferencia(""); } }
    );
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-2xl">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Gesti&oacute;n de Pagos</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Registre y consulte pagos del sistema.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-primary-container text-white font-bold px-lg py-md rounded-lg flex items-center gap-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10">
          <span className="material-symbols-outlined">add</span>
          <span className="font-label-lg text-label-lg">Nuevo Pago</span>
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface-container border border-outline-variant rounded-lg p-lg mb-lg flex flex-col md:flex-row gap-md items-end shadow-md">
          <div className="space-y-xs min-w-[120px]">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Pedido ID</label>
            <input type="number" value={pedidoId || ""} onChange={(e) => setPedidoId(Number(e.target.value))}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" required />
          </div>
          <div className="space-y-xs min-w-[140px]">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Monto ($)</label>
            <input type="number" step="0.01" value={monto || ""} onChange={(e) => setMonto(Number(e.target.value))}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" required />
          </div>
          <div className="space-y-xs min-w-[150px]">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Forma de Pago</label>
            <select value={formaPagoCodigo} onChange={(e) => setFormaPagoCodigo(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" required>
              <option value="">Seleccionar...</option>
              {formasPago?.map((fp) => (
                <option key={fp.codigo} value={fp.codigo}>{fp.descripcion}</option>
              ))}
            </select>
          </div>
          <div className="space-y-xs min-w-[150px]">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Referencia</label>
            <input value={referencia} onChange={(e) => setReferencia(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Opcional" />
          </div>
          <div className="flex gap-sm items-end pb-[2px]">
            <button type="submit" className="px-md py-md bg-primary-container text-white font-bold rounded-lg hover:brightness-110 transition-all">Registrar</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-md py-md border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-high transition-colors">Cancelar</button>
          </div>
        </form>
      )}

      <section className="bg-surface-container border border-outline-variant rounded-lg overflow-x-auto shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-high border-b border-outline-variant">
            <tr>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">ID</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Pedido</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-right">Monto</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Forma de Pago</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Referencia</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-xl text-on-surface-variant">Cargando...</td></tr>
            ) : !data?.length ? (
              <tr><td colSpan={6} className="text-center py-xl text-on-surface-variant">No hay pagos registrados</td></tr>
            ) : (
              data.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-lg py-lg font-label-lg text-label-lg text-primary font-bold">#{p.id}</td>
                  <td className="px-lg py-lg font-body-md text-body-md text-on-surface">#{p.pedido_id}</td>
                  <td className="px-lg py-lg text-right font-label-lg text-label-lg text-on-surface font-bold">{formatARS(p.monto)}</td>
                  <td className="px-lg py-lg"><span className="px-sm py-1 rounded-lg font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant">{p.forma_pago_codigo}</span></td>
                  <td className="px-lg py-lg font-body-md text-body-md text-on-surface-variant">{p.referencia || "—"}</td>
                  <td className="px-lg py-lg font-body-md text-body-md text-on-surface-variant">{new Date(p.created_at).toLocaleDateString("es-AR")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
