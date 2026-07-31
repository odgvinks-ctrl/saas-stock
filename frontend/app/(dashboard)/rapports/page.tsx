"use client";

import React, { useState } from "react";
import {
  Download, TrendingUp, TrendingDown, ChevronDown, ArrowUp, ArrowDown, AlertCircle
} from "lucide-react";
import {
  BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell
} from "recharts";

const donneesSemaine = {
  recettes: 186500, depenses: 121300,
  meilleuresVentes: [
    { nom: "Sac de riz 50kg", unites: 12, ca: 312000 },
    { nom: "Savon Palmida", unites: 84, ca: 42000 },
    { nom: "Bouteille d'eau 1.5L", unites: 96, ca: 48000 },
  ],
  moinsVendus: [
    { nom: "Huile Simmone 5L", unites: 2, joursSansVente: 6 },
    { nom: "Pain de sucre", unites: 3, joursSansVente: 5 },
  ],
  chart: [
    { jour: "Lun", ca: 22000 }, { jour: "Mar", ca: 28500 }, { jour: "Mer", ca: 19000 },
    { jour: "Jeu", ca: 31000 }, { jour: "Ven", ca: 42000 }, { jour: "Sam", ca: 38000 }, { jour: "Dim", ca: 6000 },
  ],
};

const donneesMois = {
  recettes: 742000, depenses: 498200,
  meilleuresVentes: [
    { nom: "Sac de riz 50kg", unites: 48, ca: 1248000 },
    { nom: "Savon Palmida", unites: 310, ca: 155000 },
    { nom: "Boîte de tomate", unites: 420, ca: 147000 },
  ],
  moinsVendus: [
    { nom: "Huile Simmone 5L", unites: 8, joursSansVente: 6 },
    { nom: "Pain de sucre", unites: 11, joursSansVente: 5 },
  ],
  chart: [
    { jour: "Sem 1", ca: 168000 }, { jour: "Sem 2", ca: 191000 }, { jour: "Sem 3", ca: 175000 }, { jour: "Sem 4", ca: 208000 },
  ],
};

export default function Rapports() {
  const [periode, setPeriode] = useState<"semaine" | "mois">("semaine");
  const data = periode === "semaine" ? donneesSemaine : donneesMois;
  const solde = data.recettes - data.depenses;
  const positif = solde >= 0;
  const margeGlobale = Math.round((solde / data.recettes) * 100);

  return (
    <div className="p-6 md:p-8" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-serif { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <p className="font-serif text-2xl text-white/95">Rapports</p>
          <p className="text-sm text-white/40 mt-1">Bénéfices, pertes et performance de ta boutique.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[#1E212C] rounded-full p-1 border border-white/5">
            {(["semaine", "mois"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriode(p)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition ${
                  periode === p ? "bg-[#E8A33D] text-[#161821]" : "text-white/50 hover:text-white/80"
                }`}
              >
                Cette {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-xs text-white/60 bg-[#1E212C] border border-white/5 px-3.5 py-2 rounded-full">
            <Download size={14} /> Exporter
          </button>
        </div>
      </div>

      {/* Bilan principal */}
      <div className="rounded-2xl bg-[#1E212C] border border-white/5 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <p className="text-xs text-white/40 mb-1">Recettes</p>
            <p className="font-mono text-2xl text-[#4F9D8D]">+{data.recettes.toLocaleString("fr-FR")} F</p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Dépenses</p>
            <p className="font-mono text-2xl text-[#C1502E]">-{data.depenses.toLocaleString("fr-FR")} F</p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Bénéfice net</p>
            <p className={`font-mono text-2xl ${positif ? "text-[#E8A33D]" : "text-[#C1502E]"}`}>
              {positif ? "+" : ""}{solde.toLocaleString("fr-FR")} F
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Marge globale</p>
            <p className="font-mono text-2xl text-white/85">{margeGlobale}%</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data.chart}>
            <XAxis dataKey="jour" stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "#161821", border: "1px solid #ffffff10", borderRadius: 10, fontSize: 12 }}
              labelStyle={{ color: "#fff" }}
              formatter={(v: any) => [`${v.toLocaleString("fr-FR")} F`, "Chiffre d'affaires"]}
            />
            <Bar dataKey="ca" radius={[6, 6, 0, 0]}>
              {data.chart.map((_, i) => (
                <Cell key={i} fill="#E8A33D" fillOpacity={0.75} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Meilleures ventes */}
        <div className="rounded-2xl bg-[#1E212C] border border-white/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-[#4F9D8D]" />
            <h3 className="font-serif text-lg text-white/90">Ce qui marche</h3>
          </div>
          <div className="space-y-3">
            {data.meilleuresVentes.map((p, i) => (
              <div key={p.nom} className="flex items-center gap-3">
                <span className="font-mono text-xs text-white/30 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/85 truncate">{p.nom}</p>
                  <p className="text-[11px] text-white/35">{p.unites} unités vendues</p>
                </div>
                <p className="font-mono text-sm text-[#4F9D8D]">{p.ca.toLocaleString("fr-FR")} F</p>
              </div>
            ))}
          </div>
        </div>

        {/* Moins vendus / alertes */}
        <div className="rounded-2xl bg-[#1E212C] border border-white/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={16} className="text-[#C1502E]" />
            <h3 className="font-serif text-lg text-white/90">Ce qui ne marche pas</h3>
          </div>
          <div className="space-y-3">
            {data.moinsVendus.map((p) => (
              <div key={p.nom} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/85 truncate">{p.nom}</p>
                  <p className="text-[11px] text-white/35">{p.unites} unités vendues seulement</p>
                </div>
                <span className="text-[11px] px-2 py-1 rounded-full bg-[#C1502E]/15 text-[#C1502E] whitespace-nowrap">
                  {p.joursSansVente}j sans vente
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 mt-4 pt-4 border-t border-white/5">
            <AlertCircle size={14} className="text-white/30 mt-0.5 shrink-0" />
            <p className="text-xs text-white/40">
              Ces articles immobilisent du capital sans tourner. Pense à une promotion ou à réduire les prochaines commandes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}