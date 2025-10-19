import React from 'react';
import type { CommissionHistorique, Partenaire } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface CommissionHistoriqueProps {
  commissionsPayees: CommissionHistorique[];
  partenaires: Partenaire[];
}

export const CommissionHistoriqueComponent: React.FC<CommissionHistoriqueProps> = ({ 
  commissionsPayees, 
  partenaires 
}) => {
  const partenaireMap = new Map(partenaires.map(p => [p.id, p]));

  const commissionsSorted = [...commissionsPayees].sort((a, b) => 
    new Date(b.datePaiement).getTime() - new Date(a.datePaiement).getTime()
  );

  const totalPaye = commissionsPayees.reduce((sum, c) => sum + c.montant, 0);
  const commissionsParMois = commissionsPayees.reduce((acc, commission) => {
    const mois = commission.datePaiement.substring(0, 7);
    acc[mois] = (acc[mois] || 0) + commission.montant;
    return acc;
  }, {} as Record<string, number>);

  if (commissionsPayees.length === 0) {
    return (
      <div className="commission-historique">
        <div className="empty-state">
          Aucune commission payée pour le moment.<br/>
          Les commissions marquées comme payées apparaîtront ici.
        </div>
      </div>
    );
  }

  return (
    <div className="commission-historique">
      <div className="historique-summary">
        <h3>Historique des Commissions Payées</h3>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total payé:</span>
            <span className="stat-value total-paid">{formatCurrency(totalPaye)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Nombre de paiements:</span>
            <span className="stat-value">{commissionsPayees.length}</span>
          </div>
        </div>
      </div>

      {Object.keys(commissionsParMois).length > 1 && (
        <div className="monthly-breakdown">
          <h4>Répartition Mensuelle</h4>
          <div className="monthly-stats">
            {Object.entries(commissionsParMois)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 6)
              .map(([mois, montant]) => (
                <div key={mois} className="monthly-stat">
                  <span className="month-label">{formatDate(mois + '-01')}</span>
                  <span className="month-amount">{formatCurrency(montant)}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="historique-list">
        {commissionsSorted.map((commission) => {
          const partenaire = partenaireMap.get(commission.partenaireId);
          
          return (
            <div key={commission.id} className="commission-historique-item">
              <div className="commission-info">
                <div className="commission-header">
                  <span className="client-name">{commission.clientFinalNom}</span>
                  <span className="partenaire-name">
                    via {partenaire?.nomSociete || 'Partenaire inconnu'}
                  </span>
                </div>
                <div className="commission-details">
                  <div className="dates-info">
                    <span className="echeance-date">
                      Échéance: {formatDate(commission.dateEcheance)}
                    </span>
                    <span className="paiement-date">
                      Payé le: {formatDate(commission.datePaiement)}
                    </span>
                  </div>
                  <span className="commission-amount paid">{formatCurrency(commission.montant)}</span>
                </div>
                <div className="plan-type">
                  Plan: {commission.planType}
                </div>
              </div>
              <div className="commission-status">
                <span className="status-badge paid">✓ Payée</span>
              </div>
            </div>
          );
        })}
      </div>

      {commissionsPayees.length > 10 && (
        <div className="historique-footer">
          <p className="total-summary">
            {commissionsPayees.length} commissions payées • Total: {formatCurrency(totalPaye)}
          </p>
        </div>
      )}
    </div>
  );
};