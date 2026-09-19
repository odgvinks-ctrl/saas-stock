"use client";

import React, { useState } from "react";
import { Search, Minus, Plus, Trash2, ShoppingCart, CreditCard, Smartphone, Banknote, X, Check, Package } from "lucide-react";
import { useBoutique } from "@/lib/store/boutique-store";

function ModalPaiement({ total, onClose, onConfirm }: { total: number; onClose: () => void; onConfirm: (mode: "especes" | "wave" | "orange_money") => void }) {
  const [mode, setMode] = useState<"especes" | "wave" | "orange_money">("especes");
  const modes = [
    { id: "especes", label: "Espèces", icon: Banknote },
    { id: "wave", label: "Wave", icon: Smartphone },
    { id: "orange_money", label: "Orange Money", icon: CreditCard },
  ];
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Encaisser</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-gray-300"><X size={18} /></button>
        </div>
        <p className="text-xs text-slate-500 mb-1">Montant à encaisser</p>
        <p className="text-3xl font-bold text-white mb-6">{total.toLocaleString("fr-FR")} F</p>
        <p className="text-xs text-slate-500 mb-2">Mode de paiement</p>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {modes.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setMode(id as any)} className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition ${
              mode === id ? "border-teal-500 bg-teal-500/10 text-teal-400" : "border-slate-600 text-slate-500"
            }`}>
              <Icon size={18} /> {label}
            </button>
          ))}
        </div>
        <button onClick={() => onConfirm(mode)} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-teal-600 text-white text-sm font-medium">
          <Check size={16} /> Confirmer la vente
        </button>
      </div>
    </div>
  );
}

export default function Ventes() {
  const { produits, ventes, enregistrerVente } = useBoutique();
  const [recherche, setRecherche] = useState("");
  const [panier, setPanier] = useState<{ id: string; nom: string; prix: number; qte: number; stockDispo: number }[]>([]);
  const [modalPaiement, setModalPaiement] = useState(false);
  const [venteConfirmee, setVenteConfirmee] = useState(false);

  const catalogue = produits.filter((p) => p.stock > 0);
  const produitsFiltres = catalogue.filter((p) => p.nom.toLowerCase().includes(recherche.toLowerCase()) || p.sku.toLowerCase().includes(recherche.toLowerCase()));

  const ajouterAuPanier = (produit: typeof catalogue[0]) => {
    setPanier((prev) => {
      const existant = prev.find((p) => p.id === produit.id);
      if (existant) {
        if (existant.qte >= produit.stock) return prev;
        return prev.map((p) => (p.id === produit.id ? { ...p, qte: p.qte + 1 } : p));
      }
      return [...prev, { id: produit.id, nom: produit.nom, prix: produit.prixVente, qte: 1, stockDispo: produit.stock }];
    });
  };
  const modifierQte = (id: string, delta: number) => {
    setPanier((prev) => prev.map((p) => (p.id === id ? { ...p, qte: Math.min(p.qte + delta, p.stockDispo) } : p)).filter((p) => p.qte > 0));
  };
  const retirerDuPanier = (id: string) => setPanier((prev) => prev.filter((p) => p.id !== id));
  const total = panier.reduce((acc, p) => acc + p.prix * p.qte, 0);

  const confirmerVente = (mode: "especes" | "wave" | "orange_money") => {
    enregistrerVente(panier.map((p) => ({ produitId: p.id, qte: p.qte })), mode);
    setModalPaiement(false);
    setVenteConfirmee(true);
    setTimeout(() => { setVenteConfirmee(false); setPanier([]); }, 1800);
  };

  const ventesAujourdhui = ventes.filter((v) => new Date(v.date).toDateString() === new Date().toDateString());

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Point de vente</h1>
        <p className="text-sm text-slate-500 mt-1">Enregistre une vente rapidement.</p>
      </div>

      {produits.length === 0 ? (
        <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
            <Package size={24} className="text-teal-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Pas encore de produits</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">Ajoute des produits dans la section Produits avant de pouvoir enregistrer une vente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 shadow-sm rounded-lg px-4 py-2.5 mb-4">
              <Search size={15} className="text-slate-500" />
              <input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Chercher un produit ou scanner une référence..." className="bg-transparent text-sm text-white outline-none placeholder:text-slate-500 w-full" />
            </div>
            {produitsFiltres.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">Aucun produit disponible en stock ne correspond.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {produitsFiltres.map((p) => (
                  <button key={p.id} onClick={() => ajouterAuPanier(p)} className="text-left rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-4 hover:border-teal-400 transition">
                    <p className="text-sm text-white font-medium mb-1 line-clamp-2">{p.nom}</p>
                    <p className="text-xs text-gray-500 mb-2">{p.sku} · {p.stock} en stock</p>
                    <p className="text-sm font-semibold text-teal-400">{p.prixVente.toLocaleString("fr-FR")} F</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-5 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart size={16} className="text-slate-500" />
                <h3 className="text-base font-semibold text-white">Panier</h3>
                {panier.length > 0 && <span className="text-xs bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-full ml-auto font-medium">{panier.reduce((a, p) => a + p.qte, 0)} articles</span>}
              </div>
              {panier.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-gray-500">Le panier est vide.</p>
                  <p className="text-xs text-slate-500 mt-1">Clique sur un produit pour l'ajouter.</p>
                </div>
              ) : (
                <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
                  {panier.map((p) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-100 truncate">{p.nom}</p>
                        <p className="text-xs text-gray-500">{p.prix.toLocaleString("fr-FR")} F / unité</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-700 rounded-full px-1.5 py-1">
                        <button onClick={() => modifierQte(p.id, -1)} className="text-gray-500 hover:text-gray-100"><Minus size={13} /></button>
                        <span className="text-xs w-4 text-center font-medium">{p.qte}</span>
                        <button onClick={() => modifierQte(p.id, 1)} className="text-gray-500 hover:text-gray-100"><Plus size={13} /></button>
                      </div>
                      <button onClick={() => retirerDuPanier(p.id)} className="text-slate-500 hover:text-red-400"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-slate-700 pt-4 mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="text-xl font-bold text-white">{total.toLocaleString("fr-FR")} F</p>
                </div>
              </div>
              <button disabled={panier.length === 0} onClick={() => setModalPaiement(true)} className="w-full py-3 rounded-lg bg-teal-600 text-white text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed">
                Encaisser
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-6">
        <h3 className="text-base font-semibold text-white mb-4">Ventes du jour</h3>
        {ventesAujourdhui.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">Aucune vente enregistrée aujourd'hui.</p>
        ) : (
          <div className="space-y-1">
            {ventesAujourdhui.map((v) => (
              <div key={v.id} className="flex items-center gap-3 py-2.5 border-b border-slate-700 last:border-0">
                <p className="text-xs text-gray-500 w-16">{v.id.slice(0, 6)}</p>
                <p className="text-sm text-gray-300 flex-1">{v.lignes.length} article(s)</p>
                <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-500 capitalize">{v.mode.replace("_", " ")}</span>
                <p className="text-xs text-gray-500 w-14">{new Date(v.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</p>
                <p className="text-sm font-medium text-teal-400 w-24 text-right">{v.total.toLocaleString("fr-FR")} F</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalPaiement && <ModalPaiement total={total} onClose={() => setModalPaiement(false)} onConfirm={confirmerVente} />}
      {venteConfirmee && (
        <div className="fixed bottom-6 right-6 bg-teal-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg z-50">
          <Check size={16} /> Vente enregistrée avec succès
        </div>
      )}
    </div>
  );
}