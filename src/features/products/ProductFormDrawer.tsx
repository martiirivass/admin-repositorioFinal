import { useCategorias } from "../categorias/useCategorias";
import { useIngredientes } from "../ingredientes/useIngredientes";
import { useProductForm } from "./hooks/useProductForm";
import { useImageUpload } from "./hooks/useImageUpload";

import type { ProductoReadWithRelations, ProductoCreate, ProductoUpdate } from "./types";

interface Props {
  producto: ProductoReadWithRelations | null;
  onClose: () => void;
  onSave: (
    data: ProductoCreate | ProductoUpdate,
    archivo?: File | null,
    imgContext?: {
      removeExisting: boolean;
      cloudinaryUrl: string | null;
      cloudinaryPublicId: string | null;
      setCloudinaryResult: (url: string, publicId: string) => void;
      setUploading: (v: boolean) => void;
      setUploadError: (v: string | null) => void;
    }
  ) => void;
  readonly?: boolean;
}

export function ProductFormDrawer({ producto, onClose, onSave, readonly }: Props) {
  const isEdit = !!producto;
  const form = useProductForm(producto);
  const img = useImageUpload();
  const { data: catData } = useCategorias({ limit: 100, offset: 0 });
  const { data: ingData } = useIngredientes({ limit: 100, offset: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      form.buildSubmitData(),
      img.file,
      {
        removeExisting: img.removeExisting,
        cloudinaryUrl: img.cloudinaryUrl,
        cloudinaryPublicId: img.cloudinaryPublicId,
        setCloudinaryResult: img.setCloudinaryResult,
        setUploading: img.setUploading,
        setUploadError: img.setUploadError,
      }
    );
  };

  const categorias = catData?.data || [];
  const ingredientes = ingData?.data || [];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-surface-dim/80 backdrop-blur-md">
      <div className="w-full max-w-[500px] h-full bg-surface-container shadow-2xl border-l border-outline-variant flex flex-col">
        <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-high">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface">{isEdit ? "Editar Producto" : "Nuevo Producto"}</h3>
            {isEdit && <p className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">ID: PRD-{String(producto.id).padStart(5, "0")}</p>}
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest text-on-surface transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto px-xl py-xl space-y-xl custom-scrollbar">
          {/* Imagen */}
          <div className="relative w-full h-[200px] rounded-xl overflow-hidden border border-outline-variant mb-lg bg-surface-container-high flex items-center justify-center group">
            {/* Loading overlay */}
            {img.uploading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface-dim/80">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-sm" />
                <span className="font-label-sm text-label-sm text-on-surface">Subiendo imagen...</span>
              </div>
            )}
            {/* Preview: Cloudinary URL > local preview > existing > placeholder */}
            {img.cloudinaryUrl ? (
              <img src={img.cloudinaryUrl} alt="Cloudinary" className="w-full h-full object-cover" />
            ) : img.preview ? (
              <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
            ) : producto?.imagen_url && !img.removeExisting ? (
              <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">image</span>
              </div>
            )}
            {!readonly && !img.uploading && (
              <div className="absolute inset-0 flex items-center justify-center gap-sm opacity-0 group-hover:opacity-100 transition-opacity bg-surface-dim/60">
                <button type="button" onClick={() => img.fileInputRef.current?.click()}
                  className="px-md py-sm bg-primary text-on-primary rounded-lg font-label-lg text-label-lg hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center gap-sm">
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  {img.preview || img.cloudinaryUrl || (producto?.imagen_url && !img.removeExisting) ? "Cambiar" : "Subir Imagen"}
                </button>
                {(img.preview || img.cloudinaryUrl || (producto?.imagen_url && !img.removeExisting)) && (
                  <button type="button" onClick={img.handleRemove}
                    className="px-md py-sm bg-error text-on-error rounded-lg font-label-lg text-label-lg hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center gap-sm">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Quitar
                  </button>
                )}
              </div>
            )}
            <input ref={img.fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={img.handleChange} className="hidden" />
            {/* Error message */}
            {img.uploadError && (
              <div className="absolute bottom-0 left-0 right-0 bg-error/90 text-on-error px-md py-xs text-label-sm text-center">
                {img.uploadError}
              </div>
            )}
          </div>
          <div className="grid gap-lg">
            <div className="space-y-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Nombre del Producto</label>
              <input value={form.nombre} onChange={(e) => form.setNombre(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/40"
                required={!isEdit} readOnly={readonly} />
            </div>
            <div className="space-y-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Descripción</label>
              <textarea value={form.descripcion} onChange={(e) => form.setDescripcion(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none min-h-[100px] placeholder:text-on-surface-variant/40"
                rows={4} readOnly={readonly} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="space-y-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Precio ($)</label>
              <div className="relative">
                <span className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                <input type="number" step="0.01" value={form.precio} onChange={(e) => form.setPrecio(Number(e.target.value))}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-8 pr-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  required={!isEdit} readOnly={readonly} />
              </div>
            </div>
            <div className="space-y-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => form.setStock(Number(e.target.value))}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                readOnly={readonly} />
            </div>
          </div>
          {!readonly && (
            <div className="space-y-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Disponible</label>
              <label className="flex items-center gap-md cursor-pointer">
                <input type="checkbox" checked={form.disponible} onChange={(e) => form.setDisponible(e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant bg-surface-container-low text-primary focus:ring-primary" />
                <span className="font-body-md text-body-md text-on-surface">{form.disponible ? "Producto activo" : "Producto inactivo"}</span>
              </label>
            </div>
          )}
          <div className="space-y-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Categorías</label>
            <div className="flex flex-wrap gap-xs p-sm bg-surface-container-lowest border border-outline-variant rounded-lg min-h-[60px]">
              {categorias.map((cat: { id: number; nombre: string }) => (
                <button key={cat.id} type="button" onClick={() => !readonly && form.toggleCat(cat.id)}
                  className={`px-sm py-1 rounded-lg font-label-sm text-label-sm transition-colors ${
                    form.selectedCats.includes(cat.id)
                      ? "bg-surface-container-highest text-primary ring-1 ring-primary/20"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}>
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Ingredientes</label>
            <div className="flex flex-wrap gap-xs p-sm bg-surface-container-lowest border border-outline-variant rounded-lg min-h-[60px]">
              {ingredientes.map((ing: { id: number; nombre: string }) => (
                <button key={ing.id} type="button" onClick={() => !readonly && form.toggleIng(ing.id)}
                  className={`px-sm py-1 rounded-lg font-label-sm text-label-sm transition-colors ${
                    form.selectedIngs.includes(ing.id)
                      ? "bg-surface-container-highest text-primary ring-1 ring-primary/20"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}>
                  {ing.nombre}
                </button>
              ))}
            </div>
          </div>
        </form>
        <div className="px-xl py-xl border-t border-outline-variant grid grid-cols-1 md:grid-cols-2 gap-lg bg-surface-container-high">
          <button type="button" onClick={onClose} className="px-lg py-md border border-outline-variant text-on-surface font-semibold rounded-lg hover:bg-surface-container-highest transition-colors active:scale-[0.98]">
            Cancelar
          </button>
          {!readonly && (
            <button type="submit" onClick={handleSubmit} disabled={img.uploading}
              className={`px-lg py-md font-bold rounded-lg transition-all shadow-lg ${
                img.uploading
                  ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
                  : "bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] shadow-primary/20"
              }`}>
              {img.uploading ? "Subiendo imagen..." : (isEdit ? "Guardar Cambios" : "Crear Producto")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
