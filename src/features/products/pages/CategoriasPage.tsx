import { useState } from "react";
import { useCategorias, useCrearCategoria, useActualizarCategoria, useEliminarCategoria } from "../hooks/useCategorias";
import { useAuthStore } from "../../../store/authStore";

export function CategoriasPage() {
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole("ADMIN");
  const { data, isLoading } = useCategorias({ limit: 50, offset: 0 });
  const { mutate: crear } = useCrearCategoria();
  const { mutate: actualizar } = useActualizarCategoria();
  const { mutate: eliminar } = useEliminarCategoria();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    if (editingId) {
      actualizar({ id: editingId, data: { nombre, descripcion: descripcion || null } });
    } else {
      crear({ nombre, descripcion: descripcion || null });
    }
    setNombre("");
    setDescripcion("");
    setEditingId(null);
  };

  const handleEdit = (cat: { id: number; nombre: string; descripcion: string | null }) => {
    setEditingId(cat.id);
    setNombre(cat.nombre);
    setDescripcion(cat.descripcion || "");
  };

  const handleCancel = () => {
    setEditingId(null);
    setNombre("");
    setDescripcion("");
  };

  return (
    <div>
      <header className="mb-2xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Gestión de Categorías</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Organice su menú con categorías y subcategorías.</p>
      </header>

      {isAdmin && (
        <form onSubmit={handleSubmit} className="bg-surface-container border border-outline-variant rounded-lg p-lg mb-lg flex flex-col md:flex-row gap-md items-end">
          <div className="flex-1 space-y-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Ej: Pizzas" required />
          </div>
          <div className="flex-1 space-y-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Descripción</label>
            <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Opcional" />
          </div>
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

      <section className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-high border-b border-outline-variant">
            <tr>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Nombre</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Descripción</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {isLoading ? (
              <tr><td colSpan={3} className="text-center py-xl text-on-surface-variant">Cargando...</td></tr>
            ) : data?.data.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-xl text-on-surface-variant">No hay categorías</td></tr>
            ) : (
              data?.data.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-lg py-lg">
                    <p className="font-title-lg text-body-lg font-semibold text-on-surface">{cat.nombre}</p>
                    {cat.parent_id && <p className="font-label-sm text-label-sm text-on-surface-variant">Subcategoría</p>}
                  </td>
                  <td className="px-lg py-lg font-body-md text-body-md text-on-surface-variant">{cat.descripcion || "—"}</td>
                  <td className="px-lg py-lg">
                    <div className="flex justify-end gap-md text-on-surface-variant">
                      {isAdmin && (
                        <>
                          <button onClick={() => handleEdit(cat)} className="hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button onClick={() => confirm("¿Eliminar?") && eliminar(cat.id)} className="hover:text-error transition-colors">
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
