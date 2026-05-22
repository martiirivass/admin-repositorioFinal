import { useState } from "react";
import { useUsuarios, useEliminarUsuario } from "../hooks/useUsuarios";

export function UsuariosPage() {
  const [page, setPage] = useState(0);
  const [filterRol, setFilterRol] = useState<string | undefined>(undefined);
  const { data, isLoading } = useUsuarios({ limit: 50, offset: page * 50, rol_codigo: filterRol });
  const { mutate: eliminar } = useEliminarUsuario();
  const limit = 50;

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div>
      <header className="mb-2xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Gestión de Usuarios</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Administre los usuarios registrados en el sistema.</p>
      </header>

      <section className="bg-surface-container border border-outline-variant rounded-lg p-md mb-lg flex gap-md items-center shadow-md">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Filtrar por rol:</span>
        {["ADMIN", "STOCK", "PEDIDOS", "CLIENT"].map((rol) => (
          <button key={rol} onClick={() => setFilterRol(filterRol === rol ? undefined : rol)}
            className={`px-sm py-1 rounded-lg font-label-sm text-label-sm border transition-colors ${
              filterRol === rol
                ? "bg-primary-container text-white border-primary/20"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high border-outline-variant"
            }`}
          >
            {rol}
          </button>
        ))}
        {filterRol && <button onClick={() => setFilterRol(undefined)} className="text-on-surface-variant hover:text-primary font-label-sm">Limpiar</button>}
      </section>

      <section className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-high border-b border-outline-variant">
            <tr>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Usuario</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Email</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Roles</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Estado</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-xl text-on-surface-variant">Cargando...</td></tr>
            ) : data?.data.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-xl text-on-surface-variant">No hay usuarios</td></tr>
            ) : (
              data?.data.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-lg py-lg">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {u.nombre?.charAt(0)}{u.apellido?.charAt(0)}
                      </div>
                      <p className="font-title-lg text-body-lg font-semibold text-on-surface">{u.nombre} {u.apellido}</p>
                    </div>
                  </td>
                  <td className="px-lg py-lg font-body-md text-body-md text-on-surface">{u.email}</td>
                  <td className="px-lg py-lg">
                    <div className="flex gap-xs flex-wrap">
                      {u.roles?.map((r) => (
                        <span key={r.codigo} className="px-sm py-1 rounded-lg font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant">
                          {r.codigo}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-lg py-lg">
                    <span className={`inline-flex items-center gap-1.5 px-sm py-1 rounded-lg text-[11px] font-bold tracking-wider uppercase border ${
                      u.deleted_at ? "bg-red-900/20 text-red-400 border-red-900/40" : "bg-green-900/20 text-green-400 border-green-900/40"
                    }`}>
                      {u.deleted_at ? "Eliminado" : "Activo"}
                    </span>
                  </td>
                  <td className="px-lg py-lg">
                    <div className="flex justify-end gap-md text-on-surface-variant">
                      {!u.deleted_at && (
                        <button onClick={() => confirm("¿Eliminar usuario?") && eliminar(u.id)} className="hover:text-error transition-colors">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <footer className="mt-xl flex justify-between items-center text-on-surface-variant">
        <p className="font-body-md text-body-md">Mostrando {data?.data.length || 0} de {data?.total || 0} usuarios</p>
        <div className="flex gap-base">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
            className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors disabled:opacity-30">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${i === page ? "bg-primary-container text-white font-bold shadow-sm" : "border border-outline-variant hover:bg-surface-container-high"}`}>
              {i + 1}
            </button>
          ))}
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
            className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors disabled:opacity-30">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
