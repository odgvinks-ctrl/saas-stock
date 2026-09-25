import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const chemin = request.nextUrl.pathname;
  const cheminsPublics = ["/login", "/register", "/forgot-password"];
  const cheminsExemptesPaiement = ["/abonnement", "/api/paiement", "/api/webhooks", "/admin"];

  const estCheminPublic = cheminsPublics.some((c) => chemin.startsWith(c));
  const estExempte = cheminsExemptesPaiement.some((c) => chemin.startsWith(c));

  // Pas connecté et essaie d'accéder à une page protégée
  if (!user && !estCheminPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Déjà connecté et essaie d'accéder à login/register
  if (user && estCheminPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Connecté, sur une route qui exige un abonnement payé
  if (user && !estCheminPublic && !estExempte) {
    const { data: profil } = await supabase
      .from("profils")
      .select("boutique_id, est_super_admin")
      .eq("id", user.id)
      .single();

    // Un super-admin a un accès total, sans passer par la vérification d'abonnement
    if (profil?.est_super_admin) {
      return response;
    }

    if (profil?.boutique_id) {
      const { data: abonnement } = await supabase
        .from("abonnements")
        .select("statut_paiement, date_fin")
        .eq("boutique_id", profil.boutique_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const estValide =
        abonnement?.statut_paiement === "paye" &&
        (!abonnement.date_fin || new Date(abonnement.date_fin) >= new Date());

      if (!estValide) {
        const url = request.nextUrl.clone();
        url.pathname = "/abonnement";
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};