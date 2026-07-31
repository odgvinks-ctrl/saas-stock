"use client";

import React, { useState } from "react";
import {
  Package, TrendingUp, TrendingDown, AlertTriangle, Wallet,
  ArrowDownCircle, ArrowUpCircle, Search, Bell, ChevronDown
} from "lucide-react";
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from "recharts";

const stockData = [
  { mois: "Jan", valeur: 420000 },
  { mois: "Fév", valeur: 510000 },
  { mois: "Mar", valeur: 480000 },
  { mois: "Avr", valeur: 610000 },
  { mois: "Mai", valeur: 590000 },
  { mois: "Juin", valeur: 720000 },
];

const transactions = [
  { id: "TRX-0001", type: "entree", article: "Sac de riz 50kg", qte: 40, date: "24 juil.", statut: "Terminé" },
  { id: "TRX-0002", type: "sortie", article: "Savon Palmida", qte: 65, date: "23 juil.", statut: "Terminé" },
  { id: "TRX-0003", type: "commande", article: "Huile Simmone", qte: 100, date: "22 juil.", statut: "En attente" },
  { id: "TRX-0004", type: "entree", article: "Boîtes de tomate", qte: 200, date: "21 juil.", statut: "Terminé" },
  { id: "TRX-0005", type: "sortie", article: "Sachets de lait", qte: 30, date: "20 juil.", statut: "Terminé" },
];

const alertes = [
  { nom: "Sucre en sac", sku: "SUC-014", qte: 4 },
  { nom: "Savon Palmida", sku: "SAV-002", qte: 6 },
  { nom: "Huile Simmone", sku: "HUI-021", qte: 3 },
];

