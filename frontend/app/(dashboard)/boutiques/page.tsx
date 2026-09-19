"use client";

import React, { useState } from "react";
import { Plus, Store, X, Check, MapPin } from "lucide-react";
import { useBoutique } from "@/lib/store/boutique-store";

function ModalNouvelleBoutique({ onClose }: { onClose: () => void }) {
  const { ajouterBoutique } = useBoutique();
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");

  function valider() {
    if (!nom) return;
    ajouterBoutique({ nom, adresse, statut: "actif" });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Nouvelle boutique</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-gray-300"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-300 font-medium mb-1.5 block">Nom de la boutique</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex : Boutique Dassasgho" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500" />
          </div>
          <div>
            <label className="text-xs text-gray-300 font-medium mb-1.5 block">Adresse</label>
            <input value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Ex : Dassasgho, Ouagadougou" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-600 text-sm text-gray-300 font-medium">Annuler</button>
          <button onClick={valider} disabled={!nom} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium disabled:opacity-40">
            <Check size={15} /> Créer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Boutiques() {
  const { boutiques } = useBoutique();
  const [modal, setModal] = useState(false);

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Boutiques</h1>
          <p className="text-sm text-slate-500 mt-1">{boutiques.length} point(s) de vente enregistré(s).</p>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium">
          <Plus size={16} /> Nouvelle boutique
        </button>
      </div>

      {boutiques.length === 0 ? (
        <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
            <Store size={24} className="text-teal-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Aucune boutique enregistrée</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Ajoute ta première boutique pour commencer. Tu pourras ensuite en ajouter d'autres si tu gères plusieurs points de vente.
          </p>
          <button onClick={() => setModal(true)} className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium">
            <Plus size={15} /> Ajouter ma première boutique
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {boutiques.map((b) => (
            <div key={b.id} className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                  <Store size={18} className="text-teal-400" />
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-teal-500/10 text-teal-400">Actif</span>
              </div>
              <p className="text-base font-semibold text-white mb-1">{b.nom}</p>
              <div className="flex items-center gap-1.5">
                <MapPin size={12} className="text-slate-500" />
                <p className="text-xs text-slate-500">{b.adresse || "Adresse non renseignée"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <ModalNouvelleBoutique onClose={() => setModal(false)} />}
    </div>
  );
}