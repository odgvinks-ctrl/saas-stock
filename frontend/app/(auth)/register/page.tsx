"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Loader2 } from "lucide-react";
import { creerClientSupabase } from "@/lib/supabase/client";

export default function Register() {
  const router = useRouter();
  const supabase = creerClientSupabase();

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

    // 1. Créer le compte utilisateur
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: motDePasse,
    });

    if (authError || !authData.user) {
      setErreur(authError?.message || "Erreur lors de l'inscription");
      setChargement(false);
      return;
    }

    // 2. Créer la boutique
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

    // 3. Créer le profil lié à la boutique
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

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#161821] flex items-center justify-center p-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .font-serif { font-family: 'Fraunces', serif; }
      `}</style>

      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-[#E8A33D] flex items-center justify-center">
            <Package size={18} className="text-[#161821]" />
          </div>
          <p className="font-serif text-xl text-white/95">Boutique+</p>
        </div>

        <div className="bg-[#1E212C] border border-white/5 rounded-2xl p-6">
          <h1 className="font-serif text-xl text-white/95 mb-1">Créer ton compte</h1>
          <p className="text-sm text-white/40 mb-6">Commence à gérer ta boutique en quelques minutes.</p>

          <form onSubmit={gererInscription} className="space-y-4">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Nom complet</label>
              <input
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex : Aïcha Traoré"
                className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50 placeholder:text-white/25"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Nom de la boutique</label>
              <input
                required
                value={nomBoutique}
                onChange={(e) => setNomBoutique(e.target.value)}
                placeholder="Ex : Boutique Marché central"
                className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50 placeholder:text-white/25"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50 placeholder:text-white/25"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Mot de passe</label>
              <input
                required
                type="password"
                minLength={6}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50 placeholder:text-white/25"
              />
            </div>

            {erreur && (
              <p className="text-xs text-[#C1502E] bg-[#C1502E]/10 rounded-lg px-3 py-2">{erreur}</p>
            )}

            <button
              type="submit"
              disabled={chargement}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#E8A33D] text-[#161821] text-sm font-medium disabled:opacity-50"
            >
              {chargement ? <Loader2 size={15} className="animate-spin" /> : null}
              {chargement ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>

          <p className="text-xs text-white/40 text-center mt-5">
            Déjà un compte ?{" "}
            <a href="/login" className="text-[#E8A33D]">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  );
}