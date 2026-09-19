"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { creerClientSupabase } from "@/lib/supabase/client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  async function gererConnexion(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    const supabase = creerClientSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse });

    if (error) {
      setErreur("Email ou mot de passe incorrect.");
      setChargement(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      {/* Panneau de bienvenue */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-teal-600 to-slate-900 flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-teal-500/20" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-teal-500/10" />
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Package size={18} className="text-white" />
            </div>
            <p className="text-white text-lg font-semibold">StockFlow</p>
          </div>
          <h1 className="text-3xl font-semibold text-white mb-3">Bon retour parmi nous</h1>
          <p className="text-teal-100/80 text-sm max-w-sm mb-8">
            Connecte-toi pour suivre ton stock, tes ventes et le bénéfice de ta boutique en temps réel.
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 border border-white/30 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-white/10 transition"
          >
            Pas encore de compte, en créer un <ArrowRight size={15} />
          </a>
        </div>
      </div>

      {/* Formulaire */}
      <div className="flex-1 bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 justify-center mb-8 md:hidden">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
              <Package size={18} className="text-white" />
            </div>
            <p className="text-white text-lg font-semibold">StockFlow</p>
          </div>

          <h2 className="text-xl font-semibold text-white mb-1">Connexion</h2>
          <p className="text-sm text-slate-400 mb-8">Entre tes identifiants pour continuer.</p>

          <form onSubmit={gererConnexion} className="space-y-4">
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
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-white outline-none focus:border-teal-500 placeholder:text-slate-500"
                />
              </div>
            </div>

            {erreur && <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{erreur}</p>}

            <div className="flex justify-end">
              <a href="/forgot-password" className="text-xs text-slate-400 hover:text-slate-200">Mot de passe oublié ?</a>
            </div>

            <button
              type="submit"
              disabled={chargement}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium disabled:opacity-50"
            >
              {chargement ? <Loader2 size={15} className="animate-spin" /> : null}
              {chargement ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6 md:hidden">
            Pas encore de compte ? <a href="/register" className="text-teal-400 font-medium">Créer un compte</a>
          </p>
        </div>
      </div>
    </div>
  );
}