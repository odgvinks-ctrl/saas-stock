import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { creerClientSupabaseAdmin } from "@/lib/supabase/admin";

const TOLERANCE_SECONDES = 300;

function signatureValide(corpsBrut: string, signature: string, horodatage: string, secret: string) {
  const maintenant = Math.floor(Date.now() / 1000);
  if (Math.abs(maintenant - Number(horodatage)) > TOLERANCE_SECONDES) return false;

  const attendu = crypto
    .createHmac("sha256", secret)
    .update(`${horodatage}.${corpsBrut}`)
    .digest("hex");

  const a = Buffer.from(signature);
  const b = Buffer.from(attendu);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const corpsBrut = await request.text();
  const signature = request.headers.get("x-webhook-signature") ?? "";
  const horodatage = request.headers.get("x-webhook-timestamp") ?? "0";

  if (!signatureValide(corpsBrut, signature, horodatage, process.env.SASPAY_WEBHOOK_SECRET!)) {
    return NextResponse.json({ erreur: "Signature invalide." }, { status: 403 });
  }

  const { event, data } = JSON.parse(corpsBrut);

  if (!["transaction.success", "transaction.failed", "transaction.cancelled"].includes(event)) {
    return NextResponse.json({ recu: true });
  }

  // Ne jamais faire confiance au seul webhook : on revérifie l'état réel côté SasPay
  const verification = await fetch(`https://api.saspay.me/api/v1/payments/${data.id}/verify/`, {
    headers: { Authorization: `Bearer ${process.env.SASPAY_SECRET_KEY}` },
  });

  if (!verification.ok) {
    return NextResponse.json({ erreur: "Vérification impossible." }, { status: 502 });
  }

  const transaction = await verification.json();
  const correspondance = /^ABN-(.+)$/.exec(transaction.description ?? "");
  if (!correspondance) {
    // Ce paiement ne correspond pas à un abonnement StockFlow (ignoré sans erreur)
    return NextResponse.json({ recu: true });
  }

  const abonnementId = correspondance[1];
  const supabase = creerClientSupabaseAdmin();

  if (transaction.status === "SUCCESS") {
    const { data: abonnement } = await supabase
      .from("abonnements")
      .update({ statut_paiement: "paye" })
      .eq("id", abonnementId)
      .select("boutique_id")
      .single();

    if (abonnement) {
      await supabase.from("boutiques").update({ statut: "actif" }).eq("id", abonnement.boutique_id);
    }
  } else if (transaction.status === "FAILED" || transaction.status === "CANCELLED") {
    await supabase.from("abonnements").update({ statut_paiement: "echoue" }).eq("id", abonnementId);
  }

  return NextResponse.json({ recu: true });
}