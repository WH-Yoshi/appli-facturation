import React from 'react';
import type { Vente, Partenaire, CommissionHistorique } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface CommissionManagerProps {
  ventes: Vente[];
  partenaires: Partenaire[];
  commissionsPayees: CommissionHistorique[];
  onMarquerPayee: (commission: Omit<CommissionHistorique, 'id' | 'datePaiement'>) => void;
  onAnnulerClient: (partenaireId: string, clientFinalNom: string) => void;
}

interface CommissionItem {
  venteId: string;
  partenaireId: string;
  clientFinalNom: string;
  montant: number;
  dateEcheance: string;
  planType: 'Automatique' | 'Personnalisé';
  echeanceId?: string;
  isPaid: boolean;
}

export const CommissionManager: React.FC<CommissionManagerProps> = ({ 
  ventes, 
  partenaires, 
  commissionsPayees,
  onMarquerPayee,
  onAnnulerClient 
}) => {
  const partenaireMap = new Map(partenaires.map(p => [p.id, p]));

  const getAllCommissions = (): CommissionItem[] => {
    const commissions: CommissionItem[] = [];

    ventes.forEach(vente => {
      if (vente.planType === 'Personnalisé' && vente.echeancesPersonnalisees) {
        vente.echeancesPersonnalisees.forEach((echeance, index) => {
          const isPaid = commissionsPayees.some(cp => 
            cp.venteId === vente.id && 
            cp.dateEcheance === echeance.date &&
            Math.abs(cp.montant - echeance.commission) < 0.01
          ) || echeance.statut === 'payee';

          commissions.push({
            venteId: vente.id,
            partenaireId: vente.partenaireId,
            clientFinalNom: vente.clientFinalNom,
            montant: echeance.commission,
            dateEcheance: echeance.date,
            planType: vente.planType,
            echeanceId: echeance.id || `${vente.id}_${index}`,
            isPaid
          });
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
          
          const isPaid = commissionsPayees.some(cp => 
            cp.venteId === vente.id && 
            cp.dateEcheance === dateStr &&
            Math.abs(cp.montant - montantParEcheance) < 0.01
          );

          commissions.push({
            venteId: vente.id,
            partenaireId: vente.partenaireId,
            clientFinalNom: vente.clientFinalNom,
            montant: montantParEcheance,
            dateEcheance: dateStr,
            planType: vente.planType,
            echeanceId: `${vente.id}_auto_${i}`,
            isPaid
          });
        }
      }
    });

    return commissions.sort((a, b) => new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime());
  };

  const commissions = getAllCommissions();
  const commissionsEnAttente = commissions.filter(c => !c.isPaid);
  const totalEnAttente = commissionsEnAttente.reduce((sum, c) => sum + c.montant, 0);

  const handleMarquerPayee = (commission: CommissionItem) => {
    onMarquerPayee({
      venteId: commission.venteId,
      partenaireId: commission.partenaireId,
      clientFinalNom: commission.clientFinalNom,
      montant: commission.montant,
      dateEcheance: commission.dateEcheance,
      planType: commission.planType
    });
  };

  const handleAnnulerClient = (commission: CommissionItem) => {
    onAnnulerClient(commission.partenaireId, commission.clientFinalNom);
  };

  if (commissionsEnAttente.length === 0) {
    return (
      <div className="commission-manager">
        <div className="empty-state">
          Aucune commission en attente de paiement.
        </div>
      </div>
    );
  }

  return (
    <div className="commission-manager">
      <div className="commission-summary">
        <h3>Commissions en Attente</h3>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total en attente:</span>
            <span className="stat-value">{formatCurrency(totalEnAttente)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Nombre d'échéances:</span>
            <span className="stat-value">{commissionsEnAttente.length}</span>
          </div>
        </div>
      </div>

      <div className="commissions-list">
        {commissionsEnAttente.map((commission) => {
          const partenaire = partenaireMap.get(commission.partenaireId);
          const isOverdue = new Date(commission.dateEcheance) < new Date();

          return (
            <div key={`${commission.venteId}_${commission.echeanceId}`} className={`commission-item ${isOverdue ? 'overdue' : ''}`}>
              <div className="commission-info">
                <div className="commission-header">
                  <span className="client-name">{commission.clientFinalNom}</span>
                  <span className="partenaire-name">
                    via {partenaire?.nomSociete || 'Partenaire inconnu'}
                  </span>
                </div>
                <div className="commission-details">
                  <span className="echeance-date">
                    Échéance: {formatDate(commission.dateEcheance)}
                    {isOverdue && <span className="overdue-badge">En retard</span>}
                  </span>
                  <span className="commission-amount">{formatCurrency(commission.montant)}</span>
                </div>
                <div className="plan-type">
                  Plan: {commission.planType}
                </div>
              </div>
              <div className="commission-actions">
                <button
                  className="btn-success"
                  onClick={() => handleMarquerPayee(commission)}
                  title="Marquer cette commission comme payée"
                >
                  ✓ Marquer Payée
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleAnnulerClient(commission)}
                  title="Annuler ce client (supprime toutes ses commissions)"
                >
                  ✕ Annuler Client
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};