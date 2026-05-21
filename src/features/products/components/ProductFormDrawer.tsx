import { useState, useEffect } from "react";
import type { ProductoReadWithRelations, ProductoCreate, ProductoUpdate } from "../types";
import { useCategorias } from "../hooks/useCategorias";
import { useIngredientes } from "../hooks/useIngredientes";
import { getProductImage } from "../../../shared/images";

interface Props {
  producto: ProductoReadWithRelations | null;
  onClose: () => void;
  onSave: (data: ProductoCreate | ProductoUpdate) => void;
  readonly?: boolean;
}

export function ProductFormDrawer({ producto, onClose, onSave, readonly }: Props) {
  const isEdit = !!producto;
  const [nombre, setNombre] = useState(producto?.nombre || "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion || "");
  const [precio, setPrecio] = useState(producto?.precio || 0);
  const [stock, setStock] = useState(producto?.stock_cantidad || 0);
  const [disponible, setDisponible] = useState(producto?.disponible ?? true);
  const [selectedCats, setSelectedCats] = useState<number[]>(producto?.categorias?.map(c => c.id) || []);
  const [selectedIngs, setSelectedIngs] = useState<number[]>(producto?.ingredientes?.map(i => i.id) || []);

  const { data: catData } = useCategorias({ limit: 100, offset: 0 });
  const { data: ingData } = useIngredientes({ limit: 100, offset: 0 });

  const categorias = catData?.data || [];
  const ingredientes = ingData?.data || [];

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion || "");
      setPrecio(producto.precio);
      setStock(producto.stock_cantidad);
      setDisponible(producto.disponible);
      setSelectedCats(producto.categorias?.map(c => c.id) || []);
      setSelectedIngs(producto.ingredientes?.map(i => i.id) || []);
    }
  }, [producto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      onSave({
        nombre: nombre || undefined,
        descripcion: descripcion || undefined,
        precio: precio || undefined,
        stock_cantidad: stock,
        disponible,
        categoria_ids: selectedCats.length ? selectedCats : undefined,
        ingrediente_ids: selectedIngs.length ? selectedIngs : undefined,
      } as ProductoUpdate);
    } else {
      onSave({
        nombre,
        descripcion: descripcion || null,
        precio,
        stock_cantidad: stock,
        disponible,
        categoria_ids: selectedCats,
        ingrediente_ids: selectedIngs,
      } as ProductoCreate);
    }
  };

  const toggleCat = (id: number) => {
    setSelectedCats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleIng = (id: number) => {
    setSelectedIngs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

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
          <div className="w-full h-[200px] rounded-xl overflow-hidden border border-outline-variant mb-lg">
            <img
              src={getProductImage(producto?.id || 0, 0)}
              alt={nombre || "Producto"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid gap-lg">
            <div className="space-y-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Nombre del Producto</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/40"
                required={!isEdit}
                readOnly={readonly}
              />
            </div>
            <div className="space-y-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none min-h-[100px] placeholder:text-on-surface-variant/40"
                rows={4}
                readOnly={readonly}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-lg">
            <div className="space-y-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Precio ($)</label>
              <div className="relative">
                <span className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={precio}
                  onChange={(e) => setPrecio(Number(e.target.value))}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-8 pr-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  required={!isEdit}
                  readOnly={readonly}
                />
              </div>
            </div>
            <div className="space-y-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                readOnly={readonly}
              />
            </div>
          </div>
          {!readonly && (
            <div className="space-y-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Disponible</label>
              <label className="flex items-center gap-md cursor-pointer">
                <input type="checkbox" checked={disponible} onChange={(e) => setDisponible(e.target.checked)} className="w-5 h-5 rounded border-outline-variant bg-surface-container-low text-primary focus:ring-primary" />
                <span className="font-body-md text-body-md text-on-surface">{disponible ? "Producto activo" : "Producto inactivo"}</span>
              </label>
            </div>
          )}
          <div className="space-y-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Categorías</label>
            <div className="flex flex-wrap gap-xs p-sm bg-surface-container-lowest border border-outline-variant rounded-lg min-h-[60px]">
              {categorias.map((cat) => (
                <button key={cat.id} type="button" onClick={() => !readonly && toggleCat(cat.id)}
                  className={`px-sm py-1 rounded-lg font-label-sm text-label-sm transition-colors ${
                    selectedCats.includes(cat.id)
                      ? "bg-surface-container-highest text-primary ring-1 ring-primary/20"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Ingredientes</label>
            <div className="flex flex-wrap gap-xs p-sm bg-surface-container-lowest border border-outline-variant rounded-lg min-h-[60px]">
              {ingredientes.map((ing) => (
                <button key={ing.id} type="button" onClick={() => !readonly && toggleIng(ing.id)}
                  className={`px-sm py-1 rounded-lg font-label-sm text-label-sm transition-colors ${
                    selectedIngs.includes(ing.id)
                      ? "bg-surface-container-highest text-primary ring-1 ring-primary/20"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {ing.nombre}
                </button>
              ))}
            </div>
          </div>
        </form>
        <div className="px-xl py-xl border-t border-outline-variant grid grid-cols-2 gap-lg bg-surface-container-high">
          <button type="button" onClick={onClose} className="px-lg py-md border border-outline-variant text-on-surface font-semibold rounded-lg hover:bg-surface-container-highest transition-colors active:scale-[0.98]">
            Cancelar
          </button>
          {!readonly && (
            <button type="submit" onClick={handleSubmit} className="px-lg py-md bg-primary text-on-primary font-bold rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
              {isEdit ? "Guardar Cambios" : "Crear Producto"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
