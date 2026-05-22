import { useFormasPago } from "../hooks/useFormaPago";

export function FormaPagoPage() {
  const { data, isLoading } = useFormasPago();

  return (
    <div>
      <header className="mb-2xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Formas de Pago</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Catálogo de métodos de pago disponibles en el sistema.</p>
      </header>

      <section className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-high border-b border-outline-variant">
            <tr>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Código</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Descripción</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {isLoading ? (
              <tr><td colSpan={3} className="text-center py-xl text-on-surface-variant">Cargando...</td></tr>
            ) : !data?.length ? (
              <tr><td colSpan={3} className="text-center py-xl text-on-surface-variant">No hay formas de pago</td></tr>
            ) : (
              data.map((fp) => (
                <tr key={fp.codigo} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-lg py-lg font-label-lg text-label-lg text-primary font-bold">{fp.codigo}</td>
                  <td className="px-lg py-lg font-body-md text-body-md text-on-surface">{fp.descripcion}</td>
                  <td className="px-lg py-lg text-center">
                    <span className={`inline-flex items-center gap-1.5 px-sm py-1 rounded-lg text-[11px] font-bold tracking-wider uppercase border ${
                      fp.habilitado ? "bg-green-900/20 text-green-400 border-green-900/40" : "bg-red-900/20 text-red-400 border-red-900/40"
                    }`}>
                      {fp.habilitado ? "Habilitado" : "Deshabilitado"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
