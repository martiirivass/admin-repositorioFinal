import { useState } from "react";
import { useIngredientes, useCrearIngrediente, useActualizarIngrediente, useEliminarIngrediente } from "./useIngredientes";
import { useAuthStore } from "../../store/authStore";
import { ConfirmDialog } from "../../shared/components/ConfirmDialog";
import { useToast } from "../../shared/components/Toast";
import type { IngredienteRead } from "./types";

export function IngredientesPage() {
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole("ADMIN");
  const { data, isLoading } = useIngredientes({ limit: 50, offset: 0 });
  const { mutate: crear } = useCrearIngrediente();
  const { mutate: actualizar } = useActualizarIngrediente();
  const { mutate: eliminar } = useEliminarIngrediente();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [esAlergeno, setEsAlergeno] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IngredienteRead | null>(null);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    if (editingId) {
      actualizar(
        { id: editingId, data: { nombre, descripcion: descripcion || null, es_alergeno: esAlergeno } },
        {
          onSuccess: () => showToast("Ingrediente actualizado correctamente", "success"),
          onError: (err: any) => {
            const msg = err?.response?.data?.detail || err?.message || "Error al actualizar ingrediente";
            showToast(msg, "error");
          },
        }
      );
    } else {
      crear(
        { nombre, descripcion: descripcion || null, es_alergeno: esAlergeno },
        {
          onSuccess: () => showToast("Ingrediente creado correctamente", "success"),
          onError: (err: any) => {
            const msg = err?.response?.data?.detail || err?.message || "Error al crear ingrediente";
            showToast(msg, "error");
          },
        }
      );
    }
    setNombre("");
    setDescripcion("");
    setEsAlergeno(false);
    setEditingId(null);
  };

  const handleEdit = (ing: { id: number; nombre: string; descripcion: string | null; es_alergeno: boolean }) => {
    setEditingId(ing.id);
    setNombre(ing.nombre);
    setDescripcion(ing.descripcion || "");
    setEsAlergeno(ing.es_alergeno);
  };

  const handleCancel = () => {
    setEditingId(null);
    setNombre("");
    setDescripcion("");
    setEsAlergeno(false);
  };

  return (
    <div>
      <ConfirmDialog
        open={!!deleteTarget}
        title="¿Eliminar ingrediente?"
        message={deleteTarget ? `Esta acción no se puede deshacer. ¿Estás seguro de eliminar "${deleteTarget.nombre}"?` : ""}
        confirmText="Eliminar"
        cancelText="Cancelar"
        destructive
        onConfirm={() => {
          if (deleteTarget)
            eliminar(deleteTarget.id, {
              onSuccess: () => showToast("Ingrediente eliminado", "success"),
              onError: (err: any) => {
                const msg = err?.response?.data?.detail || err?.message || "Error al eliminar ingrediente";
                showToast(msg, "error");
              },
            });
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      <header className="mb-2xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Gesti&oacute;n de Ingredientes</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Administre los ingredientes de su cocina.</p>
      </header>

      {isAdmin && (
        <form onSubmit={handleSubmit} className="bg-surface-container border border-outline-variant rounded-lg p-lg mb-lg flex flex-col md:flex-row gap-md items-end">
          <div className="flex-1 space-y-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Ej: Mozzarella" required />
          </div>
          <div className="flex-1 space-y-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Descripci&oacute;n</label>
            <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Opcional" />
          </div>
          <label className="flex items-center gap-sm cursor-pointer">
            <input type="checkbox" checked={esAlergeno} onChange={(e) => setEsAlergeno(e.target.checked)} className="w-5 h-5 rounded border-outline-variant bg-surface-container-low text-primary focus:ring-primary" />
            <span className="font-label-sm text-label-sm text-on-surface-variant">Al&eacute;rgeno</span>
          </label>
          <div className="flex gap-sm">
            {editingId && (
              <button type="button" onClick={handleCancel} className="px-md py-md border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-high transition-colors">
                Cancelar
              </button>
            )}
            <button type="submit" className="px-md py-md bg-primary-container text-white font-bold rounded-lg hover:brightness-110 transition-all">
              {editingId ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      )}

      <section className="bg-surface-container border border-outline-variant rounded-lg overflow-x-auto shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-high border-b border-outline-variant">
            <tr>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Nombre</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Descripci&oacute;n</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-center">Al&eacute;rgeno</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-xl text-on-surface-variant">Cargando...</td></tr>
            ) : data?.data.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-xl text-on-surface-variant">No hay ingredientes</td></tr>
            ) : (
              data?.data.map((ing) => (
                <tr key={ing.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-lg py-lg">
                    <p className="font-title-lg text-body-lg font-semibold text-on-surface">{ing.nombre}</p>
                  </td>
                  <td className="px-lg py-lg font-body-md text-body-md text-on-surface-variant">{ing.descripcion || "—"}</td>
                  <td className="px-lg py-lg text-center">
                    {ing.es_alergeno ? (
                      <span className="text-error font-label-sm">&nbsp;Al&eacute;rgeno</span>
                    ) : (
                      <span className="text-on-surface-variant font-label-sm">—</span>
                    )}
                  </td>
                  <td className="px-lg py-lg">
                    <div className="flex justify-end gap-md text-on-surface-variant">
                      {isAdmin && (
                        <>
                          <button onClick={() => handleEdit(ing)} className="hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button onClick={() => setDeleteTarget(ing)} className="hover:text-error transition-colors">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </>
                      )}
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
