import { useState, useRef } from "react";
import { useCategorias, useCrearCategoria, useActualizarCategoria, useEliminarCategoria, useSubirImagenCategoria } from "./useCategorias";
import { useAuthStore } from "../../store/authStore";
import { ConfirmDialog } from "../../shared/components/ConfirmDialog";
import type { CategoriaRead } from "./types";

export function CategoriasPage() {
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole("ADMIN");
  const { data, isLoading } = useCategorias({ limit: 50, offset: 0 });
  const { mutate: crear } = useCrearCategoria();
  const { mutate: actualizar } = useActualizarCategoria();
  const { mutate: eliminar } = useEliminarCategoria();
  const { mutate: subirImagen } = useSubirImagenCategoria();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [editingImagenUrl, setEditingImagenUrl] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoriaRead | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagenFile(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setEditingId(null);
    setImagenFile(null);
    setImagenPreview(null);
    setEditingImagenUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    if (editingId) {
      actualizar(
        { id: editingId, data: { nombre, descripcion: descripcion || null } },
        {
          onSuccess: () => {
            if (imagenFile) subirImagen({ id: editingId, archivo: imagenFile });
            resetForm();
          },
        }
      );
    } else {
      crear(
        { nombre, descripcion: descripcion || null },
        {
          onSuccess: (nuevaCat) => {
            if (imagenFile && nuevaCat?.id) subirImagen({ id: nuevaCat.id, archivo: imagenFile });
            resetForm();
          },
        }
      );
    }
  };

  const handleEdit = (cat: CategoriaRead) => {
    setEditingId(cat.id);
    setNombre(cat.nombre);
    setDescripcion(cat.descripcion || "");
    setEditingImagenUrl(cat.imagen_url);
    setImagenPreview(null);
    setImagenFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancel = () => resetForm();

  return (
    <div>
      <ConfirmDialog
        open={!!deleteTarget}
        title="¿Eliminar categoría?"
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
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Gestión de Categorías</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Organice su menú con categorías y subcategorías.</p>
      </header>

      {isAdmin && (
        <form onSubmit={handleSubmit} className="bg-surface-container border border-outline-variant rounded-lg p-lg mb-lg flex flex-col md:flex-row gap-md items-end flex-wrap">
          <div className="flex-1 space-y-xs min-w-[180px]">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="Ej: Pizzas" required />
          </div>
          <div className="flex-1 space-y-xs min-w-[180px]">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Descripción</label>
            <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="Opcional" />
          </div>
          <div className="space-y-xs min-w-[180px]">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Imagen</label>
            <div className="flex items-center gap-2">
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange}
                className="w-full text-on-surface text-body-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary-container file:text-white file:font-bold file:text-label-sm hover:file:brightness-110 cursor-pointer" />
              {(imagenPreview || editingImagenUrl) && (
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-outline-variant shrink-0">
                  <img src={imagenPreview ?? editingImagenUrl ?? undefined} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-sm items-end pb-[2px]">
            {editingId && (
              <button type="button" onClick={handleCancel}
                className="px-md py-md border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-high transition-colors">
                Cancelar
              </button>
            )}
            <button type="submit"
              className="px-md py-md bg-primary-container text-white font-bold rounded-lg hover:brightness-110 transition-all">
              {editingId ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      )}

      <section className="bg-surface-container border border-outline-variant rounded-lg overflow-x-auto shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-high border-b border-outline-variant">
            <tr>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider w-14">Img</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Nombre</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Descripción</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-xl text-on-surface-variant">Cargando...</td></tr>
            ) : data?.data.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-xl text-on-surface-variant">No hay categorías</td></tr>
            ) : (
              data?.data.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-lg py-lg">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-outline-variant bg-surface-container-high">
                      {cat.imagen_url ? (
                        <img src={cat.imagen_url} alt={cat.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg text-on-surface-variant/50">image</span>
                        </div>
                      )}
                    </div>
                  </td>
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
                          <button onClick={() => setDeleteTarget(cat)} className="hover:text-error transition-colors">
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
