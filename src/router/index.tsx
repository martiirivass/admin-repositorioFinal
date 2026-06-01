import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminLayout } from "../features/products/components/AdminLayout";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { ProductsPage } from "../features/products/ProductsPage";
import { CategoriasPage } from "../features/categorias/CategoriasPage";
import { IngredientesPage } from "../features/ingredientes/IngredientesPage";
import { PedidosPage } from "../features/pedidos/PedidosPage";
import { UsuariosPage } from "../features/usuarios/UsuariosPage";
import { PagosPage } from "../features/pagos/PagosPage";
import { UnidadMedidaPage } from "../features/unidad-medida/UnidadMedidaPage";
import { FormaPagoPage } from "../features/forma-pago/FormaPagoPage";
import { EstadoPedidoPage } from "../features/estado-pedido/EstadoPedidoPage";

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
