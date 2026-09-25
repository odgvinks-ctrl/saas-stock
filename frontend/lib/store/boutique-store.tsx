"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// ------------------------- Types -------------------------

export type Categorie =
  | "Alimentaire"
  | "Hygiène/cosmétiques"
  | "Santé"
  | "Informatique"
  | "Autres";

export interface Produit {
  id: string;
  nom: string;
  reference: string;
  categorie: Categorie;
  prixAchat: number;
  prixVente: number;
  quantite: number;
  seuilAlerte: number;
  dateCreation: string;
}

export interface MouvementStock {
  id: string;
  produitId: string;
  type: "entree" | "sortie" | "transfert" | "vente";
  quantite: number;
  motif?: string;
  date: string;
}

export interface LigneVente {
  produitId: string;
  nom: string;
  quantite: number;
  prixUnitaire: number;
}

export interface Vente {
  id: string;
  lignes: LigneVente[];
  total: number;
  modePaiement: "especes" | "wave" | "orange_money";
  date: string;
}

export interface Boutique {
  id: string;
  nom: string;
  adresse?: string;
  actif: boolean;
  dateCreation: string;
}

export interface Employe {
  id: string;
  nom: string;
  role: "gestionnaire" | "vendeur";
  boutiqueId?: string;
  dateCreation: string;
}

export interface Profil {
  nomProprietaire: string;
  nomBoutique: string;
}

interface BoutiqueContextType {
  // Profil
  profil: Profil;
  mettreAJourProfil: (donnees: Partial<Profil>) => void;

  // Produits
  produits: Produit[];
  ajouterProduit: (produit: Omit<Produit, "id" | "dateCreation">) => void;
  modifierProduit: (id: string, donnees: Partial<Produit>) => void;
  supprimerProduit: (id: string) => void;

  // Stock
  mouvements: MouvementStock[];
  ajouterMouvementStock: (mouvement: Omit<MouvementStock, "id" | "date">) => void;

  // Ventes
  ventes: Vente[];
  enregistrerVente: (vente: Omit<Vente, "id" | "date">) => void;

  // Boutiques
  boutiques: Boutique[];
  ajouterBoutique: (boutique: Omit<Boutique, "id" | "dateCreation">) => void;

  // Employés
  employes: Employe[];
  ajouterEmploye: (employe: Omit<Employe, "id" | "dateCreation">) => void;
}

const BoutiqueContext = createContext<BoutiqueContextType | undefined>(undefined);

const CLE_STOCKAGE = "stockflow_donnees";

function genererId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface DonneesStockees {
  profil: Profil;
  produits: Produit[];
  mouvements: MouvementStock[];
  ventes: Vente[];
  boutiques: Boutique[];
  employes: Employe[];
}

const donneesInitiales: DonneesStockees = {
  profil: { nomProprietaire: "", nomBoutique: "" },
  produits: [],
  mouvements: [],
  ventes: [],
  boutiques: [],
  employes: [],
};

