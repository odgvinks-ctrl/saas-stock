"use client";

import React, { useState } from "react";
import { Plus, X, Check, MoreVertical, Shield, User } from "lucide-react";

const employes = [
  { id: 1, nom: "Boureima Sawadogo", role: "Vendeur", boutique: "Marché central", statut: "actif", initiale: "B" },
  { id: 2, nom: "Fatimata Kaboré", role: "Vendeuse", boutique: "Zone du Bois", statut: "actif", initiale: "F" },
  { id: 3, nom: "Issa Ouédraogo", role: "Gestionnaire", boutique: "Marché central", statut: "actif", initiale: "I" },
  { id: 4, nom: "Ramata Zongo", role: "Vendeuse", boutique: "Zone du Bois", statut: "inactif", initiale: "R" },
];

const permissions = {
  Vendeur: ["Enregistrer des ventes", "Consulter le stock"],
  Vendeuse: ["Enregistrer des ventes", "Consulter le stock"],
  Gestionnaire: ["Enregistrer des ventes", "Gérer le stock", "Voir les rapports", "Gérer les produits"],
};

function ModalNouvelEmploye({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1E212C] border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl text-white/95">Nouvel employé</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white/80">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Nom complet</label>
            <input placeholder="Ex : Fatimata Kaboré" className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50 placeholder:text-white/25" />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Téléphone</label>
            <input placeholder="Ex : 70 00 00 00" className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm font-mono outline-none focus:border-[#E8A33D]/50 placeholder:text-white/25" />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Rôle</label>
            <select className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50">
              <option>Vendeur</option>
              <option>Gestionnaire</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Boutique assignée</label>
            <select className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50">
              <option>Boutique Marché central</option>
              <option>Boutique Zone du Bois</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm text-white/60">Annuler</button>
          <button onClick={onClose} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#E8A33D] text-[#161821] text-sm font-medium">
            <Check size={15} /> Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Employes() {
  const [modal, setModal] = useState(false);

  return (
    <div className="p-6 md:p-8" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-serif { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <p className="font-serif text-2xl text-white/95">Employés</p>
          <p className="text-sm text-white/40 mt-1">{employes.length} comptes créés.</p>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center gap-2 bg-[#E8A33D] text-[#161821] px-4 py-2.5 rounded-full text-sm font-medium">
          <Plus size={16} /> Nouvel employé
        </button>
      </div>

      <div className="rounded-2xl bg-[#1E212C] border border-white/5 overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 border-b border-white/5 text-[11px] uppercase tracking-wider text-white/35">
          <div className="col-span-4">Employé</div>
          <div className="col-span-2">Rôle</div>
          <div className="col-span-3">Boutique</div>
          <div className="col-span-2">Statut</div>
          <div className="col-span-1"></div>
        </div>

        {employes.map((e) => (
          <div key={e.id} className="grid grid-cols-12 items-center px-6 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
            <div className="col-span-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#4F9D8D]/15 flex items-center justify-center text-xs font-medium text-[#4F9D8D] shrink-0">
                {e.initiale}
              </div>
              <p className="text-sm text-white/85 truncate">{e.nom}</p>
            </div>
            <div className="col-span-2 flex items-center gap-1.5">
              {e.role === "Gestionnaire" && <Shield size={13} className="text-[#E8A33D]" />}
              <p className="text-sm text-white/60">{e.role}</p>
            </div>
            <div className="col-span-3">
              <p className="text-sm text-white/60">{e.boutique}</p>
            </div>
            <div className="col-span-2">
              <span className={`text-[11px] px-2 py-1 rounded-full ${
                e.statut === "actif" ? "bg-[#4F9D8D]/15 text-[#4F9D8D]" : "bg-white/5 text-white/40"
              }`}>
                {e.statut === "actif" ? "Actif" : "Inactif"}
              </span>
            </div>
            <div className="col-span-1 flex justify-end">
              <button className="text-white/30 hover:text-white/70">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-[#1E212C] border border-white/5 p-6">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-white/50" />
          <h3 className="font-serif text-lg text-white/90">Ce que chaque rôle peut faire</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(permissions).map(([role, actions]) => (
            <div key={role} className="rounded-xl bg-[#161821] border border-white/5 p-4">
              <p className="text-sm text-white/85 mb-2">{role}</p>
              <ul className="space-y-1">
                {actions.map((a) => (
                  <li key={a} className="text-xs text-white/40 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#E8A33D]" /> {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {modal && <ModalNouvelEmploye onClose={() => setModal(false)} />}
    </div>
  );
}