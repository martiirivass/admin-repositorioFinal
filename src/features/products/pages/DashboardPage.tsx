import { useAuthStore } from "../../../store/authStore";
import { HERO_IMAGE } from "../../../shared/images";

export function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div>
      <section className="relative h-[200px] rounded-xl overflow-hidden mb-2xl border border-outline-variant">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent flex items-center justify-between px-2xl">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Panel de Control</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Bienvenido de nuevo, {user?.nombre}. Aquí tienes un resumen de hoy.</p>
          </div>
          <button className="bg-primary-container text-white px-lg py-sm rounded-lg font-label-lg font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/10">
            Nuevo Producto
          </button>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-2xl">
        <div className="bg-surface-container border border-outline-variant p-lg rounded-xl flex flex-col justify-between h-40 hover:bg-surface-container-high transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-primary">payments</span>
            <span className="text-primary font-label-sm bg-primary/10 px-xs py-1 rounded-lg border border-primary/20">+12.5%</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Ventas Totales</p>
            <p className="font-headline-md text-headline-md text-on-surface">€42,850.20</p>
          </div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-lg rounded-xl flex flex-col justify-between h-40 hover:bg-surface-container-high transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-primary">shopping_bag</span>
            <span className="text-primary font-label-sm bg-primary/10 px-xs py-1 rounded-lg border border-primary/20">+4 hoy</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Pedidos Hoy</p>
            <p className="font-headline-md text-headline-md text-on-surface">156</p>
          </div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-lg rounded-xl flex flex-col justify-between h-40 hover:bg-surface-container-high transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-primary">group_add</span>
            <span className="text-primary font-label-sm bg-primary/10 px-xs py-1 rounded-lg border border-primary/20">+18%</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Nuevos Clientes</p>
            <p className="font-headline-md text-headline-md text-on-surface">34</p>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <section className="lg:col-span-2 bg-surface-container border border-outline-variant rounded-xl p-lg shadow-sm">
          <div className="flex justify-between items-center mb-xl">
            <h3 className="font-title-lg text-title-lg text-on-surface">Rendimiento Semanal</h3>
            <div className="flex gap-xs items-center">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span className="font-label-sm text-label-sm text-on-surface-variant">Ventas Netas</span>
            </div>
          </div>
          <div className="h-[300px] w-full flex items-end justify-between gap-md pt-lg">
            {[40, 65, 45, 85, 60, 75, 50].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-lg transition-all hover:brightness-110 relative group ${i === 3 ? "bg-primary shadow-lg shadow-primary/20" : "bg-surface-container-highest hover:bg-primary-container/20"}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-md font-label-sm text-label-sm text-on-surface-variant">
            <span>LUN</span><span>MAR</span><span>MIE</span><span>JUE</span><span>VIE</span><span>SAB</span><span>DOM</span>
          </div>
        </section>
        <section className="bg-surface-container border border-outline-variant rounded-xl p-lg shadow-sm">
          <h3 className="font-title-lg text-title-lg text-on-surface mb-xl">Acceso Rápido</h3>
          <div className="space-y-lg">
            <a href="/admin/productos" className="flex items-center gap-md p-md rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
              <div>
                <p className="font-label-lg text-label-lg text-on-surface">Productos</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Gestionar inventario</p>
              </div>
            </a>
            <a href="/admin/pedidos" className="flex items-center gap-md p-md rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-primary">receipt_long</span>
              <div>
                <p className="font-label-lg text-label-lg text-on-surface">Pedidos</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Gestionar pedidos</p>
              </div>
            </a>
            <a href="/admin/categorias" className="flex items-center gap-md p-md rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-primary">category</span>
              <div>
                <p className="font-label-lg text-label-lg text-on-surface">Categorías</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Organizar menú</p>
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
