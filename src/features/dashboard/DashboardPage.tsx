import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  ResponsiveContainer, Legend,
} from "recharts";
import { useAuthStore } from "../../store/authStore";
import { HERO_IMAGE } from "../../shared/images";
import { formatARS } from "../../shared/currency";
import { CardSkeleton, ChartSkeleton } from "../../shared/components/Skeleton";
import { useResumenStats, useVentasSemanales, usePedidosPorEstado, useIngresosPorFormaPago } from "./useDashboard";

const DIAS = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];

const estadoColors: Record<string, string> = {
  PENDIENTE: "#f59e0b",
  CONFIRMADO: "#3b82f6",
  EN_PREP: "#8b5cf6",
  ENTREGADO: "#10b981",
  CANCELADO: "#ef4444",
  EN_CAMINO: "#f97316",
};

const fpColorsArr = ["#06b6d4", "#ec4899", "#14b8a6", "#6366f1"];

function toRechartsData(data: { fecha: string; total: number }[]) {
  return data.map((item, i) => ({
    dia: DIAS[i % 7],
    total: Number(item.total),
  }));
}

export function DashboardPage() {
  const { user } = useAuthStore();
  const { data: stats, isLoading: loadingStats } = useResumenStats();
  const { data: ventas, isLoading: loadingVentas } = useVentasSemanales();
  const { data: pedidosEstado } = usePedidosPorEstado();
  const { data: ingresosFP } = useIngresosPorFormaPago();

  const chartData = ventas?.data ? toRechartsData(ventas.data) : [];

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
        {loadingStats
          ? Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)
          : <>
              <div className="bg-surface-container border border-outline-variant p-lg rounded-xl flex flex-col justify-between h-40 hover:bg-surface-container-high transition-all shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="material-symbols-outlined text-primary">payments</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Ventas Totales</p>
                  <p className="font-headline-md text-headline-md text-on-surface">{formatARS(stats?.ventas_totales || 0)}</p>
                </div>
              </div>
              <div className="bg-surface-container border border-outline-variant p-lg rounded-xl flex flex-col justify-between h-40 hover:bg-surface-container-high transition-all shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="material-symbols-outlined text-primary">shopping_bag</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Pedidos Hoy</p>
                  <p className="font-headline-md text-headline-md text-on-surface">{stats?.pedidos_hoy ?? 0}</p>
                </div>
              </div>
              <div className="bg-surface-container border border-outline-variant p-lg rounded-xl flex flex-col justify-between h-40 hover:bg-surface-container-high transition-all shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="material-symbols-outlined text-primary">group_add</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Nuevos Clientes</p>
                  <p className="font-headline-md text-headline-md text-on-surface">{stats?.clientes_nuevos ?? 0}</p>
                </div>
              </div>
              <div className="bg-surface-container border border-outline-variant p-lg rounded-xl flex flex-col justify-between h-40 hover:bg-surface-container-high transition-all shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="material-symbols-outlined text-primary">hourglass_top</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Pendientes</p>
                  <p className="font-headline-md text-headline-md text-on-surface">{stats?.pedidos_pendientes ?? 0}</p>
                </div>
              </div>
            </>
        }
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
          {loadingVentas ? <ChartSkeleton /> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="dia" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  formatter={(value: number) => [formatARS(value), "Ventas"]}
                  contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9" }}
                />
                <Bar dataKey="total" radius={[8, 8, 0, 0]} maxBarSize={40}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={i === 3 || i === 6 ? "#3b82f6" : "#334155"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="bg-surface-container border border-outline-variant rounded-xl p-lg shadow-sm">
          <h3 className="font-title-lg text-title-lg text-on-surface mb-xl">Pedidos por Estado</h3>
          {pedidosEstado?.data?.length ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pedidosEstado.data.map((item) => ({
                      name: item.estado_codigo,
                      value: item.cantidad,
                      color: estadoColors[item.estado_codigo] || "#94a3b8",
                    }))}
                    cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                    dataKey="value" paddingAngle={2}
                  >
                    {pedidosEstado.data.map((item) => (
                      <Cell key={item.estado_codigo} fill={estadoColors[item.estado_codigo] || "#94a3b8"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Legend
                formatter={(value: string) => <span style={{ color: "#f1f5f9", fontSize: 12 }}>{value}</span>}
              />
            </div>
          ) : (
            <p className="font-body-md text-body-md text-on-surface-variant">Sin datos de pedidos</p>
          )}
        </section>
      </div>

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
                        <span className={`w-3 h-3 rounded-full`} style={{ backgroundColor: fpColorsArr[i % fpColorsArr.length] }} />
                        <span className="font-label-md text-label-md text-on-surface">{item.forma_pago_codigo}</span>
                      </div>
                      <span className="font-label-md text-label-md text-on-surface-variant">{formatARS(item.total)} ({item.cantidad} pedidos)</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: fpColorsArr[i % fpColorsArr.length] }} />
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
