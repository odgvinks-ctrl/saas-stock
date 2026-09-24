"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Package, Boxes, ShoppingCart, Store,
  Users, BarChart3, Settings, LogOut, Bell, AlertCircle
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

function BandeauAbonnement() {
  const [statut, setStatut] = useState<string | null>(null);

  useEffect(() => {
    async function verifier() {
      const supabase = creerClientSupabase();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: profil } = await supabase
        .from("profils")
        .select("boutique_id")
        .eq("id", userData.user.id)
        .single();
      if (!profil?.boutique_id) return;

      const { data: abonnement } = await supabase
        .from("abonnements")
        .select("statut_paiement")
        .eq("boutique_id", profil.boutique_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      setStatut(abonnement?.statut_paiement ?? null);
    }
    verifier();
  }, []);

  if (statut !== "en_attente") return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center gap-3">
      <AlertCircle size={16} className="text-amber-400 shrink-0" />
      <p className="text-sm text-amber-200">
        Ton abonnement est en attente de confirmation. Envoie <span className="font-semibold">5 000 F</span> au{" "}
        <span className="font-semibold">Wave/Orange Money : 70 00 00 00</span> avec le nom de ta boutique en référence — ton accès sera confirmé sous peu.
      </p>
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
        <BandeauAbonnement />
        <header className="h-16 shrink-0 bg-slate-800 border-b border-slate-700 flex items-center justify-end gap-3 px-6">
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