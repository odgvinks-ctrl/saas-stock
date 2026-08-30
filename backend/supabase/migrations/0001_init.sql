-- ============================================
-- Stock SaaS - Schéma initial de la base de données
-- ============================================

-- Extension pour générer des UUID
create extension if not exists "uuid-ossp";

-- ============================================
-- BOUTIQUES
-- ============================================
create table boutiques (
  id uuid primary key default uuid_generate_v4(),
  nom text not null,
  adresse text,
  proprietaire_id uuid references auth.users(id) not null,
  plan_abonnement text default 'solo' check (plan_abonnement in ('solo', 'equipe', 'multi')),
  statut text default 'actif' check (statut in ('actif', 'inactif')),
  created_at timestamptz default now()
);

-- ============================================
-- PROFILS UTILISATEURS (lié à auth.users de Supabase)
-- ============================================
create table profils (
  id uuid primary key references auth.users(id) on delete cascade,
  nom text not null,
  telephone text,
  role text default 'employe' check (role in ('proprietaire', 'gestionnaire', 'vendeur')),
  boutique_id uuid references boutiques(id),
  created_at timestamptz default now()
);

-- ============================================
-- CATEGORIES
-- ============================================
create table categories (
  id uuid primary key default uuid_generate_v4(),
  boutique_id uuid references boutiques(id) not null,
  nom text not null,
  created_at timestamptz default now()
);

-- ============================================
-- PRODUITS
-- ============================================
create table produits (
  id uuid primary key default uuid_generate_v4(),
  boutique_id uuid references boutiques(id) not null,
  categorie_id uuid references categories(id),
  nom text not null,
  sku text,
  prix_achat numeric(12,2) not null default 0,
  prix_vente numeric(12,2) not null default 0,
  photo_url text,
  created_at timestamptz default now()
);

-- ============================================
-- STOCK (quantité actuelle par produit)
-- ============================================
create table stock (
  id uuid primary key default uuid_generate_v4(),
  produit_id uuid references produits(id) not null unique,
  boutique_id uuid references boutiques(id) not null,
  quantite integer not null default 0,
  seuil_alerte integer not null default 10,
  updated_at timestamptz default now()
);

-- ============================================
-- MOUVEMENTS DE STOCK (historique entrées/sorties/transferts)
-- ============================================
create table mouvements_stock (
  id uuid primary key default uuid_generate_v4(),
  produit_id uuid references produits(id) not null,
  boutique_id uuid references boutiques(id) not null,
  boutique_destination_id uuid references boutiques(id),
  type text not null check (type in ('entree', 'sortie', 'transfert')),
  quantite integer not null,
  note text,
  utilisateur_id uuid references auth.users(id),
  created_at timestamptz default now()
);

-- ============================================
-- VENTES
-- ============================================
create table ventes (
  id uuid primary key default uuid_generate_v4(),
  boutique_id uuid references boutiques(id) not null,
  utilisateur_id uuid references auth.users(id),
  montant_total numeric(12,2) not null,
  mode_paiement text check (mode_paiement in ('especes', 'wave', 'orange_money')),
  created_at timestamptz default now()
);

-- ============================================
-- LIGNES DE VENTE (détail des produits vendus par vente)
-- ============================================
create table lignes_vente (
  id uuid primary key default uuid_generate_v4(),
  vente_id uuid references ventes(id) on delete cascade not null,
  produit_id uuid references produits(id) not null,
  quantite integer not null,
  prix_unitaire numeric(12,2) not null
);

-- ============================================
-- ABONNEMENTS (facturation SaaS)
-- ============================================
create table abonnements (
  id uuid primary key default uuid_generate_v4(),
  boutique_id uuid references boutiques(id) not null,
  plan text not null check (plan in ('solo', 'equipe', 'multi')),
  montant numeric(12,2) not null,
  date_debut date not null,
  date_fin date not null,
  statut_paiement text default 'en_attente' check (statut_paiement in ('paye', 'en_attente', 'echoue')),
  created_at timestamptz default now()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  utilisateur_id uuid references auth.users(id) not null,
  type text not null,
  message text not null,
  lu boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- Index utiles pour la performance
-- ============================================
create index idx_produits_boutique on produits(boutique_id);
create index idx_stock_boutique on stock(boutique_id);
create index idx_mouvements_boutique on mouvements_stock(boutique_id);
create index idx_ventes_boutique on ventes(boutique_id);
create index idx_ventes_created_at on ventes(created_at);