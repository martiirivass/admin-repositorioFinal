import { useState } from "react";
import { useProductos, useEliminarProducto, useCrearProductoConImagen, useActualizarProductoConImagen } from "./useProducts";
import { uploadService } from "./productService";
import { useAuthStore } from "../../store/authStore";
import { ProductFormDrawer } from "./ProductFormDrawer";
import { ConfirmDialog } from "../../shared/components/ConfirmDialog";
import { TableSkeleton } from "../../shared/components/Skeleton";
import { getProductImage } from "../../shared/images";
import { formatARS } from "../../shared/currency";
import { useToast } from "../../shared/components/Toast";
import type { ProductoReadWithRelations, ProductoCreate, ProductoUpdate } from "./types";

export function ProductsPage() {
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole("ADMIN");
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 10;
  const { data, isLoading } = useProductos({ limit, offset: page * limit, q: search || undefined });
  const { mutate: eliminar } = useEliminarProducto();
  const { mutate: crearConImagen } = useCrearProductoConImagen();
  const { mutate: actualizarConImagen } = useActualizarProductoConImagen();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editProducto, setEditProducto] = useState<ProductoReadWithRelations | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductoReadWithRelations | null>(null);
  const { showToast } = useToast();

  const handleEdit = (p: ProductoReadWithRelations) => {
    setEditProducto(p);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setEditProducto(null);
    setDrawerOpen(true);
  };

  const handleSave = async (
    formData: ProductoCreate | ProductoUpdate,
    archivo?: File | null,
    imgContext?: {
      removeExisting: boolean;
      cloudinaryUrl: string | null;
      cloudinaryPublicId: string | null;
      setCloudinaryResult: (url: string, publicId: string) => void;
      setUploading: (v: boolean) => void;
      setUploadError: (v: string | null) => void;
    }
  ) => {
    const productoId = editProducto?.id;

    if (productoId) {
      actualizarConImagen(
        {
          id: productoId,
          data: formData as ProductoUpdate,
          archivo: archivo || null,
          eliminarImagen: !!(imgContext?.removeExisting && !archivo),
        },
        {
          onSuccess: () => {
            showToast("Producto actualizado correctamente", "success");
            setDrawerOpen(false);
            setEditProducto(null);
          },
          onError: (err: any) => {
            const msg = err?.response?.data?.detail || err?.message || "Error al actualizar producto";
            showToast(msg, "error");
          },
        }
      );
    } else {
      crearConImagen(
        { data: formData as ProductoCreate, archivo: archivo || null },
        {
          onSuccess: () => {
            showToast("Producto creado correctamente", "success");
            setDrawerOpen(false);
            setEditProducto(null);
          },
          onError: (err: any) => {
            const msg = err?.response?.data?.detail || err?.message || "Error al crear producto";
            showToast(msg, "error");
          },
        }
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      // If product has a Cloudinary image, delete it first
      if (deleteTarget.imagen_public_id) {
        uploadService.eliminarImagen(deleteTarget.imagen_public_id).catch(() => {
          // Ignore errors on image delete during product deletion
        });
      }

      eliminar(deleteTarget.id, {
        onSuccess: () => showToast("Producto eliminado", "success"),
        onError: (err: any) => {
          const msg = err?.response?.data?.detail || err?.message || "Error al eliminar";
          showToast(msg, "error");
        },
      });
    }
    setDeleteTarget(null);
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-2xl">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Gesti&oacute;n de Productos</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Administre su inventario culinario con precisi&oacute;n editorial.</p>
        </div>
        {isAdmin && (
          <button onClick={handleCreate} className="bg-primary-container text-white font-bold px-lg py-md rounded-lg flex items-center gap-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10">
            <span className="material-symbols-outlined">add</span>
            <span className="font-label-lg text-label-lg">Nuevo Producto</span>
          </button>
        )}
      </header>

      <section className="bg-surface-container border border-outline-variant rounded-lg p-md mb-lg flex flex-col md:flex-row gap-lg justify-between items-center shadow-md">
        <div className="relative w-full md:w-1/2">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-12 pr-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Buscar por nombre..."
          />
        </div>
      </section>

      <section className="bg-surface-container border border-outline-variant rounded-lg overflow-x-auto shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-high border-b border-outline-variant">
            <tr>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Producto</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-right">Precio</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Categor&iacute;a</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-center">Stock</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Estado</th>
              <th className="px-lg py-md font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {isLoading ? (
              <TableSkeleton cols={6} rows={5} />
            ) : data?.data.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-xl text-on-surface-variant">No hay productos</td></tr>
            ) : (
              data?.data.map((p, idx) => (
                <tr key={p.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-lg py-lg">
                    <div className="flex items-center gap-md">
                      <div className="w-14 h-14 rounded-lg overflow-hidden ring-1 ring-outline-variant shrink-0 bg-surface-container-high flex items-center justify-center">
                        {p.imagen_url ? (
                          <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover" />
                        ) : (
                          <img src={getProductImage(p.id, idx)} alt={p.nombre} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-title-lg text-body-lg font-semibold text-on-surface">{p.nombre}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{p.descripcion?.slice(0, 60) || "Sin descripci&oacute;n"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-lg py-lg text-right font-label-lg text-label-lg text-primary">{formatARS(p.precio)}</td>
                  <td className="px-lg py-lg font-body-md text-body-md text-on-surface">
                    {p.categorias?.map((c) => c.nombre).join(", ") || "—"}
                  </td>
                  <td className="px-lg py-lg text-center font-body-md text-body-md text-on-surface">{p.stock_cantidad}</td>
                  <td className="px-lg py-lg">
                    <span className={`inline-flex items-center gap-1.5 px-sm py-1 rounded-lg text-[11px] font-bold tracking-wider uppercase border ${
                      p.disponible
                        ? "bg-green-900/20 text-green-400 border-green-900/40"
                        : "bg-red-900/20 text-red-400 border-red-900/40"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.disponible ? "bg-green-400" : "bg-red-400"}`} />
                      {p.disponible ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-lg py-lg">
                    <div className="flex justify-end gap-md text-on-surface-variant">
                      {isAdmin && (
                        <>
                          <button onClick={() => handleEdit(p)} className="hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button onClick={() => setDeleteTarget(p)} className="hover:text-error transition-colors">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </>
                      )}
                      {!isAdmin && (
                        <button onClick={() => handleEdit(p)} className="hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
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
        <p className="font-body-md text-body-md">Mostrando {data?.data.length || 0} de {data?.total || 0} productos</p>
        <div className="flex gap-base">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors disabled:opacity-30">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          {(() => {
            const pages = new Set<number>();
            const siblingCount = 2;
            pages.add(0);
            for (let i = Math.max(0, page - siblingCount); i <= Math.min(totalPages - 1, page + siblingCount); i++) {
              pages.add(i);
            }
            pages.add(totalPages - 1);
            const sorted = [...pages].sort((a, b) => a - b);
            const items: (number | null)[] = [];
            for (let i = 0; i < sorted.length; i++) {
              if (i > 0 && sorted[i] - sorted[i - 1] > 1) items.push(null);
              items.push(sorted[i]);
            }
            return items.map((p, idx) =>
              p === null ? (
                <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-on-surface-variant">&hellip;</span>
              ) : (
                <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${p === page ? "bg-primary-container text-white font-bold shadow-sm" : "border border-outline-variant hover:bg-surface-container-high"}`}>
                  {p + 1}
                </button>
              )
            );
          })()}
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors disabled:opacity-30">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </footer>

      {drawerOpen && (
        <ProductFormDrawer
          producto={editProducto}
          onClose={() => { setDrawerOpen(false); setEditProducto(null); }}
          onSave={handleSave}
          readonly={!isAdmin}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="¿Eliminar producto?"
        message={deleteTarget ? `Esta acci&oacute;n no se puede deshacer. ¿Est&aacute;s seguro de eliminar "${deleteTarget.nombre}"?` : ""}
        confirmText="Eliminar"
        cancelText="Cancelar"
        destructive
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
