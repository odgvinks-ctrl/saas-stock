"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Users, Wallet, TrendingUp, TrendingDown, UserPlus, ShieldCheck, Loader2, Settings2
} from "lucide-react";
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { creerClientSupabase } from "@/lib/supabase/client";

type BoutiqueLigne = {
  id: string;
  nom: string;
  plan_abonnement: string;
  statut: string;
  created_at: string;
  proprietaire_id: string;
};

type ProfilLigne = { id: string; nom: string; boutique_id: string | null };
type AbonnementLigne = { boutique_id: string; montant: number; statut_paiement: string; created_at: string };

const CLE_COUTS = "boutique-plus-admin-couts";

function KpiCard({ icon: Icon, label, value, sub, tone }: any) {
  const tones: any = {
    teal: "bg-teal-500/10 text-teal-400",
    red: "bg-red-500/10 text-red-400",
    amber: "bg-amber-500/10 text-amber-400",
  };
  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tones[tone]}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{sub}</p>
    </div>
  );
}

function BadgeStatut({ statut }: { statut: string }) {
  const styles: Record<string, string> = {
    paye: "bg-teal-500/10 text-teal-400",
    en_attente: "bg-amber-500/10 text-amber-400",
    echoue: "bg-red-500/10 text-red-400",
  };
  const labels: Record<string, string> = { paye: "payé", en_attente: "en attente", echoue: "échoué" };
  return <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles[statut] ?? "bg-slate-700 text-slate-300"}`}>{labels[statut] ?? statut}</span>;
}

export default function AdminSaaS() {
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [boutiques, setBoutiques] = useState<BoutiqueLigne[]>([]);
  const [profils, setProfils] = useState<ProfilLigne[]>([]);
  const [abonnements, setAbonnements] = useState<AbonnementLigne[]>([]);
  const [couts, setCouts] = useState(0);
  const [modifCouts, setModifCouts] = useState(false);

  useEffect(() => {
    const sauvegarde = localStorage.getItem(CLE_COUTS);
    if (sauvegarde) setCouts(Number(sauvegarde));
  }, []);

  useEffect(() => {
    async function charger() {
      const supabase = creerClientSupabase();

      const [{ data: b, error: eB }, { data: p, error: eP }, { data: a, error: eA }] = await Promise.all([
        supabase.from("boutiques").select("id, nom, plan_abonnement, statut, created_at, proprietaire_id"),
        supabase.from("profils").select("id, nom, boutique_id").eq("role", "proprietaire"),
        supabase.from("abonnements").select("boutique_id, montant, statut_paiement, created_at"),
      ]);

      if (eB || eP || eA) {
        setErreur(
          "Impossible de charger les données. Vérifie que ton compte est bien marqué super-admin (est_super_admin = true)."
        );
        setChargement(false);
        return;
      }

      setBoutiques(b ?? []);
      setProfils(p ?? []);
      setAbonnements(a ?? []);
      setChargement(false);
    }
    charger();
  }, []);

  function sauvegarderCouts(valeur: number) {
    setCouts(valeur);
    localStorage.setItem(CLE_COUTS, String(valeur));
  }

  const nomProprietaire = (boutiqueId: string) => profils.find((p) => p.boutique_id === boutiqueId)?.nom ?? "—";

  const dernierAbonnement = (boutiqueId: string) => {
    const abos = abonnements.filter((a) => a.boutique_id === boutiqueId).sort((x, y) => new Date(y.created_at).getTime() - new Date(x.created_at).getTime());
    return abos[0];
  };

  const clientsTotal = boutiques.length;
  const clientsActifs = boutiques.filter((b) => b.statut === "actif").length;

  const debutMois = new Date();
  debutMois.setDate(1);
  debutMois.setHours(0, 0, 0, 0);
  const nouveauxCeMois = boutiques.filter((b) => new Date(b.created_at) >= debutMois).length;

  const mrr = useMemo(() => {
    const dernierParBoutique = new Map<string, AbonnementLigne>();
    abonnements.forEach((a) => {
      const existant = dernierParBoutique.get(a.boutique_id);
      if (!existant || new Date(a.created_at) > new Date(existant.created_at)) dernierParBoutique.set(a.boutique_id, a);
    });
    return Array.from(dernierParBoutique.values())
      .filter((a) => a.statut_paiement === "paye")
      .reduce((acc, a) => acc + Number(a.montant), 0);
  }, [abonnements]);

  const beneficeNet = mrr - couts;

  const parPlan = useMemo(() => {
    const compte: Record<string, number> = {};
    boutiques.forEach((b) => { compte[b.plan_abonnement] = (compte[b.plan_abonnement] ?? 0) + 1; });
    return compte;
  }, [boutiques]);

  const croissance = useMemo(() => {
    const buckets: { mois: string; clients: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const label = date.toLocaleDateString("fr-FR", { month: "short" });
      const finMois = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      const total = boutiques.filter((b) => new Date(b.created_at) < finMois).length;
      buckets.push({ mois: label, clients: total });
    }
    return buckets;
  }, [boutiques]);

  const derniersClients = [...boutiques]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  if (chargement) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 size={24} className="text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-none">Panel Admin</p>
              <p className="text-[11px] text-slate-500 mt-1">Vue d'ensemble du SaaS StockFlow</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {erreur && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 mb-6">
            <p className="text-sm text-red-300">{erreur}</p>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard icon={Users} label="Clients au total" value={clientsTotal} sub={`${clientsActifs} actifs`} tone="teal" />
          <KpiCard icon={Wallet} label="Revenu mensuel (MRR)" value={`${mrr.toLocaleString("fr-FR")} F`} sub="Abonnements payés" tone="teal" />
          <KpiCard icon={TrendingUp} label="Bénéfice net" value={`${beneficeNet.toLocaleString("fr-FR")} F`} sub={`Coûts saisis : ${couts.toLocaleString("fr-FR")} F`} tone="teal" />
          <KpiCard icon={UserPlus} label="Nouveaux ce mois" value={nouveauxCeMois} sub="Depuis le 1er du mois" tone="amber" />
        </div>

        <div className="rounded-xl bg-slate-800 border border-slate-700 p-5 mb-6 flex items-center gap-4">
          <Settings2 size={16} className="text-slate-400 shrink-0" />
          <p className="text-sm text-slate-300 flex-1">Coûts d'infrastructure mensuels (hébergement, SMS, paiement) :</p>
          {modifCouts ? (
            <input
              type="number"
              autoFocus
              defaultValue={couts}
              onBlur={(e) => { sauvegarderCouts(Number(e.target.value) || 0); setModifCouts(false); }}
              className="w-32 bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-teal-500"
            />
          ) : (
            <button onClick={() => setModifCouts(true)} className="text-sm text-teal-400 font-medium">
              {couts.toLocaleString("fr-FR")} F — modifier
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
          <div className="lg:col-span-3 rounded-xl bg-slate-800 border border-slate-700 p-6">
            <h3 className="text-base font-semibold text-white mb-4">Croissance des clients</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={croissance}>
                <defs>
                  <linearGradient id="fillTeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="mois" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, fontSize: 12, color: "#F1F5F9" }} formatter={(v: any) => [`${v} clients`, "Total"]} />
                <Area type="monotone" dataKey="clients" stroke="#0D9488" strokeWidth={2} fill="url(#fillTeal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 rounded-xl bg-slate-800 border border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={16} className="text-teal-400" />
              <h3 className="text-base font-semibold text-white">Répartition par plan</h3>
            </div>
            {Object.keys(parPlan).length === 0 ? (
              <p className="text-sm text-slate-500">Aucun client pour l'instant.</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(parPlan).map(([plan, nb]) => (
                  <div key={plan} className="flex justify-between text-sm">
                    <span className="text-slate-400 capitalize">{plan}</span>
                    <span className="text-white font-medium">{nb}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-slate-800 border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h3 className="text-base font-semibold text-white">Derniers clients inscrits</h3>
          </div>
          {derniersClients.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-10">Aucun client inscrit pour l'instant.</p>
          ) : (
            <>
              <div className="grid grid-cols-12 px-6 py-3 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-500 font-medium">
                <div className="col-span-3">Boutique</div>
                <div className="col-span-3">Propriétaire</div>
                <div className="col-span-2">Plan</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Statut paiement</div>
              </div>
              {derniersClients.map((b) => {
                const abo = dernierAbonnement(b.id);
                return (
                  <div key={b.id} className="grid grid-cols-12 items-center px-6 py-3.5 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30">
                    <div className="col-span-3 text-sm text-white font-medium truncate">{b.nom}</div>
                    <div className="col-span-3 text-sm text-slate-400 truncate">{nomProprietaire(b.id)}</div>
                    <div className="col-span-2 text-sm text-slate-300 capitalize">{b.plan_abonnement}</div>
                    <div className="col-span-2 text-sm text-slate-500">{new Date(b.created_at).toLocaleDateString("fr-FR")}</div>
                    <div className="col-span-2">{abo ? <BadgeStatut statut={abo.statut_paiement} /> : <span className="text-xs text-slate-500">Aucun</span>}</div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}