"use client";

import React, { useMemo, useState } from "react";
import { Package, Wallet, AlertTriangle, TrendingUp, Search, ChevronDown, ArrowDownCircle, ArrowUpCircle, Store } from "lucide-react";
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useBoutique } from "@/lib/store/boutique-store";
import Link from "next/link";

function KpiCard({ icon: Icon, label, value, sub, bg, fg }: any) {
  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}>
          <Icon size={16} className={fg} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
    </div>
  );
}

export default function Dashboard() {
  const { produits, mouvements, ventes, profil } = useBoutique();
  const heureActuelle = new Date().getHours();
  const salutation = heureActuelle < 18 ? "Bonjour" : "Bonsoir";
  const [periode, setPeriode] = useState<"semaine" | "mois">("semaine");

  const auCoursDe = (jours: number) => {
    const limite = Date.now() - jours * 24 * 60 * 60 * 1000;
    return ventes.filter((v) => new Date(v.date).getTime() >= limite);
  };

  const ventesPeriode = auCoursDe(periode === "semaine" ? 7 : 30);
  const recettes = ventesPeriode.reduce((a, v) => a + v.total, 0);
  const depenses = ventesPeriode.reduce((a, v) => a + v.lignes.reduce((s, l) => s + l.prixAchatUnitaire * l.qte, 0), 0);
  const solde = recettes - depenses;

  const valeurStock = produits.reduce((a, p) => a + p.prixVente * p.stock, 0);
  const enAlerte = produits.filter((p) => p.stock <= p.seuil);

  const ventesAujourdhui = auCoursDe(1);
  const totalAujourdhui = ventesAujourdhui.reduce((a, v) => a + v.total, 0);

  const chart = useMemo(() => {
    const jours = periode === "semaine" ? 7 : 30;
    const buckets: { label: string; ca: number }[] = [];
    for (let i = jours - 1; i >= 0; i--) {
      const jour = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const label = periode === "semaine"
        ? jour.toLocaleDateString("fr-FR", { weekday: "short" })
        : jour.getDate().toString();
      const total = ventes
        .filter((v) => new Date(v.date).toDateString() === jour.toDateString())
        .reduce((a, v) => a + v.total, 0);
      buckets.push({ label, ca: total });
    }
    return buckets;
  }, [ventes, periode]);

  const mouvementsRecents = mouvements.slice(0, 5);

  const aucuneDonnee = produits.length === 0;

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {profil.nomProprietaire ? `${salutation}, ${profil.nomProprietaire}` : salutation}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Voici l'état de ta boutique aujourd'hui.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 shadow-sm rounded-lg px-4 py-2.5 w-full md:w-72">
          <Search size={15} className="text-slate-500" />
          <input placeholder="Rechercher un produit, SKU..." className="bg-transparent text-sm text-white outline-none placeholder:text-slate-500 w-full" />
        </div>
      </div>

      {aucuneDonnee ? (
        <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
            <Store size={24} className="text-teal-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Bienvenue dans ta boutique</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Ton tableau de bord est vide pour l'instant. Ajoute ton premier produit pour commencer à suivre ton stock et tes ventes.
          </p>
          <Link href="/produits" className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium">
            Ajouter mon premier produit
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard icon={Package} label="Produits actifs" value={produits.length} sub="Total en catalogue" bg="bg-teal-500/10" fg="text-teal-400" />
            <KpiCard icon={Wallet} label="Valeur du stock" value={`${valeurStock.toLocaleString("fr-FR")} F`} sub="Au prix de vente" bg="bg-blue-500/10" fg="text-blue-400" />
            <KpiCard icon={AlertTriangle} label="Ruptures proches" value={enAlerte.length} sub="À réapprovisionner" bg="bg-red-500/10" fg="text-red-400" />
            <KpiCard icon={TrendingUp} label="Ventes du jour" value={`${totalAujourdhui.toLocaleString("fr-FR")} F`} sub={`${ventesAujourdhui.length} transactions`} bg="bg-amber-500/10" fg="text-amber-400" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
            <div className="lg:col-span-2 rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-white">Bilan</h3>
                <div className="flex bg-slate-700 rounded-full p-1">
                  {(["semaine", "mois"] as const).map((p) => (
                    <button key={p} onClick={() => setPeriode(p)} className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition ${
                      periode === p ? "bg-slate-800 text-white shadow-sm" : "text-slate-500"
                    }`}>{p}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Recettes</p>
                  <p className="text-sm font-semibold text-teal-400">+{recettes.toLocaleString("fr-FR")} F</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Dépenses (coût des ventes)</p>
                  <p className="text-sm font-semibold text-red-400">-{depenses.toLocaleString("fr-FR")} F</p>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-100">Bénéfice net</p>
                  <p className="text-xl font-bold text-white">{solde.toLocaleString("fr-FR")} F</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white">Chiffre d'affaires</h3>
                <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-700 px-3 py-1.5 rounded-lg">
                  {periode === "semaine" ? "7 derniers jours" : "30 derniers jours"} <ChevronDown size={13} />
                </span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chart}>
                  <defs>
                    <linearGradient id="fillGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, fontSize: 12, color: "#F1F5F9" }} formatter={(v: any) => [`${v.toLocaleString("fr-FR")} F`, "CA"]} />
                  <Area type="monotone" dataKey="ca" stroke="#0D9488" strokeWidth={2} fill="url(#fillGreen)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3 rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-6">
              <h3 className="text-base font-semibold text-white mb-4">Mouvements récents</h3>
              {mouvementsRecents.length === 0 ? (
                <p className="text-sm text-gray-500 py-6 text-center">Aucun mouvement pour l'instant.</p>
              ) : (
                <div className="space-y-1">
                  {mouvementsRecents.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 py-2.5 border-b border-slate-700 last:border-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        m.type === "entree" ? "bg-teal-500/10 text-teal-400" : "bg-red-500/10 text-red-400"
                      }`}>
                        {m.type === "entree" ? <ArrowDownCircle size={15} /> : <ArrowUpCircle size={15} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-100 truncate">{m.produitNom}</p>
                        <p className="text-xs text-gray-500">{new Date(m.date).toLocaleString("fr-FR")}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-100">{m.quantite}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-2 rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-6">
              <h3 className="text-base font-semibold text-white mb-4">Alertes de rupture</h3>
              {enAlerte.length === 0 ? (
                <p className="text-sm text-gray-500 py-6 text-center">Aucune alerte pour l'instant.</p>
              ) : (
                <div className="space-y-3">
                  {enAlerte.map((p) => (
                    <div key={p.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-100">{p.nom}</p>
                        <p className="text-xs text-gray-500">{p.sku}</p>
                      </div>
                      <span className="text-sm font-semibold text-red-400">{p.stock} restants</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}