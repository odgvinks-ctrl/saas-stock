import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase avec la clé "service_role" (secrète).
 * Contourne le RLS — à utiliser UNIQUEMENT côté serveur (routes API, webhooks),
 * jamais dans un composant client ni exposé au navigateur.
 */
export function creerClientSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
