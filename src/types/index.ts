export interface Partenaire {
  id: string;
  nomSociete: string;
  tauxCommissionStandard: number;
}

export interface EcheancePersonnalisee {
  date: string;
  commission: number;
  statut?: 'en_attente' | 'payee';
  datePaiement?: string;
  id?: string;
}

export interface Vente {
  id: string;
  partenaireId: string;
  clientFinalNom: string;
  montantTotalVente: number;
  tauxCommissionApplique: number;
  dateVente: string;
  montantCommissionTotal: number;
  planType: 'Automatique' | 'Personnalisé';
  nombreEcheances?: number;
  pasEcheance?: 'mensuel' | 'trimestriel';
  echeancesPersonnalisees?: EcheancePersonnalisee[];
}

export interface Projection {
  moisAnnee: string;
  totalGlobal: number;
  parPartenaire: Record<string, number>;
  ventesDetails: Vente[];
}

export interface CommissionHistorique {
  id: string;
  venteId: string;
  partenaireId: string;
  clientFinalNom: string;
  montant: number;
  dateEcheance: string;
  datePaiement: string;
  planType: 'Automatique' | 'Personnalisé';
}

export interface AppData {
  partenaires: Partenaire[];
  ventes: Vente[];
  commissionsPayees: CommissionHistorique[];
}

export interface FormData {
  partenaireId: string;
  clientFinalNom: string;
  montantTotalVente: number;
  tauxCommissionApplique: number;
  dateVente: string;
  planType: 'Automatique' | 'Personnalisé';
  nombreEcheances: number;
  pasEcheance: 'mensuel' | 'trimestriel';
  echeancesPersonnalisees: EcheancePersonnalisee[];
  montantRestant: number;
}

export type PageType = 'Projection' | 'Partenaires' | 'Historique';