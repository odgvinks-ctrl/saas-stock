"use client";

import React, { useMemo, useState } from "react";
import { Download, TrendingUp, TrendingDown, AlertCircle, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { useBoutique } from "@/lib/store/boutique-store";

export default function Rapports() {
  const { produits, ventes } = useBoutique();
  const [periode, setPeriode] = useState<"semaine" | "mois">("semaine");
  const jours = periode === "semaine" ? 7 : 30;

  const ventesPeriode = useMemo(() => {
    const limite = Date.now() - jours * 24 * 60 * 60 * 1000;
    return ventes.filter((v) => new Date(v.date).getTime() >= limite);
  }, [ventes, jours]);

  const recettes = ventesPeriode.reduce((a, v) => a + v.total, 0);
  const depenses = ventesPeriode.reduce((a, v) => a + v.lignes.reduce((s, l) => s + l.prixAchatUnitaire * l.qte, 0), 0);
  const solde = recettes - depenses;
  const margeGlobale = recettes > 0 ? Math.round((solde / recettes) * 100) : 0;

  const chart = useMemo(() => {
    const buckets: { label: string; ca: number }[] = [];
    const nbPoints = periode === "semaine" ? 7 : 4;
    const tailleBucket = periode === "semaine" ? 1 : 7;
    for (let i = nbPoints - 1; i >= 0; i--) {
      const fin = Date.now() - i * tailleBucket * 24 * 60 * 60 * 1000;
      const debut = fin - tailleBucket * 24 * 60 * 60 * 1000;
      const total = ventes.filter((v) => {
        const t = new Date(v.date).getTime();
        return t >= debut && t < fin;
      }).reduce((a, v) => a + v.total, 0);
      const label = periode === "semaine" ? new Date(fin).toLocaleDateString("fr-FR", { weekday: "short" }) : `Sem ${nbPoints - i}`;
      buckets.push({ label, ca: total });
    }
    return buckets;
  }, [ventes, periode]);

  const ventesParProduit = useMemo(() => {
    const map = new Map<string, { nom: string; unites: number; ca: number; derniereDateVente: number }>();
    ventesPeriode.forEach((v) => {
      v.lignes.forEach((l) => {
        const existant = map.get(l.produitId) ?? { nom: l.nom, unites: 0, ca: 0, derniereDateVente: 0 };
        existant.unites += l.qte;
        existant.ca += l.qte * l.prixUnitaire;
        existant.derniereDateVente = Math.max(existant.derniereDateVente, new Date(v.date).getTime());
        map.set(l.produitId, existant);
      });
    });
    return Array.from(map.values());
  }, [ventesPeriode]);

  const meilleuresVentes = [...ventesParProduit].sort((a, b) => b.ca - a.ca).slice(0, 3);

  const produitsSansVenteRecente = produits
    .filter((p) => !ventesParProduit.find((v) => v.nom === p.nom))
    .slice(0, 3);

  const aucuneVente = ventesPeriode.length === 0;

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Rapports</h1>
          <p className="text-sm text-slate-500 mt-1">Bénéfices, pertes et performance de ta boutique.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-700 rounded-full p-1">
            {(["semaine", "mois"] as const).map((p) => (
              <button key={p} onClick={() => setPeriode(p)} className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition ${
                periode === p ? "bg-slate-800 text-white shadow-sm" : "text-slate-500"
              }`}>Cette {p}</button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-xs text-gray-300 bg-slate-800 border border-slate-600 px-3.5 py-2 rounded-lg font-medium">
            <Download size={14} /> Exporter
          </button>
        </div>
      </div>

      {aucuneVente ? (
        <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
            <BarChart3 size={24} className="text-teal-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Pas encore de données</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Dès que tu enregistreras des ventes, tu verras ici ton bénéfice, tes meilleurs produits et ceux qui ne se vendent pas.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Recettes</p>
                <p className="text-2xl font-semibold text-teal-400">+{recettes.toLocaleString("fr-FR")} F</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Dépenses (coût des ventes)</p>
                <p className="text-2xl font-semibold text-red-400">-{depenses.toLocaleString("fr-FR")} F</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Bénéfice net</p>
                <p className="text-2xl font-semibold text-white">{solde.toLocaleString("fr-FR")} F</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Marge globale</p>
                <p className="text-2xl font-semibold text-white">{margeGlobale}%</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chart}>
                <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, fontSize: 12, color: "#F1F5F9" }} formatter={(v: any) => [`${v.toLocaleString("fr-FR")} F`, "Chiffre d'affaires"]} />
                <Bar dataKey="ca" radius={[6, 6, 0, 0]}>
                  {chart.map((_, i) => <Cell key={i} fill="#0D9488" fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-teal-400" />
                <h3 className="text-base font-semibold text-white">Ce qui marche</h3>
              </div>
              {meilleuresVentes.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Aucune vente sur cette période.</p>
              ) : (
                <div className="space-y-3">
                  {meilleuresVentes.map((p, i) => (
                    <div key={p.nom} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-4">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-100 truncate">{p.nom}</p>
                        <p className="text-xs text-gray-500">{p.unites} unités vendues</p>
                      </div>
                      <p className="text-sm font-medium text-teal-400">{p.ca.toLocaleString("fr-FR")} F</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown size={16} className="text-red-400" />
                <h3 className="text-base font-semibold text-white">Ce qui ne marche pas</h3>
              </div>
              {produitsSansVenteRecente.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Tous les produits se vendent sur cette période.</p>
              ) : (
                <div className="space-y-3">
                  {produitsSansVenteRecente.map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-100 truncate">{p.nom}</p>
                        <p className="text-xs text-gray-500">{p.stock} en stock</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 font-medium whitespace-nowrap">Aucune vente</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-start gap-2 mt-4 pt-4 border-t border-slate-700">
                <AlertCircle size={14} className="text-gray-500 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-500">Ces articles immobilisent du capital sans tourner. Pense à une promotion ou à réduire les prochaines commandes.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}