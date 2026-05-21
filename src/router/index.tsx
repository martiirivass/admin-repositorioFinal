import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminLayout } from "../features/products/components/AdminLayout";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { DashboardPage } from "../features/products/pages/DashboardPage";
import { ProductsPage } from "../features/products/pages/ProductsPage";
import { CategoriasPage } from "../features/products/pages/CategoriasPage";
import { IngredientesPage } from "../features/products/pages/IngredientesPage";
import { PedidosPage } from "../features/products/pages/PedidosPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "productos", element: <ProductsPage /> },
      { path: "categorias", element: <CategoriasPage /> },
      { path: "ingredientes", element: <IngredientesPage /> },
      { path: "pedidos", element: <PedidosPage /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
