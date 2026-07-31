"use client";

import React, { useState } from "react";
import {
  Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Smartphone, Banknote, X, Check
} from "lucide-react";

const catalogue = [
  { id: 1, nom: "Sac de riz 50kg", prix: 26000, sku: "RIZ-001" },
  { id: 2, nom: "Savon Palmida", prix: 500, sku: "SAV-002" },
  { id: 3, nom: "Huile Simmone 5L", prix: 5000, sku: "HUI-021" },
  { id: 4, nom: "Sucre en sac 1kg", prix: 700, sku: "SUC-014" },
  { id: 5, nom: "Boîte de tomate", prix: 350, sku: "TOM-009" },
  { id: 6, nom: "Sachet de lait", prix: 400, sku: "LAI-005" },
  { id: 7, nom: "Bouteille d'eau 1.5L", prix: 500, sku: "EAU-003" },
  { id: 8, nom: "Pain de sucre", prix: 300, sku: "PAI-007" },
];

const historique = [
  { id: "V-0192", client: "Client comptoir", montant: 12400, mode: "espèces", heure: "14:32" },
  { id: "V-0191", client: "Client comptoir", montant: 5000, mode: "wave", heure: "13:58" },
  { id: "V-0190", client: "Client comptoir", montant: 26700, mode: "espèces", heure: "13:20" },
];

function ModalPaiement({ total, onClose, onConfirm }: { total: number; onClose: () => void; onConfirm: () => void }) {
  const [mode, setMode] = useState<"especes" | "wave" | "om">("especes");

  const modes = [
    { id: "especes", label: "Espèces", icon: Banknote },
    { id: "wave", label: "Wave", icon: Smartphone },
    { id: "om", label: "Orange Money", icon: CreditCard },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1E212C] border border-white/10 rounded-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl text-white/95">Encaisser</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white/80">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-white/40 mb-1">Montant à encaisser</p>
        <p className="font-mono text-3xl text-[#E8A33D] mb-6">{total.toLocaleString("fr-FR")} F</p>

        <p className="text-xs text-white/40 mb-2">Mode de paiement</p>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {modes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id as any)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs transition ${
                mode === id ? "border-[#E8A33D] bg-[#E8A33D]/10 text-[#E8A33D]" : "border-white/10 text-white/50"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={onConfirm}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#E8A33D] text-[#161821] text-sm font-medium"
        >
          <Check size={16} /> Confirmer la vente
        </button>
      </div>
    </div>
  );
}

