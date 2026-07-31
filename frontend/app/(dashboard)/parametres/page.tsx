"use client";

import React, { useState } from "react";
import { User, Bell, CreditCard, Store, Check } from "lucide-react";

const onglets = [
  { id: "general", label: "Général", icon: Store },
  { id: "compte", label: "Mon compte", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "abonnement", label: "Abonnement", icon: CreditCard },
];

function Toggle({ actif, onClick }: { actif: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-6 rounded-full flex items-center px-0.5 transition ${actif ? "bg-[#E8A33D] justify-end" : "bg-white/10 justify-start"}`}
    >
      <span className="w-5 h-5 rounded-full bg-[#161821]" />
    </button>
  );
}

export default function Parametres() {
  const [ongletActif, setOngletActif] = useState("general");
  const [notifs, setNotifs] = useState({ sms: true, email: false, ruptureStock: true, rappelCommande: true });

  return (
    <div className="p-6 md:p-8" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-serif { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="mb-6">
        <p className="font-serif text-2xl text-white/95">Paramètres</p>
        <p className="text-sm text-white/40 mt-1">Gère ta boutique, ton compte et ton abonnement.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Onglets */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-[#1E212C] border border-white/5 p-2">
            {onglets.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setOngletActif(id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm transition ${
                  ongletActif === id ? "bg-[#E8A33D]/12 text-[#E8A33D]" : "text-white/50 hover:text-white/85"
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu */}
        <div className="lg:col-span-3 rounded-2xl bg-[#1E212C] border border-white/5 p-6">
          {ongletActif === "general" && (
            <div className="space-y-4 max-w-md">
              <h3 className="font-serif text-lg text-white/90 mb-4">Informations de la boutique</h3>
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Nom du commerce</label>
                <input defaultValue="Boutique Aïcha" className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50" />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Devise</label>
                <select className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50">
                  <option>Franc CFA (FCFA)</option>
                </select>
              </div>
              <button className="flex items-center gap-2 bg-[#E8A33D] text-[#161821] px-4 py-2.5 rounded-lg text-sm font-medium mt-2">
                <Check size={15} /> Enregistrer
              </button>
            </div>
          )}

          {ongletActif === "compte" && (
            <div className="space-y-4 max-w-md">
              <h3 className="font-serif text-lg text-white/90 mb-4">Mon compte</h3>
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Nom complet</label>
                <input defaultValue="Aïcha Traoré" className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50" />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Téléphone</label>
                <input defaultValue="70 12 34 56" className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm font-mono outline-none focus:border-[#E8A33D]/50" />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Nouveau mot de passe</label>
                <input type="password" placeholder="••••••••" className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50" />
              </div>
              <button className="flex items-center gap-2 bg-[#E8A33D] text-[#161821] px-4 py-2.5 rounded-lg text-sm font-medium mt-2">
                <Check size={15} /> Mettre à jour
              </button>
            </div>
          )}

          {ongletActif === "notifications" && (
            <div className="space-y-1 max-w-md">
              <h3 className="font-serif text-lg text-white/90 mb-4">Préférences de notifications</h3>
              {[
                { key: "ruptureStock", label: "Alerte de rupture de stock", desc: "Reçois une alerte dès qu'un produit atteint son seuil" },
                { key: "rappelCommande", label: "Rappel de réapprovisionnement", desc: "Rappel hebdomadaire pour les produits à commander" },
                { key: "sms", label: "Notifications par SMS", desc: "Reçois les alertes importantes par SMS" },
                { key: "email", label: "Notifications par email", desc: "Reçois un résumé hebdomadaire par email" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm text-white/85">{label}</p>
                    <p className="text-xs text-white/35 mt-0.5">{desc}</p>
                  </div>
                  <Toggle
                    actif={(notifs as any)[key]}
                    onClick={() => setNotifs((prev) => ({ ...prev, [key]: !(prev as any)[key] }))}
                  />
                </div>
              ))}
            </div>
          )}

          {ongletActif === "abonnement" && (
            <div>
              <h3 className="font-serif text-lg text-white/90 mb-4">Ton abonnement</h3>
              <div className="rounded-xl bg-[#161821] border border-[#E8A33D]/30 p-5 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-white/85">Plan Solo</p>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-[#4F9D8D]/15 text-[#4F9D8D]">Actif</span>
                </div>
                <p className="font-mono text-2xl text-[#E8A33D] mb-1">5 000 F<span className="text-sm text-white/40">/mois</span></p>
                <p className="text-xs text-white/40">Prochain renouvellement le 1er août 2026</p>
              </div>
              <button className="text-sm text-[#E8A33D] border border-[#E8A33D]/30 px-4 py-2 rounded-lg">
                Changer de plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}