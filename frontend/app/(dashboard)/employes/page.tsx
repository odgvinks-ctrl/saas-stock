"use client";

import React, { useState } from "react";
import { Plus, X, Check, Shield, Users, Trash2, AlertTriangle } from "lucide-react";
import { useBoutique } from "@/lib/store/boutique-store";

const permissions: Record<string, string[]> = {
  Vendeur: ["Enregistrer des ventes", "Consulter le stock"],
  Gestionnaire: ["Enregistrer des ventes", "Gérer le stock", "Voir les rapports", "Gérer les produits"],
};

function ModalNouvelEmploye({ onClose }: { onClose: () => void }) {
  const { boutiques, ajouterEmploye } = useBoutique();
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [role, setRole] = useState<"Vendeur" | "Gestionnaire">("Vendeur");
  const [boutiqueId, setBoutiqueId] = useState(boutiques[0]?.id ?? "");

  function valider() {
    if (!nom) return;
    ajouterEmploye({ nom, telephone, role, boutiqueId: boutiqueId || null, statut: "actif" });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Nouvel employé</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-gray-300"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-300 font-medium mb-1.5 block">Nom complet</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex : Fatimata Kaboré" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500" />
          </div>
          <div>
            <label className="text-xs text-gray-300 font-medium mb-1.5 block">Téléphone</label>
            <input value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="Ex : 70 00 00 00" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500" />
          </div>
          <div>
            <label className="text-xs text-gray-300 font-medium mb-1.5 block">Rôle</label>
            <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-teal-500">
              <option value="Vendeur">Vendeur</option>
              <option value="Gestionnaire">Gestionnaire</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-300 font-medium mb-1.5 block">Boutique assignée</label>
            {boutiques.length === 0 ? (
              <p className="text-xs text-gray-500 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5">
                Aucune boutique créée pour l'instant — ajoute d'abord une boutique.
              </p>
            ) : (
              <select value={boutiqueId} onChange={(e) => setBoutiqueId(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-teal-500">
                {boutiques.map((b) => <option key={b.id} value={b.id}>{b.nom}</option>)}
              </select>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-600 text-sm text-gray-300 font-medium">Annuler</button>
          <button onClick={valider} disabled={!nom} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium disabled:opacity-40">
            <Check size={15} /> Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalConfirmationSuppression({ nomEmploye, onConfirmer, onClose }: { nomEmploye: string; onConfirmer: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-sm p-6">
        <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
          <AlertTriangle size={20} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Retirer cet employé ?</h3>
        <p className="text-sm text-slate-400 mb-6">
          « {nomEmploye} » perdra immédiatement l'accès à la boutique. Cette action est irréversible.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-600 text-sm text-gray-300 font-medium">
            Annuler
          </button>
          <button onClick={onConfirmer} className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-500 transition">
            Retirer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Employes() {
  const { employes, boutiques, supprimerEmploye } = useBoutique();
  const [modal, setModal] = useState(false);
  const [employeASupprimer, setEmployeASupprimer] = useState<{ id: string; nom: string } | null>(null);

  const nomBoutique = (id: string | null) => boutiques.find((b) => b.id === id)?.nom ?? "—";

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Employés</h1>
          <p className="text-sm text-slate-500 mt-1">{employes.length} compte(s) créé(s).</p>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium">
          <Plus size={16} /> Nouvel employé
        </button>
      </div>

      <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm overflow-hidden">
        {employes.length === 0 ? (
          <div className="py-16 text-center px-6">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
              <Users size={20} className="text-teal-400" />
            </div>
            <p className="text-sm font-medium text-gray-100 mb-1">Aucun employé pour l'instant</p>
            <p className="text-sm text-gray-500 mb-5">Ajoute les membres de ton équipe pour leur donner accès à la boutique.</p>
            <button onClick={() => setModal(true)} className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium">
              <Plus size={15} /> Ajouter un employé
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 px-6 py-3 border-b border-slate-700 text-xs uppercase tracking-wider text-gray-500 font-medium">
              <div className="col-span-4">Employé</div>
              <div className="col-span-2">Rôle</div>
              <div className="col-span-3">Boutique</div>
              <div className="col-span-2">Statut</div>
              <div className="col-span-1"></div>
            </div>
            {employes.map((e) => (
              <div key={e.id} className="grid grid-cols-12 items-center px-6 py-3.5 border-b border-slate-700 last:border-0 hover:bg-slate-900">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-500/10 flex items-center justify-center text-xs font-semibold text-teal-400 shrink-0">
                    {e.nom.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm text-white font-medium truncate">{e.nom}</p>
                </div>
                <div className="col-span-2 flex items-center gap-1.5">
                  {e.role === "Gestionnaire" && <Shield size={13} className="text-teal-400" />}
                  <p className="text-sm text-gray-300">{e.role}</p>
                </div>
                <div className="col-span-3"><p className="text-sm text-gray-300">{nomBoutique(e.boutiqueId)}</p></div>
                <div className="col-span-2">
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-teal-500/10 text-teal-400">Actif</span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => setEmployeASupprimer({ id: e.id, nom: e.nom })}
                    className="text-slate-500 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-red-500/10"
                    title="Retirer cet employé"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="mt-6 rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-slate-500" />
          <h3 className="text-base font-semibold text-white">Ce que chaque rôle peut faire</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(permissions).map(([role, actions]) => (
            <div key={role} className="rounded-xl bg-slate-900 border border-slate-700 p-4">
              <p className="text-sm font-medium text-gray-100 mb-2">{role}</p>
              <ul className="space-y-1">
                {actions.map((a) => (
                  <li key={a} className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-teal-500" /> {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {modal && <ModalNouvelEmploye onClose={() => setModal(false)} />}

      {employeASupprimer && (
        <ModalConfirmationSuppression
          nomEmploye={employeASupprimer.nom}
          onClose={() => setEmployeASupprimer(null)}
          onConfirmer={() => {
            supprimerEmploye(employeASupprimer.id);
            setEmployeASupprimer(null);
          }}
        />
      )}
    </div>
  );
}