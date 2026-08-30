"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Loader2 } from "lucide-react";
import { creerClientSupabase } from "@/lib/supabase/client";

export default function Login() {
  const router = useRouter();
  const supabase = creerClientSupabase();

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  async function gererConnexion(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    });

    if (error) {
      setErreur("Email ou mot de passe incorrect.");
      setChargement(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
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
          <h1 className="font-serif text-xl text-white/95 mb-1">Bon retour 👋</h1>
          <p className="text-sm text-white/40 mb-6">Connecte-toi pour gérer ta boutique.</p>

          <form onSubmit={gererConnexion} className="space-y-4">
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
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#161821] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#E8A33D]/50 placeholder:text-white/25"
              />
            </div>

            {erreur && (
              <p className="text-xs text-[#C1502E] bg-[#C1502E]/10 rounded-lg px-3 py-2">{erreur}</p>
            )}

            <div className="flex justify-end">
              <a href="/forgot-password" className="text-xs text-white/40 hover:text-white/60">Mot de passe oublié ?</a>
            </div>

            <button
              type="submit"
              disabled={chargement}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#E8A33D] text-[#161821] text-sm font-medium disabled:opacity-50"
            >
              {chargement ? <Loader2 size={15} className="animate-spin" /> : null}
              {chargement ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="text-xs text-white/40 text-center mt-5">
            Pas encore de compte ?{" "}
            <a href="/register" className="text-[#E8A33D]">Créer un compte</a>
          </p>
        </div>
      </div>
    </div>
  );
}