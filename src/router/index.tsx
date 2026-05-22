import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminLayout } from "../features/products/components/AdminLayout";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { DashboardPage } from "../features/products/pages/DashboardPage";
import { ProductsPage } from "../features/products/pages/ProductsPage";
import { CategoriasPage } from "../features/products/pages/CategoriasPage";
import { IngredientesPage } from "../features/products/pages/IngredientesPage";
import { PedidosPage } from "../features/products/pages/PedidosPage";
import { UsuariosPage } from "../features/products/pages/UsuariosPage";
import { PagosPage } from "../features/products/pages/PagosPage";
import { UnidadMedidaPage } from "../features/products/pages/UnidadMedidaPage";
import { FormaPagoPage } from "../features/products/pages/FormaPagoPage";
import { EstadoPedidoPage } from "../features/products/pages/EstadoPedidoPage";

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
      { path: "usuarios", element: <UsuariosPage /> },
      { path: "pagos", element: <PagosPage /> },
      { path: "unidades-medida", element: <UnidadMedidaPage /> },
      { path: "formas-pago", element: <FormaPagoPage /> },
      { path: "estados-pedido", element: <EstadoPedidoPage /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