export default function Ventes() {
  const [recherche, setRecherche] = useState("");
  const [panier, setPanier] = useState<{ id: number; nom: string; prix: number; qte: number }[]>([]);
  const [modalPaiement, setModalPaiement] = useState(false);
  const [venteConfirmee, setVenteConfirmee] = useState(false);

  const produitsFiltres = catalogue.filter((p) =>
    p.nom.toLowerCase().includes(recherche.toLowerCase()) || p.sku.toLowerCase().includes(recherche.toLowerCase())
  );

  const ajouterAuPanier = (produit: typeof catalogue[0]) => {
    setPanier((prev) => {
      const existant = prev.find((p) => p.id === produit.id);
      if (existant) {
        return prev.map((p) => (p.id === produit.id ? { ...p, qte: p.qte + 1 } : p));
      }
      return [...prev, { id: produit.id, nom: produit.nom, prix: produit.prix, qte: 1 }];
    });
  };

  const modifierQte = (id: number, delta: number) => {
    setPanier((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qte: p.qte + delta } : p))
        .filter((p) => p.qte > 0)
    );
  };

  const retirerDuPanier = (id: number) => {
    setPanier((prev) => prev.filter((p) => p.id !== id));
  };

  const total = panier.reduce((acc, p) => acc + p.prix * p.qte, 0);

  const confirmerVente = () => {
    setModalPaiement(false);
    setVenteConfirmee(true);
    setTimeout(() => {
      setVenteConfirmee(false);
      setPanier([]);
    }, 1800);
  };

  return (
    <div className="p-6 md:p-8" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-serif { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="mb-6">
        <p className="font-serif text-2xl text-white/95">Point de vente</p>
        <p className="text-sm text-white/40 mt-1">Enregistre une vente rapidement.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Catalogue */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-2 bg-[#1E212C] border border-white/5 rounded-full px-4 py-2.5 mb-4">
            <Search size={15} className="text-white/30" />
            <input
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Chercher un produit ou scanner une référence..."
              className="bg-transparent text-sm outline-none placeholder:text-white/30 w-full"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {produitsFiltres.map((p) => (
              <button
                key={p.id}
                onClick={() => ajouterAuPanier(p)}
                className="text-left rounded-xl bg-[#1E212C] border border-white/5 p-4 hover:border-[#E8A33D]/40 transition"
              >
                <p className="text-sm text-white/85 mb-1 line-clamp-2">{p.nom}</p>
                <p className="text-[11px] text-white/30 font-mono mb-2">{p.sku}</p>
                <p className="font-mono text-sm text-[#E8A33D]">{p.prix.toLocaleString("fr-FR")} F</p>
              </button>
            ))}
          </div>
        </div>

        {/* Panier */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-[#1E212C] border border-white/5 p-5 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart size={16} className="text-white/50" />
              <h3 className="font-serif text-lg text-white/90">Panier</h3>
              {panier.length > 0 && (
                <span className="text-[11px] bg-[#E8A33D]/15 text-[#E8A33D] px-2 py-0.5 rounded-full ml-auto">
                  {panier.reduce((a, p) => a + p.qte, 0)} articles
                </span>
              )}
            </div>

            {panier.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-white/30">Le panier est vide.</p>
                <p className="text-xs text-white/20 mt-1">Clique sur un produit pour l'ajouter.</p>
              </div>
            ) : (
              <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
                {panier.map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/85 truncate">{p.nom}</p>
                      <p className="text-[11px] text-white/35 font-mono">{p.prix.toLocaleString("fr-FR")} F / unité</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#161821] rounded-full px-1.5 py-1">
                      <button onClick={() => modifierQte(p.id, -1)} className="text-white/50 hover:text-white/90">
                        <Minus size={13} />
                      </button>
                      <span className="font-mono text-xs w-4 text-center">{p.qte}</span>
                      <button onClick={() => modifierQte(p.id, 1)} className="text-white/50 hover:text-white/90">
                        <Plus size={13} />
                      </button>
                    </div>
                    <button onClick={() => retirerDuPanier(p.id)} className="text-white/25 hover:text-[#C1502E]">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-white/5 pt-4 mb-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/50">Total</p>
                <p className="font-mono text-xl text-[#E8A33D]">{total.toLocaleString("fr-FR")} F</p>
              </div>
            </div>

            <button
              disabled={panier.length === 0}
              onClick={() => setModalPaiement(true)}
              className="w-full py-3 rounded-lg bg-[#E8A33D] text-[#161821] text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Encaisser
            </button>
          </div>
        </div>
      </div>

      {/* Historique du jour */}
      <div className="mt-6 rounded-2xl bg-[#1E212C] border border-white/5 p-6">
        <h3 className="font-serif text-lg text-white/90 mb-4">Ventes du jour</h3>
        <div className="space-y-1">
          {historique.map((v) => (
            <div key={v.id} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
              <p className="text-[11px] text-white/35 font-mono w-20">{v.id}</p>
              <p className="text-sm text-white/70 flex-1">{v.client}</p>
              <span className="text-[11px] px-2 py-1 rounded-full bg-white/5 text-white/50 capitalize">{v.mode}</span>
              <p className="text-[11px] text-white/35 font-mono w-14">{v.heure}</p>
              <p className="font-mono text-sm text-[#4F9D8D] w-24 text-right">{v.montant.toLocaleString("fr-FR")} F</p>
            </div>
          ))}
        </div>
      </div>

      {modalPaiement && (
        <ModalPaiement total={total} onClose={() => setModalPaiement(false)} onConfirm={confirmerVente} />
      )}

      {venteConfirmee && (
        <div className="fixed bottom-6 right-6 bg-[#4F9D8D] text-[#0d1a17] px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg z-50">
          <Check size={16} /> Vente enregistrée avec succès
        </div>
      )}
    </div>
  );
}