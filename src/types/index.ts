export interface Partenaire {
  id: string;
  nomSociete: string;
  tauxCommissionStandard: number;
}

export interface EcheancePersonnalisee {
  date: string;
  commission: number;
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

export interface AppData {
  partenaires: Partenaire[];
  ventes: Vente[];
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

export type PageType = 'Projection' | 'Partenaires';