export function BoutiqueProvider({ children }: { children: React.ReactNode }) {
  const [profil, setProfil] = useState<Profil>(donneesInitiales.profil);
  const [produits, setProduits] = useState<Produit[]>(donneesInitiales.produits);
  const [mouvements, setMouvements] = useState<MouvementStock[]>(donneesInitiales.mouvements);
  const [ventes, setVentes] = useState<Vente[]>(donneesInitiales.ventes);
  const [boutiques, setBoutiques] = useState<Boutique[]>(donneesInitiales.boutiques);
  const [employes, setEmployes] = useState<Employe[]>(donneesInitiales.employes);
  const [charge, setCharge] = useState(false);

  // Chargement initial depuis localStorage
  useEffect(() => {
    try {
      const brut = window.localStorage.getItem(CLE_STOCKAGE);
      if (brut) {
        const donnees: DonneesStockees = JSON.parse(brut);
        setProfil(donnees.profil ?? donneesInitiales.profil);
        setProduits(donnees.produits ?? []);
        setMouvements(donnees.mouvements ?? []);
        setVentes(donnees.ventes ?? []);
        setBoutiques(donnees.boutiques ?? []);
        setEmployes(donnees.employes ?? []);
      }
    } catch (erreur) {
      console.error("Erreur de lecture du stockage local :", erreur);
    } finally {
      setCharge(true);
    }
  }, []);

  // Sauvegarde automatique à chaque changement
  useEffect(() => {
    if (!charge) return; // évite d'écraser avec les valeurs vides avant le chargement
    const donnees: DonneesStockees = { profil, produits, mouvements, ventes, boutiques, employes };
    try {
      window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(donnees));
    } catch (erreur) {
      console.error("Erreur d'écriture du stockage local :", erreur);
    }
  }, [profil, produits, mouvements, ventes, boutiques, employes, charge]);

  // ---------------------- Profil ----------------------
  function mettreAJourProfil(donnees: Partial<Profil>) {
    setProfil((prev) => ({ ...prev, ...donnees }));
  }

  // ---------------------- Produits ----------------------
  function ajouterProduit(produit: Omit<Produit, "id" | "dateCreation">) {
    const nouveau: Produit = {
      ...produit,
      id: genererId(),
      dateCreation: new Date().toISOString(),
    };
    setProduits((prev) => [...prev, nouveau]);
  }

  function modifierProduit(id: string, donnees: Partial<Produit>) {
    setProduits((prev) => prev.map((p) => (p.id === id ? { ...p, ...donnees } : p)));
  }

  function supprimerProduit(id: string) {
    setProduits((prev) => prev.filter((p) => p.id !== id));
    // On retire aussi l'historique de stock lié à ce produit, pour rester cohérent
    setMouvements((prev) => prev.filter((m) => m.produitId !== id));
  }

  // ---------------------- Stock ----------------------
  function ajouterMouvementStock(mouvement: Omit<MouvementStock, "id" | "date">) {
    const nouveau: MouvementStock = {
      ...mouvement,
      id: genererId(),
      date: new Date().toISOString(),
    };
    setMouvements((prev) => [nouveau, ...prev]);

    setProduits((prev) =>
      prev.map((p) => {
        if (p.id !== mouvement.produitId) return p;
        const delta =
          mouvement.type === "entree"
            ? mouvement.quantite
            : -mouvement.quantite;
        return { ...p, quantite: Math.max(0, p.quantite + delta) };
      })
    );
  }

  // ---------------------- Ventes ----------------------
  function enregistrerVente(vente: Omit<Vente, "id" | "date">) {
    const nouvelle: Vente = {
      ...vente,
      id: genererId(),
      date: new Date().toISOString(),
    };
    setVentes((prev) => [nouvelle, ...prev]);

    // Décrémente le stock de chaque produit vendu
    setProduits((prev) =>
      prev.map((p) => {
        const ligne = vente.lignes.find((l) => l.produitId === p.id);
        if (!ligne) return p;
        return { ...p, quantite: Math.max(0, p.quantite - ligne.quantite) };
      })
    );

    // Trace un mouvement de sortie pour chaque ligne vendue
    setMouvements((prev) => [
      ...vente.lignes.map((l) => ({
        id: genererId(),
        produitId: l.produitId,
        type: "vente" as const,
        quantite: l.quantite,
        motif: "Vente",
        date: new Date().toISOString(),
      })),
      ...prev,
    ]);
  }

  // ---------------------- Boutiques ----------------------
  function ajouterBoutique(boutique: Omit<Boutique, "id" | "dateCreation">) {
    const nouvelle: Boutique = {
      ...boutique,
      id: genererId(),
      dateCreation: new Date().toISOString(),
    };
    setBoutiques((prev) => [...prev, nouvelle]);
  }

  // ---------------------- Employés ----------------------
  function ajouterEmploye(employe: Omit<Employe, "id" | "dateCreation">) {
    const nouveau: Employe = {
      ...employe,
      id: genererId(),
      dateCreation: new Date().toISOString(),
    };
    setEmployes((prev) => [...prev, nouveau]);
  }

  return (
    <BoutiqueContext.Provider
      value={{
        profil,
        mettreAJourProfil,
        produits,
        ajouterProduit,
        modifierProduit,
        supprimerProduit,
        mouvements,
        ajouterMouvementStock,
        ventes,
        enregistrerVente,
        boutiques,
        ajouterBoutique,
        employes,
        ajouterEmploye,
      }}
    >
      {children}
    </BoutiqueContext.Provider>
  );
}

export function useBoutique() {
  const contexte = useContext(BoutiqueContext);
  if (!contexte) {
    throw new Error("useBoutique doit être utilisé à l'intérieur d'un BoutiqueProvider");
  }
  return contexte;
}