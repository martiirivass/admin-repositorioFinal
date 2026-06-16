import { useState } from "react";
import { useUnidadesMedida, useCrearUnidadMedida, useActualizarUnidadMedida, useEliminarUnidadMedida } from "./useUnidadMedida";
import { ConfirmDialog } from "../../shared/components/ConfirmDialog";
import type { UnidadMedidaRead } from "./types";

export function UnidadMedidaPage() {
  const { data, isLoading } = useUnidadesMedida();
  const { mutate: crear } = useCrearUnidadMedida();
  const { mutate: actualizar } = useActualizarUnidadMedida();
  const { mutate: eliminar } = useEliminarUnidadMedida();

  const [nombre, setNombre] = useState("");
  const [simbolo, setSimbolo] = useState("");
  const [tipo, setTipo] = useState("unidad");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UnidadMedidaRead | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !simbolo.trim()) return;
    if (editingId) {
      actualizar({ id: editingId, data: { nombre, simbolo, tipo } });
    } else {
      crear({ nombre, simbolo, tipo });
    }
    setNombre(""); setSimbolo(""); setTipo("unidad"); setEditingId(null);
  };

  const handleEdit = (u: { id: number; nombre: string; simbolo: string; tipo: string }) => {
    setEditingId(u.id);
    setNombre(u.nombre);
    setSimbolo(u.simbolo);
    setTipo(u.tipo);
  };

  const handleCancel = () => {
    setEditingId(null); setNombre(""); setSimbolo(""); setTipo("unidad");
  };

  return (
    <div>
      <ConfirmDialog
        open={!!deleteTarget}
        title="¿Eliminar unidad de medida?"
        message={deleteTarget ? `Esta acción no se puede deshacer. ¿Estás seguro de eliminar "${deleteTarget.nombre}"?` : ""}
        confirmText="Eliminar"
        cancelText="Cancelar"
        destructive
        onConfirm={() => {
          if (deleteTarget) eliminar(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      <header className="mb-2xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Unidades de Medida</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Administre las unidades de medida del inventario.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-surface-container border border-outline-variant rounded-lg p-lg mb-lg flex flex-col md:flex-row gap-md items-end shadow-md">
        <div className="space-y-xs min-w-[150px]">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Nombre</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Ej: Kilogramo" required />
        </div>
        <div className="space-y-xs min-w-[100px]">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">S&iacute;mbolo</label>
          <input value={simbolo} onChange={(e) => setSimbolo(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Ej: kg" required />
        </div>
        <div className="space-y-xs min-w-[150px]">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Tipo</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
            <option value="masa">Masa</option>
            <option value="volumen">Volumen</option>
            <option value="unidad">Unidad</option>
            <option value="area">&Aacute;rea</option>
          </select>
        </div>
        <div className="flex gap-sm items-end pb-[2px]">
          {editingId && (
            <button type="button" onClick={handleCancel} className="px-md py-md border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-high transition-colors">Cancelar</button>
          )}
          <button type="submit" className="px-md py-md bg-primary-container text-white font-bold rounded-lg hover:brightness-110 transition-all">
            {editingId ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>

      <section className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-high border-b border-outline-variant">
            <tr>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Nombre</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">S&iacute;mbolo</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Tipo</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-xl text-on-surface-variant">Cargando...</td></tr>
            ) : !data?.length ? (
              <tr><td colSpan={4} className="text-center py-xl text-on-surface-variant">No hay unidades de medida</td></tr>
            ) : (
              data.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-lg py-lg font-title-lg text-body-lg font-semibold text-on-surface">{u.nombre}</td>
                  <td className="px-lg py-lg font-body-md text-body-md text-primary font-bold">{u.simbolo}</td>
                  <td className="px-lg py-lg"><span className="px-sm py-1 rounded-lg font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant">{u.tipo}</span></td>
                  <td className="px-lg py-lg">
                    <div className="flex justify-end gap-md text-on-surface-variant">
                      <button onClick={() => handleEdit(u)} className="hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button onClick={() => setDeleteTarget(u)} className="hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
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
