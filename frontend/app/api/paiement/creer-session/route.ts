import { NextRequest, NextResponse } from "next/server";
import { creerClientSupabaseServeur } from "@/lib/supabase/server";

const TARIFS = {
  mensuel: 4000,
  annuel: 40000,
} as const;

export async function POST(request: NextRequest) {
  const { plan } = await request.json();

  if (plan !== "mensuel" && plan !== "annuel") {
    return NextResponse.json({ erreur: "Plan invalide." }, { status: 400 });
  }

  const supabase = await creerClientSupabaseServeur();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ erreur: "Non authentifié." }, { status: 401 });
  }

  const { data: profil } = await supabase
    .from("profils")
    .select("boutique_id, nom")
    .eq("id", userData.user.id)
    .single();

  if (!profil?.boutique_id) {
    return NextResponse.json({ erreur: "Aucune boutique associée à ce compte." }, { status: 400 });
  }

  const montant = TARIFS[plan as keyof typeof TARIFS];
  const aujourdHui = new Date();
  const dateFin = new Date(aujourdHui);
  dateFin.setDate(dateFin.getDate() + (plan === "mensuel" ? 30 : 365));

  // 1. Crée l'abonnement en attente dans notre base
  const { data: abonnement, error: erreurAbonnement } = await supabase
    .from("abonnements")
    .insert({
      boutique_id: profil.boutique_id,
      plan,
      montant,
      date_debut: aujourdHui.toISOString().slice(0, 10),
      date_fin: dateFin.toISOString().slice(0, 10),
      statut_paiement: "en_attente",
    })
    .select()
    .single();

  if (erreurAbonnement || !abonnement) {
    return NextResponse.json({ erreur: "Impossible de créer l'abonnement." }, { status: 500 });
  }

  // 2. Crée la session de paiement chez SasPay
  const origine = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const reponseSasPay = await fetch("https://api.saspay.me/api/v1/checkout-sessions/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SASPAY_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: montant.toFixed(2),
      currency: "XOF",
      description: `ABN-${abonnement.id}`,
      customer_email: userData.user.email,
      customer_name: profil.nom || "Client StockFlow",
      return_url: `${origine}/abonnement/merci`,
      metadata: { abonnement_id: abonnement.id, boutique_id: profil.boutique_id, plan },
    }),
  });

  if (!reponseSasPay.ok) {
    await supabase.from("abonnements").update({ statut_paiement: "echoue" }).eq("id", abonnement.id);
    return NextResponse.json({ erreur: "Impossible de créer la session de paiement." }, { status: 502 });
  }

  const session = await reponseSasPay.json();

  // 3. Enregistre l'identifiant de session pour le retrouver depuis le webhook
  await supabase
    .from("abonnements")
    .update({ checkout_session_id: session.id })
    .eq("id", abonnement.id);

  return NextResponse.json({ checkout_url: session.checkout_url });
}