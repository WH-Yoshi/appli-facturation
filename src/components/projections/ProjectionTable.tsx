import React from 'react';
import type { Projection, Partenaire } from '../../types';
import { formatCurrency, formatDateMonth } from '../../utils/formatters';

interface ProjectionTableProps {
  projections: Record<string, Projection>;
  partenaires: Partenaire[];
}

export const ProjectionTable: React.FC<ProjectionTableProps> = ({ projections, partenaires }) => {
  const sortedMonths = Object.keys(projections).sort();
  const partenaireMap = new Map(partenaires.map(p => [p.id, p]));

  return (
    <div className="projection-container">
      {sortedMonths.length === 0 ? (
        <p className="empty-state">Aucune commission prévue.</p>
      ) : (
        sortedMonths.map(moisAnnee => {
          const projection = projections[moisAnnee];
          return (
            <div key={moisAnnee} className="mois-card">
              <div className="mois-header">
                <h3>{formatDateMonth(moisAnnee)}</h3>
                <div className="total-encaisser">
                  <span className="label">Total à Encaisser</span>
                  <span className="montant">{formatCurrency(projection.totalGlobal)}</span>
                </div>
              </div>
              
              <div className="partenaires-summary">
                <h4>Détail par Partenaire à Facturer :</h4>
                <ul className="facturation-list">
                  {Object.entries(projection.parPartenaire).map(([partenaireId, montant]) => (
                    <li key={partenaireId} className="facturation-item">
                      <span className="partenaire-name">{partenaireMap.get(partenaireId)?.nomSociete || 'Partenaire Inconnu'}</span>
                      <span className="partenaire-montant">{formatCurrency(montant as number)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="ventes-summary">
                <h4>Ventes contributrices ({projection.ventesDetails.length})</h4>
                <ul className="ventes-list">
                  {projection.ventesDetails.map(vente => (
                    <li key={vente.id}>
                      {vente.clientFinalNom} ({formatCurrency(vente.montantTotalVente)})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};