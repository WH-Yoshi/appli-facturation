import React, { useState } from 'react';
import type { Partenaire } from '../../types';
import { Modal } from '../common/Modal';
import { PartenaireForm } from './PartenaireForm';

interface PartnerManagerProps {
  partenaires: Partenaire[];
  savePartenaire: (partenaire: Partial<Partenaire> & { nomSociete: string; tauxCommissionStandard: number }) => void;
  deletePartenaire: (partenaireId: string) => void;
}

export const PartnerManager: React.FC<PartnerManagerProps> = ({ partenaires, savePartenaire, deletePartenaire }) => {
  const [editingPartenaire, setEditingPartenaire] = useState<(Partial<Partenaire> & { nomSociete: string; tauxCommissionStandard: number }) | null>(null);

  const handleEdit = (partenaire: Partenaire) => setEditingPartenaire(partenaire);
  const handleNew = () => setEditingPartenaire({ nomSociete: '', tauxCommissionStandard: 0.1 });
  const handleCancel = () => setEditingPartenaire(null);

  return (
    <div className="partner-manager">
      <div className="top-section">
        <h2>Gestion de Mes Partenaires</h2>

        <button onClick={handleNew} className="btn-primary add-partner-btn">
          + Ajouter un Nouveau Partenaire
        </button>
      </div>
      
      
      <Modal isOpen={!!editingPartenaire} onClose={handleCancel}>
        <PartenaireForm 
          partenaire={editingPartenaire} 
          onSubmit={(p: Partial<Partenaire> & { nomSociete: string; tauxCommissionStandard: number }) => { savePartenaire(p); handleCancel(); }} 
        />
      </Modal>

      <div className="partenaires-list">
        {partenaires.map((p: Partenaire) => (
          <div key={p.id} className="partenaire-item">
            <div className="info">
              <div className="name">{p.nomSociete}</div>
              <div className="rate">Taux Standard : {(p.tauxCommissionStandard * 100).toFixed(1)}%</div>
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(p)} className="btn-secondary">Éditer</button>
              <button onClick={() => deletePartenaire(p.id)} className="btn-delete">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};