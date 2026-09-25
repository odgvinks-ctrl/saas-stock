"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Package,
  AlertTriangle,
} from "lucide-react";
import { useBoutique, Categorie, Produit } from "@/lib/store/boutique-store";

const CATEGORIES: Categorie[] = [
  "Alimentaire",
  "Hygiène/cosmétiques",
  "Santé",
  "Informatique",
  "Autres",
];

function statutStock(produit: Produit): { label: string; classe: string } {
  if (produit.quantite <= 0) {
    return { label: "Rupture", classe: "bg-red-500/15 text-red-400 border-red-500/30" };
  }
  if (produit.quantite <= produit.seuilAlerte) {
    return { label: "Critique", classe: "bg-red-500/15 text-red-400 border-red-500/30" };
  }
  if (produit.quantite <= produit.seuilAlerte * 2) {
    return { label: "Faible", classe: "bg-amber-500/15 text-amber-400 border-amber-500/30" };
  }
  return { label: "En stock", classe: "bg-teal-500/15 text-teal-400 border-teal-500/30" };
}

function formaterFCFA(montant: number): string {
  return `${montant.toLocaleString("fr-FR")} F`;
}

export default function ProduitsPage() {
  const { produits, ajouterProduit, modifierProduit, supprimerProduit } = useBoutique();

  const [recherche, setRecherche] = useState("");
  const [categorieActive, setCategorieActive] = useState<Categorie | "Toutes">("Toutes");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [produitEnEdition, setProduitEnEdition] = useState<Produit | null>(null);
  const [produitASupprimer, setProduitASupprimer] = useState<Produit | null>(null);

  const [formulaire, setFormulaire] = useState({
    nom: "",
    reference: "",
    categorie: "Alimentaire" as Categorie,
    prixAchat: "",
    prixVente: "",
    quantite: "",
    seuilAlerte: "",
  });

  const produitsFiltres = useMemo(() => {
    return produits.filter((p) => {
      const correspondRecherche =
        p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        p.reference.toLowerCase().includes(recherche.toLowerCase());
      const correspondCategorie =
        categorieActive === "Toutes" || p.categorie === categorieActive;
      return correspondRecherche && correspondCategorie;
    });
  }, [produits, recherche, categorieActive]);

  function reinitialiserFormulaire() {
    setFormulaire({
      nom: "",
      reference: "",
      categorie: "Alimentaire",
      prixAchat: "",
      prixVente: "",
      quantite: "",
      seuilAlerte: "",
    });
    setProduitEnEdition(null);
  }

  function ouvrirEdition(produit: Produit) {
    setProduitEnEdition(produit);
    setFormulaire({
      nom: produit.nom,
      reference: produit.reference,
      categorie: produit.categorie,
      prixAchat: String(produit.prixAchat),
      prixVente: String(produit.prixVente),
      quantite: String(produit.quantite),
      seuilAlerte: String(produit.seuilAlerte),
    });
    setModalOuvert(true);
  }

  function gererSoumission(e: React.FormEvent) {
    e.preventDefault();

    const donnees = {
      nom: formulaire.nom.trim(),
      reference: formulaire.reference.trim(),
      categorie: formulaire.categorie,
      prixAchat: Number(formulaire.prixAchat) || 0,
      prixVente: Number(formulaire.prixVente) || 0,
      quantite: Number(formulaire.quantite) || 0,
      seuilAlerte: Number(formulaire.seuilAlerte) || 0,
    };

    if (!donnees.nom || !donnees.reference) return;

    if (produitEnEdition) {
      modifierProduit(produitEnEdition.id, donnees);
    } else {
      ajouterProduit(donnees);
    }

    reinitialiserFormulaire();
    setModalOuvert(false);
  }

  function confirmerSuppression() {
    if (!produitASupprimer) return;
    supprimerProduit(produitASupprimer.id);
    setProduitASupprimer(null);
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Produits</h1>
          <p className="text-white/50 text-sm mt-1">
            Gère les articles de ta boutique et leur niveau de stock.
          </p>
        </div>
        <button
          onClick={() => {
            reinitialiserFormulaire();
            setModalOuvert(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition"
        >
          <Plus size={16} />
          Nouveau produit
        </button>
      </div>

      {/* Recherche + filtres */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher par nom ou référence..."
            className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategorieActive("Toutes")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              categorieActive === "Toutes"
                ? "bg-teal-600 border-teal-600 text-white"
                : "bg-slate-800 border-slate-600 text-white/60 hover:text-white"
            }`}
          >
            Toutes
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategorieActive(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                categorieActive === cat
                  ? "bg-teal-600 border-teal-600 text-white"
                  : "bg-slate-800 border-slate-600 text-white/60 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau ou état vide */}
      {produitsFiltres.length === 0 ? (
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-12 text-center">
          <Package size={32} className="mx-auto text-white/20 mb-3" />
          <p className="text-white/60 text-sm">
            {produits.length === 0
              ? "Aucun produit pour l'instant. Ajoute ton premier article."
              : "Aucun produit ne correspond à ta recherche."}
          </p>
        </div>
      ) : (
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-left text-white/40 text-xs uppercase tracking-wide">
                  <th className="px-4 py-3 font-medium">Produit</th>
                  <th className="px-4 py-3 font-medium">Catégorie</th>
                  <th className="px-4 py-3 font-medium text-right">Prix achat</th>
                  <th className="px-4 py-3 font-medium text-right">Prix vente</th>
                  <th className="px-4 py-3 font-medium text-right">Marge</th>
                  <th className="px-4 py-3 font-medium text-right">Stock</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {produitsFiltres.map((produit) => {
                  const marge = produit.prixVente - produit.prixAchat;
                  const margePourcent =
                    produit.prixAchat > 0
                      ? Math.round((marge / produit.prixAchat) * 100)
                      : 0;
                  const statut = statutStock(produit);

                  return (
                    <tr
                      key={produit.id}
                      className="border-b border-slate-700/60 last:border-0 hover:bg-slate-700/20 transition"
                    >
                      <td className="px-4 py-3">
                        <p className="text-white font-medium">{produit.nom}</p>
                        <p className="text-white/40 text-xs">{produit.reference}</p>
                      </td>
                      <td className="px-4 py-3 text-white/60">{produit.categorie}</td>
                      <td className="px-4 py-3 text-right text-white/70 font-mono">
                        {formaterFCFA(produit.prixAchat)}
                      </td>
                      <td className="px-4 py-3 text-right text-white/70 font-mono">
                        {formaterFCFA(produit.prixVente)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        <span className={marge >= 0 ? "text-teal-400" : "text-red-400"}>
                          {formaterFCFA(marge)} ({margePourcent}%)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-white font-mono">
                        {produit.quantite}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border ${statut.classe}`}
                        >
                          {statut.label === "Critique" || statut.label === "Rupture" ? (
                            <AlertTriangle size={12} />
                          ) : null}
                          {statut.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => ouvrirEdition(produit)}
                            className="p-1.5 rounded-md text-white/40 hover:text-teal-400 hover:bg-teal-400/10 transition"
                            title="Modifier"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setProduitASupprimer(produit)}
                            className="p-1.5 rounded-md text-white/40 hover:text-red-400 hover:bg-red-400/10 transition"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Nouveau / Modifier produit */}
      {modalOuvert && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">
                {produitEnEdition ? "Modifier le produit" : "Nouveau produit"}
              </h3>
              <button
                onClick={() => {
                  reinitialiserFormulaire();
                  setModalOuvert(false);
                }}
                className="text-white/40 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={gererSoumission} className="space-y-4">
              <div>
                <label className="block text-xs text-white/60 mb-1.5">Nom du produit</label>
                <input
                  type="text"
                  required
                  value={formulaire.nom}
                  onChange={(e) => setFormulaire({ ...formulaire, nom: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Ex : Riz parfumé 5kg"
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5">Référence</label>
                <input
                  type="text"
                  required
                  value={formulaire.reference}
                  onChange={(e) =>
                    setFormulaire({ ...formulaire, reference: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Ex : RIZ-5KG-001"
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5">Catégorie</label>
                <select
                  value={formulaire.categorie}
                  onChange={(e) =>
                    setFormulaire({
                      ...formulaire,
                      categorie: e.target.value as Categorie,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1.5">
                    Prix d&apos;achat (FCFA)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formulaire.prixAchat}
                    onChange={(e) =>
                      setFormulaire({ ...formulaire, prixAchat: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1.5">
                    Prix de vente (FCFA)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formulaire.prixVente}
                    onChange={(e) =>
                      setFormulaire({ ...formulaire, prixVente: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1.5">
                    Quantité en stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formulaire.quantite}
                    onChange={(e) =>
                      setFormulaire({ ...formulaire, quantite: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1.5">
                    Seuil d&apos;alerte
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formulaire.seuilAlerte}
                    onChange={(e) =>
                      setFormulaire({ ...formulaire, seuilAlerte: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    reinitialiserFormulaire();
                    setModalOuvert(false);
                  }}
                  className="flex-1 py-2.5 rounded-lg border border-slate-600 text-white/80 hover:bg-slate-700 transition text-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium transition text-sm"
                >
                  {produitEnEdition ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {produitASupprimer && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-red-500/15 flex items-center justify-center">
                <Trash2 size={16} className="text-red-400" />
              </div>
              <h3 className="text-white font-semibold text-lg">Supprimer ce produit ?</h3>
            </div>
            <p className="text-white/60 text-sm mb-6">
              <span className="text-white font-medium">{produitASupprimer.nom}</span> sera
              définitivement retiré, ainsi que son historique de mouvements de stock. Cette
              action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setProduitASupprimer(null)}
                className="flex-1 py-2 rounded-lg border border-slate-600 text-white/80 hover:bg-slate-700 transition text-sm"
              >
                Annuler
              </button>
              <button
                onClick={confirmerSuppression}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}