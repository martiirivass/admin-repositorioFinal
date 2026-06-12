import { useState, useEffect, useCallback } from "react";
import type { ProductoReadWithRelations, ProductoCreate, ProductoUpdate } from "../types";

export interface UseProductFormReturn {
  nombre: string;
  setNombre: (v: string) => void;
  descripcion: string;
  setDescripcion: (v: string) => void;
  precio: number;
  setPrecio: (v: number) => void;
  stock: number;
  setStock: (v: number) => void;
  disponible: boolean;
  setDisponible: (v: boolean) => void;
  selectedCats: number[];
  selectedIngs: number[];
  toggleCat: (id: number) => void;
  toggleIng: (id: number) => void;
  buildSubmitData: () => ProductoCreate | ProductoUpdate;
}

export function useProductForm(producto: ProductoReadWithRelations | null): UseProductFormReturn {
  const isEdit = !!producto;

  const [nombre, setNombre] = useState(producto?.nombre || "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion || "");
  const [precio, setPrecio] = useState(producto?.precio || 0);
  const [stock, setStock] = useState(producto?.stock_cantidad || 0);
  const [disponible, setDisponible] = useState(producto?.disponible ?? true);
  const [selectedCats, setSelectedCats] = useState<number[]>(
    producto?.categorias?.map((c: { id: number }) => c.id) || []
  );
  const [selectedIngs, setSelectedIngs] = useState<number[]>(
    producto?.ingredientes?.map((i: { id: number }) => i.id) || []
  );

  // Inicializar cuando cambia el producto (útil si el drawer NO se desmonta)
  useEffect(() => {
    if (!producto) return;
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion || "");
    setPrecio(producto.precio);
    setStock(producto.stock_cantidad);
    setDisponible(producto.disponible);
    setSelectedCats(producto.categorias?.map((c: { id: number }) => c.id) || []);
    setSelectedIngs(producto.ingredientes?.map((i: { id: number }) => i.id) || []);
  }, [producto]);

  const toggleCat = useCallback((id: number) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const toggleIng = useCallback((id: number) => {
    setSelectedIngs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const buildSubmitData = useCallback((): ProductoCreate | ProductoUpdate => {
    if (isEdit) {
      return {
        nombre: nombre || undefined,
        descripcion: descripcion || undefined,
        precio_base: precio || undefined,
        stock_cantidad: stock,
        disponible,
        categoria_ids: selectedCats.length ? selectedCats : undefined,
        ingrediente_ids: selectedIngs.length ? selectedIngs : undefined,
      } as ProductoUpdate;
    }
    return {
      nombre,
      descripcion: descripcion || null,
      precio_base: precio,
      stock_cantidad: stock,
      disponible,
      categoria_ids: selectedCats,
      ingrediente_ids: selectedIngs,
    } as ProductoCreate;
  }, [isEdit, nombre, descripcion, precio, stock, disponible, selectedCats, selectedIngs]);

  return {
    nombre, setNombre,
    descripcion, setDescripcion,
    precio, setPrecio,
    stock, setStock,
    disponible, setDisponible,
    selectedCats, selectedIngs,
    toggleCat, toggleIng,
    buildSubmitData,
  };
}