function Ledger({ period, setPeriod }: { period: string; setPeriod: (p: string) => void }) {
  const isWeek = period === "semaine";
  const revenus = isWeek ? 186500 : 742000;
  const depenses = isWeek ? 121300 : 498200;
  const solde = revenus - depenses;
  const positif = solde >= 0;

  return (
    <div className="relative rounded-2xl bg-[#1E212C] border border-white/5 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#191B24] border-r border-dashed border-white/10 flex flex-col items-center justify-evenly">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#0F1016]" />
        ))}
      </div>

      <div className="pl-16 pr-6 py-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[11px] tracking-[0.15em] uppercase text-white/40 font-mono mb-1">Bilan</p>
            <h3 className="font-serif text-xl text-white/90">Compte du commerce</h3>
          </div>
          <div className="flex bg-[#161821] rounded-full p-1 border border-white/5">
            {["semaine", "mois"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition ${
                  period === p ? "bg-[#E8A33D] text-[#161821]" : "text-white/50 hover:text-white/80"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-xs text-white/40 mb-1">Recettes</p>
            <p className="font-mono text-lg text-[#4F9D8D]">+{revenus.toLocaleString("fr-FR")}</p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Dépenses</p>
            <p className="font-mono text-lg text-[#C1502E]">-{depenses.toLocaleString("fr-FR")}</p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Solde net</p>
            <p className={`font-mono text-lg ${positif ? "text-[#E8A33D]" : "text-[#C1502E]"}`}>
              {positif ? "+" : ""}{solde.toLocaleString("fr-FR")} F
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-[#161821] px-4 py-2.5 border border-white/5">
          {positif ? (
            <TrendingUp size={15} className="text-[#4F9D8D] shrink-0" />
          ) : (
            <TrendingDown size={15} className="text-[#C1502E] shrink-0" />
          )}
          <p className="text-xs text-white/60">
            {positif
              ? `Le commerce est bénéficiaire cette ${period}. Les ventes de savons et boissons tirent le résultat.`
              : `Perte cette ${period} — vérifie les articles à faible marge ou en rupture.`}
          </p>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, sub, tone }: any) {
  const tones: any = {
    amber: "bg-[#E8A33D]/15 text-[#E8A33D]",
    teal: "bg-[#4F9D8D]/15 text-[#4F9D8D]",
    brick: "bg-[#C1502E]/15 text-[#C1502E]",
  };
  return (
    <div className="rounded-2xl bg-[#1E212C] border border-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tones[tone]}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-xs text-white/40 mb-1">{label}</p>
      <p className="font-mono text-2xl text-white/90">{value}</p>
      <p className="text-[11px] text-white/40 mt-1">{sub}</p>
    </div>
  );
}

export default function Dashboard() {
  const [period, setPeriod] = useState("semaine");

  return (
    <div className="p-6 md:p-8" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-serif { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="font-serif text-2xl text-white/95">Bonsoir, Aïcha 👋</p>
          <p className="text-sm text-white/40 mt-1">Voici l'état de ta boutique aujourd'hui.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1E212C] border border-white/5 rounded-full px-4 py-2.5 w-64">
            <Search size={15} className="text-white/30" />
            <input
              placeholder="Chercher un produit..."
              className="bg-transparent text-sm outline-none placeholder:text-white/30 w-full"
            />
          </div>
          <button className="relative w-10 h-10 rounded-full bg-[#1E212C] border border-white/5 flex items-center justify-center">
            <Bell size={16} className="text-white/50" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C1502E] text-[10px] flex items-center justify-center">3</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={Package} label="Produits actifs" value="312" sub="↑ 8 nouveaux ce mois" tone="amber" />
        <KpiCard icon={Wallet} label="Valeur du stock" value="4,2M F" sub="↑ 6,1% vs mois dernier" tone="teal" />
        <KpiCard icon={AlertTriangle} label="Ruptures proches" value="12" sub="À réapprovisionner" tone="brick" />
        <KpiCard icon={TrendingUp} label="Ventes du jour" value="38 400 F" sub="21 transactions" tone="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        <div className="lg:col-span-2">
          <Ledger period={period} setPeriod={setPeriod} />
        </div>

        <div className="lg:col-span-3 rounded-2xl bg-[#1E212C] border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-white/40 font-mono mb-1">Évolution</p>
              <h3 className="font-serif text-lg text-white/90">Valeur du stock</h3>
            </div>
            <button className="flex items-center gap-1 text-xs text-white/50 bg-[#161821] px-3 py-1.5 rounded-full border border-white/5">
              6 derniers mois <ChevronDown size={13} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stockData}>
              <defs>
                <linearGradient id="fillGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8A33D" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#E8A33D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="mois" stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "#161821", border: "1px solid #ffffff10", borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: "#fff" }}
                formatter={(v: any) => [`${v.toLocaleString("fr-FR")} F`, "Valeur"]}
              />
              <Area type="monotone" dataKey="valeur" stroke="#E8A33D" strokeWidth={2} fill="url(#fillGold)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 rounded-2xl bg-[#1E212C] border border-white/5 p-6">
          <h3 className="font-serif text-lg text-white/90 mb-4">Mouvements récents</h3>
          <div className="space-y-1">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  t.type === "entree" ? "bg-[#4F9D8D]/15 text-[#4F9D8D]" :
                  t.type === "sortie" ? "bg-[#C1502E]/15 text-[#C1502E]" : "bg-[#E8A33D]/15 text-[#E8A33D]"
                }`}>
                  {t.type === "entree" ? <ArrowDownCircle size={14} /> : <ArrowUpCircle size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/85 truncate">{t.article}</p>
                  <p className="text-[11px] text-white/35 font-mono">{t.id} · {t.date}</p>
                </div>
                <p className="font-mono text-sm text-white/70">{t.qte}</p>
                <span className={`text-[11px] px-2 py-1 rounded-full ${
                  t.statut === "Terminé" ? "bg-[#4F9D8D]/15 text-[#4F9D8D]" : "bg-[#E8A33D]/15 text-[#E8A33D]"
                }`}>{t.statut}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-[#1E212C] border border-white/5 p-6">
          <h3 className="font-serif text-lg text-white/90 mb-4">Alertes de rupture</h3>
          <div className="space-y-3">
            {alertes.map((a) => (
              <div key={a.sku} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/85">{a.nom}</p>
                  <p className="text-[11px] text-white/35 font-mono">{a.sku}</p>
                </div>
                <span className="font-mono text-sm text-[#C1502E]">{a.qte} restants</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}