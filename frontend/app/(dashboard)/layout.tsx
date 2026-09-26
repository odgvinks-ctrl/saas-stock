"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Package, Boxes, ShoppingCart, Store,
  Users, BarChart3, Settings, LogOut, Bell, Clock
} from "lucide-react";
import { BoutiqueProvider, useBoutique } from "@/lib/store/boutique-store";
import { creerClientSupabase } from "@/lib/supabase/client";

const menu = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Produits", href: "/produits", icon: Package },
  { label: "Stock", href: "/stock", icon: Boxes },
  { label: "Ventes", href: "/ventes", icon: ShoppingCart },
  { label: "Employés", href: "/employes", icon: Users },
  { label: "Rapports", href: "/rapports", icon: BarChart3 },
  { label: "Paramètres", href: "/parametres", icon: Settings },
];

function DecompteAbonnement() {
  const [joursRestants, setJoursRestants] = useState<number | null>(null);
  const [estSuperAdmin, setEstSuperAdmin] = useState(false);

  useEffect(() => {
    async function charger() {
      const supabase = creerClientSupabase();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: profilSupabase } = await supabase
        .from("profils")
        .select("boutique_id, est_super_admin")
        .eq("id", userData.user.id)
        .single();

      if (profilSupabase?.est_super_admin) {
        setEstSuperAdmin(true);
        return;
      }
      if (!profilSupabase?.boutique_id) return;

      const { data: abonnement } = await supabase
        .from("abonnements")
        .select("date_fin, statut_paiement")
        .eq("boutique_id", profilSupabase.boutique_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (abonnement?.statut_paiement === "paye" && abonnement.date_fin) {
        const fin = new Date(abonnement.date_fin).getTime();
        const maintenant = new Date().setHours(0, 0, 0, 0);
        const jours = Math.ceil((fin - maintenant) / (1000 * 60 * 60 * 24));
        setJoursRestants(jours);
      }
    }
    charger();
  }, []);

  if (estSuperAdmin || joursRestants === null) return null;

  const urgent = joursRestants <= 7;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
      urgent ? "bg-amber-500/10 text-amber-400" : "bg-slate-700 text-slate-300"
    }`}>
      <Clock size={13} />
      {joursRestants > 0
        ? `${joursRestants} jour${joursRestants > 1 ? "s" : ""} restant${joursRestants > 1 ? "s" : ""}`
        : "Expire aujourd'hui"}
    </div>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profil } = useBoutique();
  const nomAffiche = profil.nomProprietaire || "Compléter mon profil";
  const initiale = profil.nomProprietaire ? profil.nomProprietaire.charAt(0).toUpperCase() : "?";

  async function seDeconnecter() {
    const supabase = creerClientSupabase();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-slate-950" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      <aside className="w-64 shrink-0 bg-[#0F172A] flex flex-col p-4">
        <div className="flex items-center gap-2.5 mb-8 px-2 pt-2">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
            <Package size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">
              {profil.nomBoutiquePrincipale || "StockFlow"}
            </p>
            <p className="text-[11px] text-white/45 mt-1">Gestion de stock</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {menu.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname?.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive ? "bg-teal-600 text-white font-medium" : "text-white/55 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-white/15">
          <Link href="/parametres" className="flex items-center gap-3 px-2 py-2 mb-1 hover:bg-white/5 rounded-lg transition">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-xs font-medium text-white shrink-0">
              {initiale}
            </div>
            <div className="min-w-0">
              <p className={`text-sm truncate ${profil.nomProprietaire ? "text-white/90" : "text-white/50 italic"}`}>{nomAffiche}</p>
              <p className="text-[11px] text-white/45">Propriétaire</p>
            </div>
          </Link>
          <button
            onClick={seDeconnecter}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-red-400 hover:bg-white/5 w-full transition"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 bg-slate-800 border-b border-slate-700 flex items-center justify-end gap-3 px-6">
          <DecompteAbonnement />
          <button className="relative w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
            <Bell size={16} className="text-gray-300" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <BoutiqueProvider>
      <DashboardShell>{children}</DashboardShell>
    </BoutiqueProvider>
  );
}