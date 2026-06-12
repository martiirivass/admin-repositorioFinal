import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface SidebarLinkProps {
  to: string;
  icon: string;
  label: string;
}

function SidebarLink({ to, icon, label }: SidebarLinkProps) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-md px-lg py-md transition-colors ${
            isActive
              ? "text-primary font-bold border-r-4 border-primary bg-surface-container-high"
              : "text-on-surface-variant hover:bg-surface-container-high"
          }`
        }
      >
        <span className="material-symbols-outlined">{icon}</span>
        <span className="font-label-lg text-label-lg">{label}</span>
      </NavLink>
    </li>
  );
}

export function AdminLayout() {
  const { user, isLogged, isLoading, checkAuth, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate("/login");
    }
  }, [isLogged, isLoading]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-on-surface-variant font-body-lg">Cargando...</div>
      </div>
    );
  }

  if (!isLogged) return null;

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 h-full w-[280px] bg-surface-container-low border-r border-outline-variant flex flex-col py-lg z-50">
        <div className="px-lg mb-2xl">
          <h1 className="font-headline-md text-headline-md font-bold text-primary">GastroAdmin</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mt-base">Management Suite</p>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-base">
            <SidebarLink to="/admin" icon="dashboard" label="Dashboard" />
            <SidebarLink to="/admin/pedidos" icon="receipt_long" label="Orders" />
            <SidebarLink to="/admin/productos" icon="inventory_2" label="Products" />
            <SidebarLink to="/admin/ingredientes" icon="set_meal" label="Ingredients" />
            <SidebarLink to="/admin/categorias" icon="category" label="Categories" />
            <SidebarLink to="/admin/usuarios" icon="group" label="Users" />
            <SidebarLink to="/admin/pagos" icon="payments" label="Payments" />
            <SidebarLink to="/admin/unidades-medida" icon="straighten" label="Units" />
            <SidebarLink to="/admin/formas-pago" icon="credit_card" label="Pay Methods" />
            <SidebarLink to="/admin/estados-pedido" icon="alt_route" label="Order States" />
          </ul>
        </nav>
        <div className="mt-auto px-lg border-t border-outline-variant pt-lg flex items-center gap-md">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.nombre?.charAt(0) || "A"}
          </div>
          <div className="flex-1">
            <p className="font-label-lg text-label-lg text-on-surface">{user?.nombre || "Admin"}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">{user?.roles?.map(r => r.codigo).join(", ") || "User"}</p>
          </div>
          <button onClick={handleLogout} className="text-on-surface-variant hover:text-error transition-colors" title="Cerrar sesión">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-[280px] px-margin-desktop py-2xl max-w-[calc(100vw-280px)]">
        <Outlet />
      </main>
    </div>
  );
}
