"use client";

import React, { useState } from "react";
import { Search, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, X, Check, Package, RefreshCw } from "lucide-react";
import { useBoutique } from "@/lib/store/boutique-store";

function StatutStock({ stock, seuil }: { stock: number; seuil: number }) {
  if (stock <= seuil * 0.3) return <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 font-medium">Critique</span>;
  if (stock <= seuil) return <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 font-medium">Faible</span>;
  return <span className="text-xs px-2 py-1 rounded-full bg-teal-500/10 text-teal-400 font-medium">En stock</span>;
}

function ModalMouvement({ type, onClose }: { type: "entree" | "sortie"; onClose: () => void }) {
  const { produits, ajouterMouvement } = useBoutique();
  const [produitId, setProduitId] = useState(produits[0]?.id ?? "");
  const [quantite, setQuantite] = useState("");
  const [note, setNote] = useState("");
  const titres = { entree: "Entrée de stock", sortie: "Sortie de stock" };

  function valider() {
    if (!produitId || !quantite) return;
    ajouterMouvement(type, produitId, Number(quantite), note || undefined);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">{titres[type]}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-gray-300"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-300 font-medium mb-1.5 block">Produit</label>
            <select value={produitId} onChange={(e) => setProduitId(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-teal-500">
              {produits.map((p) => <option key={p.id} value={p.id}>{p.nom} (stock actuel : {p.stock})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-300 font-medium mb-1.5 block">Quantité</label>
            <input value={quantite} onChange={(e) => setQuantite(e.target.value)} placeholder="0" inputMode="numeric" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500" />
          </div>
          <div>
            <label className="text-xs text-gray-300 font-medium mb-1.5 block">Note (optionnel)</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex : réapprovisionnement fournisseur" rows={2} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-600 text-sm text-gray-300 font-medium">Annuler</button>
          <button onClick={valider} disabled={!produitId || !quantite} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium disabled:opacity-40">
            <Check size={15} /> Valider
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Stock() {
  const { produits, mouvements } = useBoutique();
  const [recherche, setRecherche] = useState("");
  const [modal, setModal] = useState<null | "entree" | "sortie">(null);

  const stockFiltre = produits.filter((p) => p.nom.toLowerCase().includes(recherche.toLowerCase()) || p.sku.toLowerCase().includes(recherche.toLowerCase()));
  const totalUnites = produits.reduce((a, p) => a + p.stock, 0);
  const enAlerte = produits.filter((p) => p.stock <= p.seuil).length;

  const depuis24h = Date.now() - 24 * 60 * 60 * 1000;
  const mouvements24h = mouvements.filter((m) => new Date(m.date).getTime() >= depuis24h);
  const volumeEntree = mouvements24h.filter((m) => m.type === "entree").reduce((a, m) => a + m.quantite, 0);
  const volumeSortie = mouvements24h.filter((m) => m.type === "sortie").reduce((a, m) => a + m.quantite, 0);

  const iconesMouvement: any = {
    entree: { icon: ArrowDownCircle, bg: "bg-teal-500/10", fg: "text-teal-400" },
    sortie: { icon: ArrowUpCircle, bg: "bg-red-500/10", fg: "text-red-400" },
    transfert: { icon: ArrowLeftRight, bg: "bg-amber-500/10", fg: "text-amber-400" },
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Mouvements de stock</h1>
          <p className="text-sm text-slate-500 mt-1">{totalUnites.toLocaleString("fr-FR")} unités en stock, {enAlerte} en alerte.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModal("entree")} disabled={produits.length === 0} className="flex items-center gap-2 bg-teal-500/10 text-teal-400 px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-40">
            <ArrowDownCircle size={15} /> Entrée
          </button>
          <button onClick={() => setModal("sortie")} disabled={produits.length === 0} className="flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-40">
            <ArrowUpCircle size={15} /> Sortie
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500">Mouvements (24h)</p>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center"><RefreshCw size={14} className="text-blue-400" /></div>
          </div>
          <p className="text-2xl font-semibold text-white">{mouvements24h.length}</p>
        </div>
        <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-5">
          <p className="text-sm text-slate-500 mb-2">Volume d'entrée</p>
          <p className="text-2xl font-semibold text-teal-400">+{volumeEntree} articles</p>
        </div>
        <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-5">
          <p className="text-sm text-slate-500 mb-2">Volume de sortie</p>
          <p className="text-2xl font-semibold text-red-400">-{volumeSortie} articles</p>
        </div>
        <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-5">
          <p className="text-sm text-slate-500 mb-2">Ruptures constatées</p>
          <p className="text-2xl font-semibold text-white">{enAlerte} articles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 rounded-xl bg-slate-800 border border-slate-700 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-700">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5">
              <Search size={15} className="text-slate-500" />
              <input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Chercher un produit..." className="bg-transparent text-sm text-white outline-none placeholder:text-slate-500 w-full" />
            </div>
          </div>
          {produits.length === 0 ? (
            <div className="py-16 text-center px-6">
              <p className="text-sm font-medium text-gray-100 mb-1">Aucun produit à afficher</p>
              <p className="text-sm text-gray-500">Ajoute des produits dans la section Produits d'abord.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-12 px-5 py-3 border-b border-slate-700 text-xs uppercase tracking-wider text-gray-500 font-medium">
                <div className="col-span-6">Produit</div>
                <div className="col-span-2">Quantité</div>
                <div className="col-span-2">Seuil</div>
                <div className="col-span-2">Statut</div>
              </div>
              {stockFiltre.map((p) => (
                <div key={p.id} className="grid grid-cols-12 items-center px-5 py-3.5 border-b border-slate-700 last:border-0 hover:bg-slate-900">
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 border border-slate-700 flex items-center justify-center shrink-0"><Package size={14} className="text-gray-500" /></div>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{p.nom}</p>
                      <p className="text-xs text-gray-500">{p.sku}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm font-medium text-white">{p.stock}</div>
                  <div className="col-span-2 text-sm text-gray-500">{p.seuil}</div>
                  <div className="col-span-2"><StatutStock stock={p.stock} seuil={p.seuil} /></div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="lg:col-span-2 rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-6">
          <h3 className="text-base font-semibold text-white mb-4">Derniers mouvements</h3>
          {mouvements.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">Aucun mouvement pour l'instant.</p>
          ) : (
            <div className="space-y-1">
              {mouvements.slice(0, 8).map((m) => {
                const { icon: Icon, bg, fg } = iconesMouvement[m.type];
                return (
                  <div key={m.id} className="flex items-center gap-3 py-2.5 border-b border-slate-700 last:border-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${bg} ${fg}`}><Icon size={14} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-100 truncate">{m.produitNom}</p>
                      <p className="text-xs text-gray-500">{new Date(m.date).toLocaleString("fr-FR")}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-100">{m.quantite}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {modal && <ModalMouvement type={modal} onClose={() => setModal(null)} />}
    </div>
  );
}