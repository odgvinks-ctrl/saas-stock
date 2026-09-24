"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function Merci() {
  const router = useRouter();
  const [secondes, setSecondes] = useState(5);

  useEffect(() => {
    const intervalle = setInterval(() => {
      setSecondes((s) => {
        if (s <= 1) {
          clearInterval(intervalle);
          router.push("/dashboard");
          router.refresh();
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalle);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-6">
        <CheckCircle2 size={28} className="text-teal-400" />
      </div>
      <h1 className="text-2xl font-semibold text-white mb-2">Paiement reçu</h1>
      <p className="text-slate-400 text-center max-w-sm mb-8">
        Ton abonnement est en cours de confirmation. Tu seras redirigé vers ton tableau de bord dans quelques secondes.
      </p>
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 size={14} className="animate-spin" /> Redirection dans {secondes}s...
      </div>
    </div>
  );
}