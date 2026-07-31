"use client";

import React, { useState } from "react";
import {
  Search, Plus, Package, MoreVertical, ChevronDown, X, Image as ImageIcon,
} from "lucide-react";

const produitsData = [
  { id: 1, nom: "Sac de riz 50kg", categorie: "Alimentaire", sku: "RIZ-001", prixAchat: 22000, prixVente: 26000, stock: 34, seuil: 10 },
  { id: 2, nom: "Savon Palmida", categorie: "Hygiène", sku: "SAV-002", prixAchat: 350, prixVente: 500, stock: 6, seuil: 15 },
  { id: 3, nom: "Huile Simmone 5L", categorie: "Alimentaire", sku: "HUI-021", prixAchat: 4200, prixVente: 5000, stock: 3, seuil: 8 },
  { id: 4, nom: "Sucre en sac 1kg", categorie: "Alimentaire", sku: "SUC-014", prixAchat: 550, prixVente: 700, stock: 4, seuil: 20 },
  { id: 5, nom: "Boîte de tomate", categorie: "Alimentaire", sku: "TOM-009", prixAchat: 250, prixVente: 350, stock: 120, seuil: 30 },
  { id: 6, nom: "Sachet de lait", categorie: "Alimentaire", sku: "LAI-005", prixAchat: 300, prixVente: 400, stock: 45, seuil: 20 },
];

const categories = ["Tous", "Alimentaire", "Hygiène", "Boissons", "Divers"];

function StatutStock({ stock, seuil }) {
  if (stock <= seuil * 0.3) {
    return <span className="text-[11px] px-2 py-1 rounded-full bg-[#C1502E]/15 text-[#C1502E]">Critique</span>;
  }
  if (stock <= seuil) {
    return <span className="text-[11px] px-2 py-1 rounded-full bg-[#E8A33D]/15 text-[#E8A33D]">Faible</span>;
  }
  return <span className="text-[11px] px-2 py-1 rounded-full bg-[#4F9D8D]/15 text-[#4F9D8D]">En stock</span>;
}

function ModalNouveauProduit({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1E212C] border border-white/10 rounded-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl text-white/95">Nouveau produit</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white/80">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#161821] border border-dashed border-white/15 flex items-center justify-center shrink-0">
              <ImageIcon size={20} className="text-white/25" />
            </div>
            <button className="text-xs text-[#E8A33D] border border-[#E8A33D]/30 rounded-full px-3 py-1.5">
              Ajouter une photo
            </button>
          </div>

          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Nom du produit</label>
            <input
              placeholder="Ex : Sac de riz 50kg"
              className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50 placeholder:text-white/25"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Prix d'achat (F)</label>
              <input placeholder="0" className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm font-mono outline-none focus:border-[#E8A33D]/50 placeholder:text-white/25" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Prix de vente (F)</label>
              <input placeholder="0" className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm font-mono outline-none focus:border-[#E8A33D]/50 placeholder:text-white/25" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Quantité initiale</label>
              <input placeholder="0" className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm font-mono outline-none focus:border-[#E8A33D]/50 placeholder:text-white/25" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Seuil d'alerte</label>
              <input placeholder="0" className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm font-mono outline-none focus:border-[#E8A33D]/50 placeholder:text-white/25" />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Catégorie</label>
            <div className="relative">
              <select className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none appearance-none focus:border-[#E8A33D]/50">
                {categories.filter(c => c !== "Tous").map((c) => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-white/30 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/10 text-sm text-white/60">
            Annuler
          </button>
          <button className="flex-1 py-2.5 rounded-lg bg-[#E8A33D] text-[#161821] text-sm font-medium">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Produits() {
  const [categorieActive, setCategorieActive] = useState("Tous");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [recherche, setRecherche] = useState("");

  const produitsFiltres = produitsData.filter((p) => {
    const matchCategorie = categorieActive === "Tous" || p.categorie === categorieActive;
    const matchRecherche = p.nom.toLowerCase().includes(recherche.toLowerCase()) || p.sku.toLowerCase().includes(recherche.toLowerCase());
    return matchCategorie && matchRecherche;
  });

  return (
    <div className="p-6 md:p-8" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-serif { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="font-serif text-2xl text-white/95">Produits</p>
          <p className="text-sm text-white/40 mt-1">{produitsData.length} produits enregistrés dans ta boutique.</p>
        </div>
        <button
          onClick={() => setModalOuvert(true)}
          className="flex items-center gap-2 bg-[#E8A33D] text-[#161821] px-4 py-2.5 rounded-full text-sm font-medium"
        >
          <Plus size={16} /> Nouveau produit
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-[#1E212C] border border-white/5 rounded-full px-4 py-2.5 flex-1 max-w-sm">
          <Search size={15} className="text-white/30" />
          <input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Chercher un produit ou une référence..."
            className="bg-transparent text-sm outline-none placeholder:text-white/30 w-full"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategorieActive(c)}
              className={`px-3.5 py-2 rounded-full text-xs whitespace-nowrap transition ${
                categorieActive === c ? "bg-[#E8A33D] text-[#161821]" : "bg-[#1E212C] text-white/50 border border-white/5"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table produits */}
      <div className="rounded-2xl bg-[#1E212C] border border-white/5 overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 border-b border-white/5 text-[11px] uppercase tracking-wider text-white/35">
          <div className="col-span-4">Produit</div>
          <div className="col-span-2">Prix achat</div>
          <div className="col-span-2">Prix vente</div>
          <div className="col-span-1">Marge</div>
          <div className="col-span-1">Stock</div>
          <div className="col-span-1">Statut</div>
          <div className="col-span-1"></div>
        </div>

        {produitsFiltres.map((p) => {
          const marge = Math.round(((p.prixVente - p.prixAchat) / p.prixVente) * 100);
          return (
            <div key={p.id} className="grid grid-cols-12 items-center px-6 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#161821] flex items-center justify-center shrink-0">
                  <Package size={15} className="text-white/30" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white/85 truncate">{p.nom}</p>
                  <p className="text-[11px] text-white/35 font-mono">{p.sku} · {p.categorie}</p>
                </div>
              </div>
              <div className="col-span-2 font-mono text-sm text-white/70">{p.prixAchat.toLocaleString("fr-FR")} F</div>
              <div className="col-span-2 font-mono text-sm text-white/70">{p.prixVente.toLocaleString("fr-FR")} F</div>
              <div className="col-span-1 font-mono text-sm text-[#4F9D8D]">{marge}%</div>
              <div className="col-span-1 font-mono text-sm text-white/85">{p.stock}</div>
              <div className="col-span-1"><StatutStock stock={p.stock} seuil={p.seuil} /></div>
              <div className="col-span-1 flex justify-end">
                <button className="text-white/30 hover:text-white/70">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {produitsFiltres.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-white/40">Aucun produit ne correspond à ta recherche.</p>
          </div>
        )}
      </div>

      {modalOuvert && <ModalNouveauProduit onClose={() => setModalOuvert(false)} />}
    </div>
  );
}