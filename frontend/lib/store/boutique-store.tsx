"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// ============================================
// Types
// ============================================
export type Profil = {
  nomProprietaire: string;
  nomBoutiquePrincipale: string;
};

export type Produit = {
  id: string;
  nom: string;
  categorie: string;
  sku: string;
  prixAchat: number;
  prixVente: number;
  stock: number;
  seuil: number;
};

export type Mouvement = {
  id: string;
  type: "entree" | "sortie" | "transfert";
  produitId: string;
  produitNom: string;
  quantite: number;
  note?: string;
  date: string;
};

export type LigneVente = {
  produitId: string;
  nom: string;
  qte: number;
  prixUnitaire: number;
  prixAchatUnitaire: number;
};

export type Vente = {
  id: string;
  date: string;
  mode: "especes" | "wave" | "orange_money";
  lignes: LigneVente[];
  total: number;
};

export type Boutique = {
  id: string;
  nom: string;
  adresse: string;
  statut: "actif" | "inactif";
};

export type Employe = {
  id: string;
  nom: string;
  telephone: string;
  role: "Gestionnaire" | "Vendeur";
  boutiqueId: string | null;
  statut: "actif" | "inactif";
};

type EtatBoutique = {
  profil: Profil;
  produits: Produit[];
  mouvements: Mouvement[];
  ventes: Vente[];
  boutiques: Boutique[];
  employes: Employe[];
};

const CLE_STOCKAGE = "boutique-plus-donnees";

const etatInitial: EtatBoutique = {
  profil: { nomProprietaire: "", nomBoutiquePrincipale: "" },
  produits: [],
  mouvements: [],
  ventes: [],
  boutiques: [],
  employes: [],
};

// ============================================
// Contexte
// ============================================
type ContexteBoutique = EtatBoutique & {
  definirProfil: (p: Profil) => void;
  ajouterProduit: (p: Omit<Produit, "id">) => void;
  ajouterMouvement: (type: Mouvement["type"], produitId: string, quantite: number, note?: string) => void;
  enregistrerVente: (lignes: { produitId: string; qte: number }[], mode: Vente["mode"]) => void;
  ajouterBoutique: (b: Omit<Boutique, "id">) => void;
  ajouterEmploye: (e: Omit<Employe, "id">) => void;
};

const Contexte = createContext<ContexteBoutique | null>(null);

function genererId() {
  return Math.random().toString(36).slice(2, 10);
}

export function BoutiqueProvider({ children }: { children: React.ReactNode }) {
  const [etat, setEtat] = useState<EtatBoutique>(etatInitial);
  const [charge, setCharge] = useState(false);

  useEffect(() => {
    try {
      const sauvegarde = localStorage.getItem(CLE_STOCKAGE);
      if (sauvegarde) setEtat({ ...etatInitial, ...JSON.parse(sauvegarde) });
    } catch {
      // ignoré
    } finally {
      setCharge(true);
    }
  }, []);

  useEffect(() => {
    if (!charge) return;
    try {
      localStorage.setItem(CLE_STOCKAGE, JSON.stringify(etat));
    } catch {
      // ignoré
    }
  }, [etat, charge]);

  function definirProfil(p: Profil) {
    setEtat((prev) => ({ ...prev, profil: p }));
  }

  function ajouterProduit(p: Omit<Produit, "id">) {
    setEtat((prev) => ({ ...prev, produits: [...prev.produits, { ...p, id: genererId() }] }));
  }

  function ajouterMouvement(type: Mouvement["type"], produitId: string, quantite: number, note?: string) {
    setEtat((prev) => {
      const produit = prev.produits.find((p) => p.id === produitId);
      if (!produit) return prev;
      const delta = type === "entree" ? quantite : -quantite;
      const produitsMisAJour = prev.produits.map((p) =>
        p.id === produitId ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      );
      const mouvement: Mouvement = {
        id: genererId(), type, produitId, produitNom: produit.nom, quantite, note, date: new Date().toISOString(),
      };
      return { ...prev, produits: produitsMisAJour, mouvements: [mouvement, ...prev.mouvements] };
    });
  }

  function enregistrerVente(lignes: { produitId: string; qte: number }[], mode: Vente["mode"]) {
    setEtat((prev) => {
      const lignesCompletes: LigneVente[] = lignes.map(({ produitId, qte }) => {
        const produit = prev.produits.find((p) => p.id === produitId)!;
        return { produitId, nom: produit.nom, qte, prixUnitaire: produit.prixVente, prixAchatUnitaire: produit.prixAchat };
      });
      const total = lignesCompletes.reduce((acc, l) => acc + l.prixUnitaire * l.qte, 0);
      const produitsMisAJour = prev.produits.map((p) => {
        const ligne = lignesCompletes.find((l) => l.produitId === p.id);
        return ligne ? { ...p, stock: Math.max(0, p.stock - ligne.qte) } : p;
      });
      const nouveauxMouvements: Mouvement[] = lignesCompletes.map((l) => ({
        id: genererId(), type: "sortie", produitId: l.produitId, produitNom: l.nom, quantite: l.qte, note: "Vente", date: new Date().toISOString(),
      }));
      const vente: Vente = { id: genererId(), date: new Date().toISOString(), mode, lignes: lignesCompletes, total };
      return {
        ...prev,
        produits: produitsMisAJour,
        mouvements: [...nouveauxMouvements, ...prev.mouvements],
        ventes: [vente, ...prev.ventes],
      };
    });
  }

  function ajouterBoutique(b: Omit<Boutique, "id">) {
    setEtat((prev) => ({ ...prev, boutiques: [...prev.boutiques, { ...b, id: genererId() }] }));
  }

  function ajouterEmploye(e: Omit<Employe, "id">) {
    setEtat((prev) => ({ ...prev, employes: [...prev.employes, { ...e, id: genererId() }] }));
  }

  return (
    <Contexte.Provider value={{ ...etat, definirProfil, ajouterProduit, ajouterMouvement, enregistrerVente, ajouterBoutique, ajouterEmploye }}>
      {children}
    </Contexte.Provider>
  );
}

export function useBoutique() {
  const ctx = useContext(Contexte);
  if (!ctx) throw new Error("useBoutique doit être utilisé à l'intérieur de <BoutiqueProvider>");
  return ctx;
}