"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import { User, Bell, CreditCard, Store, Check, Loader2 } from "lucide-react";
import { useBoutique } from "@/lib/store/boutique-store";
import { creerClientSupabase } from "@/lib/supabase/client";

const onglets = [
  { id: "general", label: "Général", icon: Store },
  { id: "compte", label: "Mon compte", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "abonnement", label: "Abonnement", icon: CreditCard },
];

function Toggle({ actif, onClick }: { actif: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-10 h-6 rounded-full flex items-center px-0.5 transition ${actif ? "bg-teal-600 justify-end" : "bg-gray-300 justify-start"}`}>
      <span className="w-5 h-5 rounded-full bg-slate-800 shadow" />
    </button>
  );
}

export default function Parametres() {
  const { profil, definirProfil } = useBoutique();
  const [ongletActif, setOngletActif] = useState("general");
  const [notifs, setNotifs] = useState({ sms: true, email: false, ruptureStock: true, rappelCommande: true });

  const [nomBoutique, setNomBoutique] = useState(profil.nomBoutiquePrincipale);
  const [nomProprietaire, setNomProprietaire] = useState(profil.nomProprietaire);
  const [enregistre, setEnregistre] = useState(false);

  const [abonnement, setAbonnement] = useState<{ plan: string; montant: number; date_fin: string; statut_paiement: string } | null>(null);
  const [chargementAbo, setChargementAbo] = useState(true);

  useEffect(() => {
    async function charger() {
      const supabase = creerClientSupabase();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { setChargementAbo(false); return; }

      const { data: profilSupabase } = await supabase
        .from("profils")
        .select("boutique_id")
        .eq("id", userData.user.id)
        .single();
      if (!profilSupabase?.boutique_id) { setChargementAbo(false); return; }

      const { data: abo } = await supabase
        .from("abonnements")
        .select("plan, montant, date_fin, statut_paiement")
        .eq("boutique_id", profilSupabase.boutique_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setAbonnement(abo);
      setChargementAbo(false);
    }
    charger();
  }, []);

  function sauvegarderGeneral() {
    definirProfil({ ...profil, nomBoutiquePrincipale: nomBoutique });
    afficherConfirmation();
  }
  function sauvegarderCompte() {
    definirProfil({ ...profil, nomProprietaire });
    afficherConfirmation();
  }
  function afficherConfirmation() {
    setEnregistre(true);
    setTimeout(() => setEnregistre(false), 2000);
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Paramètres</h1>
        <p className="text-sm text-slate-500 mt-1">Gère ta boutique, ton compte et ton abonnement.</p>
      </div>

      {!profil.nomProprietaire && (
        <div className="rounded-xl bg-teal-500/10 border border-teal-500/40 p-4 mb-6">
          <p className="text-sm text-teal-800 font-medium">Complète ton profil pour personnaliser ton tableau de bord.</p>
          <p className="text-xs text-teal-400 mt-1">Renseigne ton nom dans l'onglet "Mon compte" ci-dessous.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-2">
            {onglets.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setOngletActif(id)} className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm transition ${
                ongletActif === id ? "bg-teal-500/10 text-teal-400 font-medium" : "text-slate-500 hover:text-white"
              }`}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 rounded-xl bg-slate-800 border border-slate-700 shadow-sm p-6">
          {ongletActif === "general" && (
            <div className="space-y-4 max-w-md">
              <h3 className="text-base font-semibold text-white mb-4">Informations de la boutique</h3>
              <div>
                <label className="text-xs text-gray-300 font-medium mb-1.5 block">Nom du commerce</label>
                <input value={nomBoutique} onChange={(e) => setNomBoutique(e.target.value)} placeholder="Ex : Boutique Marché central" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500" />
              </div>
              <div>
                <label className="text-xs text-gray-300 font-medium mb-1.5 block">Devise</label>
                <select className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-teal-500"><option>Franc CFA (FCFA)</option></select>
              </div>
              <button onClick={sauvegarderGeneral} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium mt-2">
                <Check size={15} /> Enregistrer
              </button>
            </div>
          )}

          {ongletActif === "compte" && (
            <div className="space-y-4 max-w-md">
              <h3 className="text-base font-semibold text-white mb-4">Mon compte</h3>
              <div>
                <label className="text-xs text-gray-300 font-medium mb-1.5 block">Nom complet</label>
                <input value={nomProprietaire} onChange={(e) => setNomProprietaire(e.target.value)} placeholder="Ex : Aïcha Traoré" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500" />
              </div>
              <div>
                <label className="text-xs text-gray-300 font-medium mb-1.5 block">Téléphone</label>
                <input placeholder="Ex : 70 12 34 56" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500" />
              </div>
              <button onClick={sauvegarderCompte} disabled={!nomProprietaire} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium mt-2 disabled:opacity-40">
                <Check size={15} /> Mettre à jour
              </button>
            </div>
          )}

          {ongletActif === "notifications" && (
            <div className="space-y-1 max-w-md">
              <h3 className="text-base font-semibold text-white mb-4">Préférences de notifications</h3>
              {[
                { key: "ruptureStock", label: "Alerte de rupture de stock", desc: "Reçois une alerte dès qu'un produit atteint son seuil" },
                { key: "rappelCommande", label: "Rappel de réapprovisionnement", desc: "Rappel hebdomadaire pour les produits à commander" },
                { key: "sms", label: "Notifications par SMS", desc: "Reçois les alertes importantes par SMS" },
                { key: "email", label: "Notifications par email", desc: "Reçois un résumé hebdomadaire par email" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                  <div>
                    <p className="text-sm text-gray-100">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                  <Toggle actif={(notifs as any)[key]} onClick={() => setNotifs((prev) => ({ ...prev, [key]: !(prev as any)[key] }))} />
                </div>
              ))}
            </div>
          )}

          {ongletActif === "abonnement" && (
            <div>
              <h3 className="text-base font-semibold text-white mb-4">Ton abonnement</h3>

              {chargementAbo ? (
                <div className="flex items-center gap-2 text-sm text-slate-400 py-6">
                  <Loader2 size={15} className="animate-spin" /> Chargement...
                </div>
              ) : !abonnement ? (
                <p className="text-sm text-slate-400 mb-4">Aucun abonnement trouvé.</p>
              ) : (
                <div className={`rounded-xl p-5 mb-4 border ${
                  abonnement.statut_paiement === "paye"
                    ? "bg-teal-500/10 border-teal-500/40"
                    : "bg-amber-500/10 border-amber-500/40"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-100 capitalize">Plan {abonnement.plan}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      abonnement.statut_paiement === "paye" ? "bg-teal-500/20 text-teal-400" : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {abonnement.statut_paiement === "paye" ? "Actif" : "En attente"}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">
                    {abonnement.montant.toLocaleString("fr-FR")} F
                    <span className="text-sm font-normal text-slate-500">{abonnement.plan === "annuel" ? "/an" : "/mois"}</span>
                  </p>
                  {abonnement.date_fin && (
                    <p className="text-xs text-slate-500">
                      {abonnement.statut_paiement === "paye" ? "Renouvellement" : "Expire"} le{" "}
                      {new Date(abonnement.date_fin).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </div>
              )}

              <a href="/abonnement" className="inline-block text-sm text-teal-400 border border-teal-500/50 px-4 py-2 rounded-lg font-medium hover:bg-slate-700 transition">
                Changer de plan
              </a>
            </div>
          )}
        </div>
      </div>

      {enregistre && (
        <div className="fixed bottom-6 right-6 bg-teal-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg z-50">
          <Check size={16} /> Enregistré
        </div>
      )}
    </div>
  );
}