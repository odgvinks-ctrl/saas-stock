"use client";

import React, { useState } from "react";
import { Search, Plus, Package, ChevronDown, X, Check, Trash2, AlertTriangle } from "lucide-react";
import { useBoutique } from "@/lib/store/boutique-store";

const categoriesDisponibles = ["Alimentaire", "Hygiène/cosmétiques", "Santé", "Informatique", "Autres"];

function StatutStock({ stock, seuil }: { stock: number; seuil: number }) {
  if (stock <= seuil * 0.3) return <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 font-medium">Critique</span>;
  if (stock <= seuil) return <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 font-medium">Faible</span>;
  return <span className="text-xs px-2 py-1 rounded-full bg-teal-500/10 text-teal-400 font-medium">En stock</span>;
}

function ModalNouveauProduit({ onClose }: { onClose: () => void }) {
  const { ajouterProduit } = useBoutique();
  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState(categoriesDisponibles[0]);
  const [prixAchat, setPrixAchat] = useState("");
  const [prixVente, setPrixVente] = useState("");
  const [stockInitial, setStockInitial] = useState("");
  const [seuil, setSeuil] = useState("");
  const [sku, setSku] = useState("");

  function valider() {
    if (!nom || !prixVente) return;
    ajouterProduit({
      nom,
      categorie,
      sku: sku || nom.slice(0, 3).toUpperCase() + "-" + Math.floor(Math.random() * 900 + 100),
      prixAchat: Number(prixAchat) || 0,
      prixVente: Number(prixVente) || 0,
      stock: Number(stockInitial) || 0,
      seuil: Number(seuil) || 10,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Nouveau produit</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-gray-300"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-300 font-medium mb-1.5 block">Nom du produit</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex : Sac de riz 50kg" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500" />
          </div>
          <div>
            <label className="text-xs text-gray-300 font-medium mb-1.5 block">Référence / SKU (optionnel)</label>
            <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Généré automatiquement si vide" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-300 font-medium mb-1.5 block">Prix d'achat (F)</label>
              <input value={prixAchat} onChange={(e) => setPrixAchat(e.target.value)} placeholder="0" inputMode="numeric" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500" />
            </div>
            <div>
              <label className="text-xs text-gray-300 font-medium mb-1.5 block">Prix de vente (F)</label>
              <input value={prixVente} onChange={(e) => setPrixVente(e.target.value)} placeholder="0" inputMode="numeric" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-300 font-medium mb-1.5 block">Quantité initiale</label>
              <input value={stockInitial} onChange={(e) => setStockInitial(e.target.value)} placeholder="0" inputMode="numeric" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500" />
            </div>
            <div>
              <label className="text-xs text-gray-300 font-medium mb-1.5 block">Seuil d'alerte</label>
              <input value={seuil} onChange={(e) => setSeuil(e.target.value)} placeholder="10" inputMode="numeric" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-300 font-medium mb-1.5 block">Catégorie</label>
            <div className="relative">
              <select value={categorie} onChange={(e) => setCategorie(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm outline-none appearance-none focus:border-teal-500">
                {categoriesDisponibles.map((c) => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-600 text-sm text-gray-300 font-medium">Annuler</button>
          <button onClick={valider} disabled={!nom || !prixVente} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium disabled:opacity-40">
            <Check size={15} /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalConfirmationSuppression({ nomProduit, onConfirmer, onClose }: { nomProduit: string; onConfirmer: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-sm p-6">
        <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
          <AlertTriangle size={20} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Supprimer ce produit ?</h3>
        <p className="text-sm text-slate-400 mb-6">
          « {nomProduit} » sera définitivement supprimé de ton catalogue. Cette action est irréversible.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-600 text-sm text-gray-300 font-medium">
            Annuler
          </button>
          <button onClick={onConfirmer} className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-500 transition">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Produits() {
  const { produits, supprimerProduit } = useBoutique();
  const [produitASupprimer, setProduitASupprimer] = useState<{ id: string; nom: string } | null>(null);
  const [categorieActive, setCategorieActive] = useState("Toutes");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [recherche, setRecherche] = useState("");

  const categories = ["Toutes", ...Array.from(new Set(produits.map((p) => p.categorie)))];

  const produitsFiltres = produits.filter((p) => {
    const matchCategorie = categorieActive === "Toutes" || p.categorie === categorieActive;
    const matchRecherche = p.nom.toLowerCase().includes(recherche.toLowerCase()) || p.sku.toLowerCase().includes(recherche.toLowerCase());
    return matchCategorie && matchRecherche;
  });

  const valeurTotale = produits.reduce((a, p) => a + p.prixVente * p.stock, 0);
  const enAlerte = produits.filter((p) => p.stock <= p.seuil).length;

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Produits</h1>
          <p className="text-sm text-slate-500 mt-1">Vue d'ensemble de tous les articles en vente.</p>
        </div>
        <button onClick={() => setModalOuvert(true)} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium">
          <Plus size={16} /> Ajouter un produit
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500">Total références</p>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center"><Package size={15} className="text-teal-400" /></div>
          </div>
          <p className="text-2xl font-semibold text-white">{produits.length}</p>
        </div>
        <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-5">
          <p className="text-sm text-slate-500 mb-2">Valeur estimée</p>
          <p className="text-2xl font-semibold text-white">{valeurTotale.toLocaleString("fr-FR")} F</p>
        </div>
        <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-5">
          <p className="text-sm text-slate-500 mb-2">Ruptures constatées</p>
          <p className="text-2xl font-semibold text-red-400">{enAlerte} articles</p>
        </div>
        <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-5">
          <p className="text-sm text-slate-500 mb-2">Catégories</p>
          <p className="text-2xl font-semibold text-white">{categories.length - 1}</p>
        </div>
      </div>

      {produits.length > 0 && (
        <>
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 shadow-sm rounded-lg px-4 py-2.5 mb-4 max-w-sm">
            <Search size={15} className="text-slate-500" />
            <input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Rechercher un produit, SKU..." className="bg-transparent text-sm text-white outline-none placeholder:text-slate-500 w-full" />
          </div>

          <div className="flex gap-2 overflow-x-auto mb-4">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategorieActive(c)} className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                categorieActive === c ? "bg-teal-600 text-white" : "bg-slate-800 text-gray-300 border border-slate-600"
              }`}>{c}</button>
            ))}
          </div>
        </>
      )}

      <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm overflow-hidden">
        {produits.length === 0 ? (
          <div className="py-16 text-center px-6">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
              <Package size={20} className="text-teal-400" />
            </div>
            <p className="text-sm font-medium text-gray-100 mb-1">Aucun produit pour l'instant</p>
            <p className="text-sm text-gray-500 mb-5">Ajoute ton premier produit pour commencer à suivre ton stock.</p>
            <button onClick={() => setModalOuvert(true)} className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium">
              <Plus size={15} /> Ajouter un produit
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 px-6 py-3 border-b border-slate-700 text-xs uppercase tracking-wider text-gray-500 font-medium">
              <div className="col-span-4">Produit</div>
              <div className="col-span-2">Prix achat</div>
              <div className="col-span-2">Prix vente</div>
              <div className="col-span-1">Marge</div>
              <div className="col-span-1">Stock</div>
              <div className="col-span-1">Statut</div>
              <div className="col-span-1"></div>
            </div>
            {produitsFiltres.map((p) => {
              const marge = p.prixVente > 0 ? Math.round(((p.prixVente - p.prixAchat) / p.prixVente) * 100) : 0;
              return (
                <div key={p.id} className="grid grid-cols-12 items-center px-6 py-3.5 border-b border-slate-700 last:border-0 hover:bg-slate-900">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-700 border border-slate-700 flex items-center justify-center shrink-0">
                      <Package size={15} className="text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate font-medium">{p.nom}</p>
                      <p className="text-xs text-gray-500">{p.sku} · {p.categorie}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-gray-300">{p.prixAchat.toLocaleString("fr-FR")} F</div>
                  <div className="col-span-2 text-sm text-gray-300">{p.prixVente.toLocaleString("fr-FR")} F</div>
                  <div className="col-span-1 text-sm font-medium text-teal-400">{marge}%</div>
                  <div className="col-span-1 text-sm font-medium text-white">{p.stock}</div>
                  <div className="col-span-1"><StatutStock stock={p.stock} seuil={p.seuil} /></div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => setProduitASupprimer({ id: p.id, nom: p.nom })}
                      className="text-slate-500 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-red-500/10"
                      title="Supprimer ce produit"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {modalOuvert && <ModalNouveauProduit onClose={() => setModalOuvert(false)} />}

      {produitASupprimer && (
        <ModalConfirmationSuppression
          nomProduit={produitASupprimer.nom}
          onClose={() => setProduitASupprimer(null)}
          onConfirmer={() => {
            supprimerProduit(produitASupprimer.id);
            setProduitASupprimer(null);
          }}
        />
      )}
    </div>
  );
}