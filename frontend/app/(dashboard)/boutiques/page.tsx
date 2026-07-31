"use client";

import React, { useState } from "react";
import { Plus, Store, X, Check, MapPin, TrendingUp, Package } from "lucide-react";

const boutiques = [
  { id: 1, nom: "Boutique Marché central", adresse: "Grand marché, Ouagadougou", produits: 312, ca: 452000, statut: "actif" },
  { id: 2, nom: "Boutique Zone du Bois", adresse: "Zone du Bois, Ouagadougou", produits: 198, ca: 290000, statut: "actif" },
  { id: 3, nom: "Dépôt Tampouy", adresse: "Tampouy, Ouagadougou", produits: 87, ca: 0, statut: "inactif" },
];

function ModalNouvelleBoutique({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1E212C] border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl text-white/95">Nouvelle boutique</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white/80">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Nom de la boutique</label>
            <input placeholder="Ex : Boutique Dassasgho" className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50 placeholder:text-white/25" />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Adresse</label>
            <input placeholder="Ex : Dassasgho, Ouagadougou" className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50 placeholder:text-white/25" />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Responsable</label>
            <select className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50">
              <option>Assigner plus tard</option>
              <option>Aïcha Traoré</option>
              <option>Boureima Sawadogo</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm text-white/60">Annuler</button>
          <button onClick={onClose} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#E8A33D] text-[#161821] text-sm font-medium">
            <Check size={15} /> Créer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Boutiques() {
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
          <p className="font-serif text-2xl text-white/95">Boutiques</p>
          <p className="text-sm text-white/40 mt-1">{boutiques.length} points de vente enregistrés.</p>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center gap-2 bg-[#E8A33D] text-[#161821] px-4 py-2.5 rounded-full text-sm font-medium">
          <Plus size={16} /> Nouvelle boutique
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {boutiques.map((b) => (
          <div key={b.id} className="rounded-2xl bg-[#1E212C] border border-white/5 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8A33D]/15 flex items-center justify-center">
                <Store size={18} className="text-[#E8A33D]" />
              </div>
              <span className={`text-[11px] px-2 py-1 rounded-full ${
                b.statut === "actif" ? "bg-[#4F9D8D]/15 text-[#4F9D8D]" : "bg-white/5 text-white/40"
              }`}>
                {b.statut === "actif" ? "Actif" : "Inactif"}
              </span>
            </div>

            <p className="font-serif text-lg text-white/90 mb-1">{b.nom}</p>
            <div className="flex items-center gap-1.5 mb-4">
              <MapPin size={12} className="text-white/30" />
              <p className="text-xs text-white/40">{b.adresse}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Package size={12} className="text-white/30" />
                  <p className="text-[11px] text-white/40">Produits</p>
                </div>
                <p className="font-mono text-sm text-white/85">{b.produits}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp size={12} className="text-white/30" />
                  <p className="text-[11px] text-white/40">CA du mois</p>
                </div>
                <p className="font-mono text-sm text-[#4F9D8D]">{b.ca > 0 ? `${b.ca.toLocaleString("fr-FR")} F` : "—"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && <ModalNouvelleBoutique onClose={() => setModal(false)} />}
    </div>
  );
}