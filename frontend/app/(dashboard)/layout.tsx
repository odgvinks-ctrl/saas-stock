"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { creerClientSupabase } from "@/lib/supabase/client";
import {
  LayoutDashboard, Package, Boxes, ShoppingCart, Store,
  Users, BarChart3, Settings, LogOut
} from "lucide-react";

const menu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Produits", href: "/produits", icon: Package },
  { label: "Stock", href: "/stock", icon: Boxes },
  { label: "Ventes", href: "/ventes", icon: ShoppingCart },
  { label: "Boutiques", href: "/boutiques", icon: Store },
  { label: "Employés", href: "/employes", icon: Users },
  { label: "Rapports", href: "/rapports", icon: BarChart3 },
  { label: "Paramètres", href: "/parametres", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
const supabase = creerClientSupabase();

async function seDeconnecter() {
  await supabase.auth.signOut();
  router.push("/login");
  router.refresh();
}

  return (
    <div className="flex min-h-screen bg-[#161821] text-white/90">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-serif { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[#1E212C] border-r border-white/5 flex flex-col p-5">
        <div className="flex items-center gap-2.5 mb-8 px-1">
          <div className="w-8 h-8 rounded-lg bg-[#E8A33D] flex items-center justify-center">
            <Package size={16} className="text-[#161821]" />
          </div>
          <div>
            <p className="font-serif text-base text-white/95 leading-none">Boutique+</p>
            <p className="text-[10px] text-white/35 mt-0.5">Gestion de stock</p>
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
                  isActive
                    ? "bg-[#E8A33D]/12 text-[#E8A33D]"
                    : "text-white/50 hover:text-white/85 hover:bg-white/[0.03]"
                }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#4F9D8D]/20 flex items-center justify-center text-xs font-medium text-[#4F9D8D]">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white/85 truncate">Aïcha Traoré</p>
              <p className="text-[11px] text-white/35">Propriétaire</p>
            </div>
          </div>
          <button
              onClick={seDeconnecter}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-[#C1502E] w-full transition"
          >
              <LogOut size={16} />
              Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}