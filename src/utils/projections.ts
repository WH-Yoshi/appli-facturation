import type { Vente, Projection, CommissionHistorique } from '../types';

export const generateProjections = (ventes: Vente[], commissionsPayees: CommissionHistorique[] = []): Record<string, Projection> => {
  const projections: Record<string, Projection> = {};

  // Fonction utilitaire pour vérifier si une commission est déjà payée
  const isCommissionPayee = (venteId: string, dateEcheance: string, montant: number): boolean => {
    return commissionsPayees.some(commission => 
      commission.venteId === venteId && 
      commission.dateEcheance === dateEcheance &&
      Math.abs(commission.montant - montant) < 0.01
    );
  };

  const addEcheanceToProjection = (dateStr: string, commission: number, vente: Vente) => {
    // Vérifier si cette commission est déjà payée
    if (isCommissionPayee(vente.id, dateStr, commission)) {
      return; // Ne pas ajouter les commissions déjà payées aux projections
    }

    const date = new Date(dateStr);
    const dateKey = new Date(date.getFullYear(), date.getMonth(), 1); 
    const moisAnnee = dateKey.getFullYear() + '-' + String(dateKey.getMonth() + 1).padStart(2, '0');

    if (!projections[moisAnnee]) {
      projections[moisAnnee] = {
        moisAnnee,
        totalGlobal: 0,
        parPartenaire: {},
        ventesDetails: [],
      };
    }

    const projectionMois = projections[moisAnnee];
    projectionMois.totalGlobal += commission;

    const partenaireId = vente.partenaireId;
    projectionMois.parPartenaire[partenaireId] = (projectionMois.parPartenaire[partenaireId] || 0) + commission;

    if (!projectionMois.ventesDetails.some(v => v.id === vente.id)) {
        projectionMois.ventesDetails.push(vente);
    }
  };

  ventes.forEach(vente => {
    if (vente.planType === 'Personnalisé' && vente.echeancesPersonnalisees) {
      vente.echeancesPersonnalisees.forEach(echeance => {
        // Exclure les échéances marquées comme payées
        if (echeance.statut !== 'payee') {
          addEcheanceToProjection(echeance.date, echeance.commission, vente);
        }
      });
    } else if (vente.planType === 'Automatique' && vente.nombreEcheances && vente.pasEcheance) {
      const montantParEcheance = vente.montantCommissionTotal / vente.nombreEcheances;
      const dateDepart = new Date(vente.dateVente);
      const jourVente = dateDepart.getDate();

      for (let i = 1; i <= vente.nombreEcheances; i++) {
        const dateEcheance = new Date(dateDepart);
        dateEcheance.setDate(jourVente);

        if (vente.pasEcheance === 'mensuel') {
          dateEcheance.setMonth(dateEcheance.getMonth() + i);
        } else if (vente.pasEcheance === 'trimestriel') {
          dateEcheance.setMonth(dateEcheance.getMonth() + (i * 3));
        }
        
        if (dateEcheance.getDate() !== jourVente) {
            dateEcheance.setDate(0);
        }

        const dateStr = dateEcheance.toISOString().split('T')[0];
        addEcheanceToProjection(dateStr, montantParEcheance, vente);
      }
    }
  });

  return projections;
};