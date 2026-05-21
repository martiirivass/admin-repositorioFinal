import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="w-full max-w-[440px] z-10 px-margin-mobile md:px-0">
        <div className="text-center mb-xl">
          <div className="inline-flex items-center gap-xs mb-sm">
            <span className="material-symbols-outlined text-primary text-[48px]">restaurant_menu</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">GastroAdmin</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-base">Enterprise Culinary Control Gateway</p>
        </div>
        <div className="bg-surface-container border border-outline-variant p-xl md:p-2xl rounded-lg shadow-2xl">
          <div className="flex items-center gap-sm mb-lg px-md py-xs bg-surface-container-high rounded-lg w-fit">
            <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Secure Login Required</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-lg">
            <div className="space-y-base">
              <label className="font-label-lg text-label-lg text-on-surface-variant ml-base" htmlFor="email">Administrative Email</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-xl pr-md py-sm text-on-surface font-body-lg placeholder:text-outline/50 transition-all outline-none"
                  placeholder="admin@gastroadmin.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-base">
              <label className="font-label-lg text-label-lg text-on-surface-variant ml-base" htmlFor="password">Access Key</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-xl pr-md py-sm text-on-surface font-body-lg placeholder:text-outline/50 transition-all outline-none"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>
            {error && <p className="text-error font-label-sm text-label-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container hover:brightness-110 transition-all duration-300 py-md rounded-lg flex items-center justify-center gap-sm shadow-lg shadow-primary-container/10 active:scale-[0.98] disabled:opacity-50"
            >
              <span className="font-title-lg text-title-lg text-white">{loading ? "Ingresando..." : "Enter Gateway"}</span>
              <span className="material-symbols-outlined text-white group-hover:translate-x-1 transition-transform">login</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
