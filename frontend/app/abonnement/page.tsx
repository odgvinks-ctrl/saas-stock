"use client";

import React, { useState } from "react";
import { Package, Check, Loader2 } from "lucide-react";

const avantages = [
  "Produits et stock illimités",
  "Point de vente (encaissement)",
  "Rapports et bénéfices en temps réel",
  "Alertes de rupture de stock",
  "Gestion des employés",
];

export default function Abonnement() {
  const [chargement, setChargement] = useState<"mensuel" | "annuel" | null>(null);
  const [erreur, setErreur] = useState("");

  async function choisirPlan(plan: "mensuel" | "annuel") {
    setErreur("");
    setChargement(plan);
    try {
      const res = await fetch("/api/paiement/creer-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const donnees = await res.json();
      if (!res.ok || !donnees.checkout_url) {
        setErreur("Impossible de lancer le paiement. Réessaie dans un instant.");
        setChargement(null);
        return;
      }
      window.location.href = donnees.checkout_url;
    } catch {
      setErreur("Une erreur est survenue. Vérifie ta connexion et réessaie.");
      setChargement(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center px-4 py-16" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      <div className="flex items-center gap-2.5 mb-10">
        <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
          <Package size={18} className="text-white" />
        </div>
        <p className="text-white text-lg font-semibold">StockFlow</p>
      </div>

      <h1 className="text-3xl font-semibold text-white text-center mb-3">Active ton abonnement</h1>
      <p className="text-slate-400 text-center max-w-md mb-12">
        Un seul plan, deux façons de payer. Choisis celle qui t'arrange pour accéder à ta boutique.
      </p>

      {erreur && (
        <div className="w-full max-w-2xl rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 mb-6">
          <p className="text-sm text-red-300 text-center">{erreur}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
        {/* Mensuel */}
        <div className="rounded-2xl bg-slate-900 border border-slate-700 p-7 flex flex-col">
          <p className="text-sm text-slate-400 mb-1">Mensuel</p>
          <p className="text-3xl font-bold text-white mb-1">4 000 F<span className="text-sm font-normal text-slate-500">/mois</span></p>
          <p className="text-xs text-slate-500 mb-6">Sans engagement, résilie à tout moment.</p>

          <ul className="space-y-2.5 flex-1 mb-6">
            {avantages.map((a) => (
              <li key={a} className="flex items-center gap-2.5 text-sm text-slate-300">
                <Check size={15} className="text-teal-400 shrink-0" /> {a}
              </li>
            ))}
          </ul>

          <button
            onClick={() => choisirPlan("mensuel")}
            disabled={chargement !== null}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-600 text-white text-sm font-medium hover:bg-slate-800 transition disabled:opacity-50"
          >
            {chargement === "mensuel" ? <Loader2 size={15} className="animate-spin" /> : null}
            Choisir ce plan
          </button>
        </div>

        {/* Annuel — mis en avant */}
        <div className="relative rounded-2xl bg-gradient-to-b from-teal-600/20 to-slate-900 border border-teal-500/50 p-7 flex flex-col">
          <span className="absolute -top-3 left-7 bg-teal-600 text-white text-[11px] font-medium px-3 py-1 rounded-full">
            Économise 8 000 F
          </span>
          <p className="text-sm text-teal-300 mb-1">Annuel</p>
          <p className="text-3xl font-bold text-white mb-1">40 000 F<span className="text-sm font-normal text-slate-400">/an</span></p>
          <p className="text-xs text-slate-400 mb-6">Équivaut à 3 333 F/mois, soit 2 mois offerts.</p>

          <ul className="space-y-2.5 flex-1 mb-6">
            {avantages.map((a) => (
              <li key={a} className="flex items-center gap-2.5 text-sm text-slate-200">
                <Check size={15} className="text-teal-400 shrink-0" /> {a}
              </li>
            ))}
          </ul>

          <button
            onClick={() => choisirPlan("annuel")}
            disabled={chargement !== null}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-500 transition disabled:opacity-50"
          >
            {chargement === "annuel" ? <Loader2 size={15} className="animate-spin" /> : null}
            Choisir ce plan
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-10 text-center max-w-sm">
        Paiement sécurisé par mobile money (Wave, Orange Money) ou carte bancaire, via SasPay.
      </p>
    </div>
  );
}