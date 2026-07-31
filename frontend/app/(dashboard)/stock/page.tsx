"use client";

import React, { useState } from "react";
import {
  Search, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, Plus, X, Check, Package
} from "lucide-react";

const stockData = [
  { id: 1, nom: "Sac de riz 50kg", sku: "RIZ-001", stock: 34, seuil: 10, categorie: "Alimentaire" },
  { id: 2, nom: "Savon Palmida", sku: "SAV-002", stock: 6, seuil: 15, categorie: "Hygiène" },
  { id: 3, nom: "Huile Simmone 5L", sku: "HUI-021", stock: 3, seuil: 8, categorie: "Alimentaire" },
  { id: 4, nom: "Sucre en sac 1kg", sku: "SUC-014", stock: 4, seuil: 20, categorie: "Alimentaire" },
  { id: 5, nom: "Boîte de tomate", sku: "TOM-009", stock: 120, seuil: 30, categorie: "Alimentaire" },
  { id: 6, nom: "Sachet de lait", sku: "LAI-005", stock: 45, seuil: 20, categorie: "Alimentaire" },
];

const mouvements = [
  { id: "M-0231", type: "entree", produit: "Sac de riz 50kg", qte: 40, date: "24 juil., 09:12", auteur: "Aïcha" },
  { id: "M-0230", type: "sortie", produit: "Savon Palmida", qte: 12, date: "23 juil., 16:40", auteur: "Boureima" },
  { id: "M-0229", type: "transfert", produit: "Huile Simmone 5L", qte: 20, date: "23 juil., 11:05", auteur: "Aïcha" },
  { id: "M-0228", type: "entree", produit: "Boîte de tomate", qte: 200, date: "21 juil., 08:30", auteur: "Aïcha" },
];

function StatutStock({ stock, seuil }: { stock: number; seuil: number }) {
  if (stock <= seuil * 0.3) {
    return <span className="text-[11px] px-2 py-1 rounded-full bg-[#C1502E]/15 text-[#C1502E]">Critique</span>;
  }
  if (stock <= seuil) {
    return <span className="text-[11px] px-2 py-1 rounded-full bg-[#E8A33D]/15 text-[#E8A33D]">Faible</span>;
  }
  return <span className="text-[11px] px-2 py-1 rounded-full bg-[#4F9D8D]/15 text-[#4F9D8D]">En stock</span>;
}

function ModalMouvement({ type, onClose }: { type: "entree" | "sortie" | "transfert"; onClose: () => void }) {
  const titres = { entree: "Entrée de stock", sortie: "Sortie de stock", transfert: "Transfert entre boutiques" };
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1E212C] border border-white/10 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl text-white/95">{titres[type]}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white/80">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Produit</label>
            <select className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50">
              {stockData.map((p) => <option key={p.id}>{p.nom}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Quantité</label>
            <input placeholder="0" className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm font-mono outline-none focus:border-[#E8A33D]/50 placeholder:text-white/25" />
          </div>

          {type === "transfert" && (
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Boutique de destination</label>
              <select className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50">
                <option>Boutique Zone du Bois</option>
                <option>Boutique Marché central</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Note (optionnel)</label>
            <textarea
              placeholder="Ex : réapprovisionnement fournisseur"
              rows={2}
              className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50 placeholder:text-white/25 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm text-white/60">
            Annuler
          </button>
          <button onClick={onClose} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#E8A33D] text-[#161821] text-sm font-medium">
            <Check size={15} /> Valider
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Stock() {
  const [recherche, setRecherche] = useState("");
  const [modal, setModal] = useState<null | "entree" | "sortie" | "transfert">(null);

  const stockFiltre = stockData.filter((p) =>
    p.nom.toLowerCase().includes(recherche.toLowerCase()) || p.sku.toLowerCase().includes(recherche.toLowerCase())
  );

  const totalUnites = stockData.reduce((a, p) => a + p.stock, 0);
  const enAlerte = stockData.filter((p) => p.stock <= p.seuil).length;

  const iconesMouvement = {
    entree: { icon: ArrowDownCircle, tone: "text-[#4F9D8D] bg-[#4F9D8D]/15" },
    sortie: { icon: ArrowUpCircle, tone: "text-[#C1502E] bg-[#C1502E]/15" },
    transfert: { icon: ArrowLeftRight, tone: "text-[#E8A33D] bg-[#E8A33D]/15" },
  };

  return (
    <div className="p-6 md:p-8" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-serif { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <p className="font-serif text-2xl text-white/95">Stock</p>
          <p className="text-sm text-white/40 mt-1">{totalUnites.toLocaleString("fr-FR")} unités en stock, {enAlerte} en alerte.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModal("entree")} className="flex items-center gap-2 bg-[#4F9D8D]/15 text-[#4F9D8D] px-4 py-2.5 rounded-full text-sm font-medium">
            <ArrowDownCircle size={15} /> Entrée
          </button>
          <button onClick={() => setModal("sortie")} className="flex items-center gap-2 bg-[#C1502E]/15 text-[#C1502E] px-4 py-2.5 rounded-full text-sm font-medium">
            <ArrowUpCircle size={15} /> Sortie
          </button>
          <button onClick={() => setModal("transfert")} className="flex items-center gap-2 bg-[#E8A33D]/15 text-[#E8A33D] px-4 py-2.5 rounded-full text-sm font-medium">
            <ArrowLeftRight size={15} /> Transfert
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Vue stock */}
        <div className="lg:col-span-3 rounded-2xl bg-[#1E212C] border border-white/5 overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center gap-2 bg-[#161821] border border-white/5 rounded-full px-4 py-2.5">
              <Search size={15} className="text-white/30" />
              <input
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Chercher un produit..."
                className="bg-transparent text-sm outline-none placeholder:text-white/30 w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 px-5 py-3 border-b border-white/5 text-[11px] uppercase tracking-wider text-white/35">
            <div className="col-span-6">Produit</div>
            <div className="col-span-2">Quantité</div>
            <div className="col-span-2">Seuil</div>
            <div className="col-span-2">Statut</div>
          </div>

          {stockFiltre.map((p) => (
            <div key={p.id} className="grid grid-cols-12 items-center px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
              <div className="col-span-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#161821] flex items-center justify-center shrink-0">
                  <Package size={14} className="text-white/30" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white/85 truncate">{p.nom}</p>
                  <p className="text-[11px] text-white/35 font-mono">{p.sku}</p>
                </div>
              </div>
              <div className="col-span-2 font-mono text-sm text-white/85">{p.stock}</div>
              <div className="col-span-2 font-mono text-sm text-white/40">{p.seuil}</div>
              <div className="col-span-2"><StatutStock stock={p.stock} seuil={p.seuil} /></div>
            </div>
          ))}
        </div>

        {/* Mouvements récents */}
        <div className="lg:col-span-2 rounded-2xl bg-[#1E212C] border border-white/5 p-6">
          <h3 className="font-serif text-lg text-white/90 mb-4">Derniers mouvements</h3>
          <div className="space-y-1">
            {mouvements.map((m) => {
              const { icon: Icon, tone } = iconesMouvement[m.type as keyof typeof iconesMouvement];
              return (
                <div key={m.id} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${tone}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/85 truncate">{m.produit}</p>
                    <p className="text-[11px] text-white/35">{m.date} · {m.auteur}</p>
                  </div>
                  <p className="font-mono text-sm text-white/70">{m.qte}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {modal && <ModalMouvement type={modal} onClose={() => setModal(null)} />}
    </div>
  );
}