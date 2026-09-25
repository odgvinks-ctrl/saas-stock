-- ============================================
-- Intégration SasPay - colonne de correlation checkout
-- ============================================

alter table abonnements add column checkout_session_id text;
alter table abonnements add column reference_paiement text;

-- Un abonnement "solo" par boutique max (on supprime le multi-plan)
-- Le champ plan devient : 'mensuel' ou 'annuel'
alter table abonnements drop constraint if exists abonnements_plan_check;
alter table abonnements add constraint abonnements_plan_check
  check (plan in ('mensuel', 'annuel'));

create index idx_abonnements_checkout_session on abonnements(checkout_session_id);
