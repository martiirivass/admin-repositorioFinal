import { useAuthStore } from "../../store/authStore";
import { HERO_IMAGE } from "../../shared/images";
import { formatARS } from "../../shared/currency";
import { useResumenStats, useVentasSemanales, usePedidosPorEstado, useIngresosPorFormaPago } from "./useDashboard";

const DIAS = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];

export function DashboardPage() {
  const { user } = useAuthStore();
  const { data: stats, isLoading: loadingStats } = useResumenStats();
  const { data: ventas, isLoading: loadingVentas } = useVentasSemanales();
  const { data: pedidosEstado } = usePedidosPorEstado();
  const { data: ingresosFP } = useIngresosPorFormaPago();

  // Encontrar el valor máximo para escalar las barras del gráfico
  const maxVenta = ventas?.data?.length
    ? Math.max(...ventas.data.map((v) => v.total), 1)
    : 1;

  // Colores para los estados de pedido
  const estadoColors: Record<string, string> = {
    PENDIENTE: "bg-amber-500",
    CONFIRMADO: "bg-blue-500",
    EN_PREP: "bg-violet-500",
    ENTREGADO: "bg-emerald-500",
    CANCELADO: "bg-red-500",
    EN_CAMINO: "bg-orange-500",
  };

  // Colores para formas de pago
  const fpColors = ["bg-cyan-500", "bg-pink-500", "bg-teal-500", "bg-indigo-500"];

  return (
    <div>
      <section className="relative h-[200px] rounded-xl overflow-hidden mb-2xl border border-outline-variant">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent flex items-center justify-between px-2xl">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Panel de Control</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Bienvenido de nuevo, {user?.nombre}. Aquí tienes un resumen de hoy.</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-2xl">
        <div className="bg-surface-container border border-outline-variant p-lg rounded-xl flex flex-col justify-between h-40 hover:bg-surface-container-high transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-primary">payments</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Ventas Totales</p>
            <p className="font-headline-md text-headline-md text-on-surface">
              {loadingStats ? "..." : formatARS(stats?.ventas_totales || 0)}
            </p>
          </div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-lg rounded-xl flex flex-col justify-between h-40 hover:bg-surface-container-high transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-primary">shopping_bag</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Pedidos Hoy</p>
            <p className="font-headline-md text-headline-md text-on-surface">
              {loadingStats ? "..." : stats?.pedidos_hoy ?? 0}
            </p>
          </div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-lg rounded-xl flex flex-col justify-between h-40 hover:bg-surface-container-high transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-primary">group_add</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Nuevos Clientes</p>
            <p className="font-headline-md text-headline-md text-on-surface">
              {loadingStats ? "..." : stats?.clientes_nuevos ?? 0}
            </p>
          </div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-lg rounded-xl flex flex-col justify-between h-40 hover:bg-surface-container-high transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-primary">hourglass_top</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Pendientes</p>
            <p className="font-headline-md text-headline-md text-on-surface">
              {loadingStats ? "..." : stats?.pedidos_pendientes ?? 0}
            </p>
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
            {loadingVentas
              ? Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className="flex-1 bg-surface-container-highest rounded-lg animate-pulse" style={{ height: "30%" }} />
                ))
              : ventas?.data?.map((v, i) => {
                  const altura = maxVenta > 0 ? (v.total / maxVenta) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-xs relative group">
                      <span className="text-[10px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                        {formatARS(v.total)}
                      </span>
                      <div
                        className={`w-full rounded-lg transition-all hover:brightness-110 ${
                          i === 3 || i === 6
                            ? "bg-primary shadow-lg shadow-primary/20"
                            : "bg-surface-container-highest hover:bg-primary-container/20"
                        }`}
                        style={{ height: `${Math.max(altura, 2)}%` }}
                      />
                    </div>
                  );
                })}
          </div>
          <div className="flex justify-between mt-md font-label-sm text-label-sm text-on-surface-variant">
            {DIAS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </section>

        {/* Pedidos por Estado (PieChart reemplazo inline) */}
        <section className="bg-surface-container border border-outline-variant rounded-xl p-lg shadow-sm">
          <h3 className="font-title-lg text-title-lg text-on-surface mb-xl">Pedidos por Estado</h3>
          {pedidosEstado?.data?.length
            ? <div className="space-y-lg">
                {pedidosEstado.data.map((item) => {
                  const total = pedidosEstado.data.reduce((a, b) => a + b.cantidad, 0);
                  const pct = total > 0 ? (item.cantidad / total) * 100 : 0;
                  return (
                    <div key={item.estado_codigo}>
                      <div className="flex justify-between items-center mb-xs">
                        <div className="flex items-center gap-sm">
                          <span className={`w-3 h-3 rounded-full ${estadoColors[item.estado_codigo] || "bg-gray-400"}`} />
                          <span className="font-label-md text-label-md text-on-surface">{item.estado_codigo}</span>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface-variant">{item.cantidad} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${estadoColors[item.estado_codigo] || "bg-gray-400"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            : <p className="font-body-md text-body-md text-on-surface-variant">Sin datos de pedidos</p>
          }
        </section>
      </div>

      {/* Segunda fila: Ingresos por forma de pago */}
      <section className="bg-surface-container border border-outline-variant rounded-xl p-lg shadow-sm mt-lg">
        <h3 className="font-title-lg text-title-lg text-on-surface mb-xl">Ingresos por Forma de Pago</h3>
        {ingresosFP?.data?.length
          ? <div className="space-y-lg">
              {ingresosFP.data.map((item, i) => {
                const maxTotal = Math.max(...ingresosFP.data.map((r) => r.total), 1);
                const pct = (item.total / maxTotal) * 100;
                return (
                  <div key={item.forma_pago_codigo}>
                    <div className="flex justify-between items-center mb-xs">
                      <div className="flex items-center gap-sm">
                        <span className={`w-3 h-3 rounded-full ${fpColors[i % fpColors.length]}`} />
                        <span className="font-label-md text-label-md text-on-surface">{item.forma_pago_codigo}</span>
                      </div>
                      <span className="font-label-md text-label-md text-on-surface-variant">{formatARS(item.total)} ({item.cantidad} pedidos)</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${fpColors[i % fpColors.length]}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          : <p className="font-body-md text-body-md text-on-surface-variant">Sin datos de ingresos</p>
        }
      </section>
    </div>
  );
}
