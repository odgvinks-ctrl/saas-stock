"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Loader2, Mail, Lock, User, Store, ArrowRight } from "lucide-react";
import { creerClientSupabase } from "@/lib/supabase/client";

export default function Register() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [nomBoutique, setNomBoutique] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  async function gererInscription(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    const supabase = creerClientSupabase();
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password: motDePasse });

    if (authError || !authData.user) {
      setErreur(authError?.message || "Erreur lors de l'inscription");
      setChargement(false);
      return;
    }

    const { data: boutique, error: boutiqueError } = await supabase
      .from("boutiques")
      .insert({ nom: nomBoutique, proprietaire_id: authData.user.id })
      .select()
      .single();

    if (boutiqueError) {
      setErreur(boutiqueError.message);
      setChargement(false);
      return;
    }

    const { error: profilError } = await supabase.from("profils").insert({
      id: authData.user.id,
      nom,
      role: "proprietaire",
      boutique_id: boutique.id,
    });

    if (profilError) {
      setErreur(profilError.message);
      setChargement(false);
      return;
    }

    router.push("/abonnement");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      {/* Formulaire */}
      <div className="flex-1 bg-slate-950 flex items-center justify-center p-6 order-2 md:order-1">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 justify-center mb-8 md:hidden">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
              <Package size={18} className="text-white" />
            </div>
            <p className="text-white text-lg font-semibold">StockFlow</p>
          </div>

          <h2 className="text-xl font-semibold text-white mb-1">Créer ton compte</h2>
          <p className="text-sm text-slate-400 mb-8">Commence à gérer ta boutique en quelques minutes.</p>

          <form onSubmit={gererInscription} className="space-y-4">
            <div>
              <label className="text-xs text-gray-300 font-medium mb-1.5 block">Nom complet</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ton nom complet"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-300 font-medium mb-1.5 block">Nom de la boutique</label>
              <div className="relative">
                <Store size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  value={nomBoutique}
                  onChange={(e) => setNomBoutique(e.target.value)}
                  placeholder="Nom de ton commerce"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-300 font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-300 font-medium mb-1.5 block">Mot de passe</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  type="password"
                  minLength={6}
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder="6 caractères minimum"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500"
                />
              </div>
            </div>

            {erreur && <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{erreur}</p>}

            <button
              type="submit"
              disabled={chargement}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium disabled:opacity-50"
            >
              {chargement ? <Loader2 size={15} className="animate-spin" /> : null}
              {chargement ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6 md:hidden">
            Déjà un compte ? <a href="/login" className="text-teal-400 font-medium">Se connecter</a>
          </p>
        </div>
      </div>

      {/* Panneau de bienvenue */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-bl from-teal-600 to-slate-900 flex-col justify-center px-16 relative overflow-hidden order-1 md:order-2">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-teal-500/20" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-teal-500/10" />
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Package size={18} className="text-white" />
            </div>
            <p className="text-white text-lg font-semibold">StockFlow</p>
          </div>
          <h1 className="text-3xl font-semibold text-white mb-3">Ta boutique, sous contrôle</h1>
          <p className="text-teal-100/80 text-sm max-w-sm mb-8">
            Stock, ventes et bénéfices en un seul endroit. Rejoins les commerçants qui gèrent déjà leur boutique avec StockFlow.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 border border-white/30 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-white/10 transition"
          >
            Déjà un compte, se connecter <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}