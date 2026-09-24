import { NextRequest, NextResponse } from "next/server";
import { creerClientSupabaseServeur } from "@/lib/supabase/server";

const TARIFS = {
  mensuel: 4000,
  annuel: 40000,
} as const;

export async function POST(request: NextRequest) {
  try {
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
      console.error("ERREUR_CREATION_ABONNEMENT", erreurAbonnement);
      return NextResponse.json({ erreur: "Impossible de créer l'abonnement.", detail: erreurAbonnement?.message }, { status: 500 });
    }

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

    const texteSasPay = await reponseSasPay.text();

    if (!reponseSasPay.ok) {
      console.error("ERREUR_SASPAY", reponseSasPay.status, texteSasPay);
      await supabase.from("abonnements").update({ statut_paiement: "echoue" }).eq("id", abonnement.id);
      return NextResponse.json(
        { erreur: "Impossible de créer la session de paiement.", detail: texteSasPay, statut: reponseSasPay.status },
        { status: 502 }
      );
    }

    let session;
    try {
      session = JSON.parse(texteSasPay);
    } catch (e) {
      console.error("ERREUR_PARSE_SASPAY", texteSasPay);
      return NextResponse.json({ erreur: "Réponse SasPay invalide.", detail: texteSasPay }, { status: 502 });
    }

    if (!session.checkout_url) {
      console.error("PAS_DE_CHECKOUT_URL", session);
      return NextResponse.json({ erreur: "Pas d'URL de paiement reçue.", detail: session }, { status: 502 });
    }

    const { error: erreurMaj } = await supabase
      .from("abonnements")
      .update({ checkout_session_id: session.id })
      .eq("id", abonnement.id);

    if (erreurMaj) {
      console.error("ERREUR_MAJ_SESSION_ID", erreurMaj);
      // On continue quand même : le paiement peut se faire, on perd juste la corrélation facile
    }

    return NextResponse.json({ checkout_url: session.checkout_url });
  } catch (e: any) {
    console.error("ERREUR_INATTENDUE_CREER_SESSION", e?.message, e?.stack);
    return NextResponse.json({ erreur: "Erreur serveur inattendue.", detail: e?.message ?? String(e) }, { status: 500 });
  }
}