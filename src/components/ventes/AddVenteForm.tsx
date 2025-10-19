import React, { useState, useEffect, useCallback } from 'react';
import type { Partenaire, Vente, FormData, EcheancePersonnalisee } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface AddVenteFormProps {
  partenaires: Partenaire[];
  onSubmit: (vente: Omit<Vente, 'id' | 'montantCommissionTotal'>) => void;
}

export const AddVenteForm: React.FC<AddVenteFormProps> = ({ partenaires, onSubmit }) => {
  const initialPartenaire = partenaires[0];
  const [formData, setFormData] = useState<FormData>({
    partenaireId: initialPartenaire?.id || '',
    clientFinalNom: '',
    montantTotalVente: 0,
    tauxCommissionApplique: initialPartenaire?.tauxCommissionStandard || 0,
    dateVente: new Date().toISOString().split('T')[0],
    planType: 'Automatique',
    nombreEcheances: 6,
    pasEcheance: 'mensuel',
    echeancesPersonnalisees: [],
    montantRestant: 0,
  });

  useEffect(() => {
    if (formData.partenaireId) {
      const selectedPartner = partenaires.find(p => p.id === formData.partenaireId);
      setFormData(prev => ({
        ...prev,
        tauxCommissionApplique: selectedPartner?.tauxCommissionStandard || 0,
      }));
    }
  }, [formData.partenaireId, partenaires]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };
  
  const updateMontantRestant = useCallback((currentFormData: FormData) => {
    const totalCommission = currentFormData.montantTotalVente * currentFormData.tauxCommissionApplique;
    const totalAssigned = currentFormData.echeancesPersonnalisees.reduce((sum: number, e: EcheancePersonnalisee) => sum + (e.commission || 0), 0);
    return totalCommission - totalAssigned;
  }, []);

  const handleCustomChange = (index: number, field: keyof EcheancePersonnalisee, value: string) => {
    setFormData(prev => {
      const newEcheances = [...prev.echeancesPersonnalisees];
      if (field === 'commission') {
        newEcheances[index] = { ...newEcheances[index], commission: parseFloat(value) };
      } else if (field === 'date') {
        newEcheances[index] = { ...newEcheances[index], date: value };
      }

      const updatedForm = { ...prev, echeancesPersonnalisees: newEcheances };
      const montantRestant = updateMontantRestant(updatedForm);
      
      return {
        ...updatedForm,
        montantRestant: montantRestant,
      };
    });
  };

  const addCustomEcheance = () => {
    setFormData(prev => ({
      ...prev,
      echeancesPersonnalisees: [...prev.echeancesPersonnalisees, { 
        date: new Date().toISOString().split('T')[0], 
        commission: 0,
        statut: 'en_attente',
        id: `echeance_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      }],
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const totalCommission = formData.montantTotalVente * formData.tauxCommissionApplique;
    let finalVente: Omit<Vente, 'id' | 'montantCommissionTotal'> = {
      partenaireId: formData.partenaireId,
      clientFinalNom: formData.clientFinalNom,
      montantTotalVente: formData.montantTotalVente,
      tauxCommissionApplique: formData.tauxCommissionApplique,
      dateVente: formData.dateVente,
      planType: formData.planType,
    };

    if (formData.planType === 'Automatique') {
      finalVente = {
        ...finalVente,
        nombreEcheances: formData.nombreEcheances,
        pasEcheance: formData.pasEcheance,
      };
    } else {
      const assignedTotal = formData.echeancesPersonnalisees.reduce((sum: number, e: EcheancePersonnalisee) => sum + e.commission, 0);
       if (Math.abs(assignedTotal - totalCommission) > 0.02) { 
          console.error("Erreur: La somme des commissions personnalisées ne correspond pas au total.");
          return;
      }
      finalVente = {
        ...finalVente,
        echeancesPersonnalisees: formData.echeancesPersonnalisees,
      };
    }
    
    onSubmit(finalVente);
  };

  const commissionTotale = formData.montantTotalVente * formData.tauxCommissionApplique;
  const isCustomPlan = formData.planType === 'Personnalisé';

  useEffect(() => {
    if (isCustomPlan) {
      setFormData(prev => ({ ...prev, montantRestant: updateMontantRestant(prev) }));
    }
  }, [formData.montantTotalVente, formData.tauxCommissionApplique, isCustomPlan, updateMontantRestant]);

  const isSubmitDisabled = isCustomPlan && Math.abs(formData.montantRestant) > 0.02;

  return (
    <form onSubmit={handleSubmit} className="form-vente">
      <h2>Ajouter une Nouvelle Vente</h2>
      
      <div className="form-group">
        <label htmlFor="partenaireId">Partenaire (Ton Client)</label>
        <select id="partenaireId" name="partenaireId" value={formData.partenaireId} onChange={handleChange} required>
          {partenaires.map(p => (
            <option key={p.id} value={p.id}>{p.nomSociete}</option>
          ))}
        </select>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label htmlFor="clientFinalNom">Client Final (Nom)</label>
          <input id="clientFinalNom" type="text" name="clientFinalNom" value={formData.clientFinalNom} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="dateVente">Date de Vente</label>
          <input id="dateVente" type="date" name="dateVente" value={formData.dateVente} onChange={handleChange} required />
        </div>
      </div>

      <div className="grid-3">
        <div className="form-group">
          <label htmlFor="montantTotalVente">Montant Total Vente (€)</label>
          <input id="montantTotalVente" type="number" step="0.01" name="montantTotalVente" value={formData.montantTotalVente} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="tauxCommissionApplique">Taux Commission Appliqué (%)</label>
          <input id="tauxCommissionApplique" type="number" step="0.01" name="tauxCommissionApplique" value={formData.tauxCommissionApplique * 100} onChange={e => setFormData(prev => ({ ...prev, tauxCommissionApplique: parseFloat(e.target.value) / 100 }))} required />
        </div>
        <div className="form-group commission-total-display">
          <label>Commission Totale</label>
          <div className="total-value">{formatCurrency(commissionTotale)}</div>
        </div>
      </div>

      <hr />

      <div className="form-group">
        <label htmlFor="planType">Plan de Paiement</label>
        <select id="planType" name="planType" value={formData.planType} onChange={handleChange}>
          <option value="Automatique">Automatique (Montants Égaux)</option>
          <option value="Personnalisé">Personnalisé (Dates et Montants Spécifiques)</option>
        </select>
      </div>
      
      {!isCustomPlan ? (
        <div className="grid-2">
          <div className="form-group">
            <label htmlFor="nombreEcheances">Nombre d'Échéances</label>
            <input id="nombreEcheances" type="number" name="nombreEcheances" value={formData.nombreEcheances} onChange={handleChange} min="1" required />
          </div>
          <div className="form-group">
            <label htmlFor="pasEcheance">Pas entre Échéances</label>
            <select id="pasEcheance" name="pasEcheance" value={formData.pasEcheance} onChange={handleChange} required>
              <option value="mensuel">Mensuel</option>
              <option value="trimestriel">Trimestriel</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="personnalise-config">
          <p className={`montant-restant ${!isSubmitDisabled && 'ok'}`}>
            Montant à assigner : <strong>{formatCurrency(formData.montantRestant)}</strong>
          </p>

          {formData.echeancesPersonnalisees.map((e, index) => (
            <div key={index} className="custom-echeance-row">
              <input 
                type="date" 
                value={e.date} 
                onChange={event => handleCustomChange(index, 'date', event.target.value)} 
                required 
                aria-label={`Date de l'échéance ${index + 1}`}
                id='input-date'
                name='date'
              />
              <input 
                type="number" 
                step="0.01" 
                value={e.commission} 
                onChange={event => handleCustomChange(index, 'commission', event.target.value)} 
                required 
                aria-label={`Commission de l'échéance ${index + 1}`}
                id='input-commission'
                name='commission'
              />
              <div className="delete-wrapper">
                <button type="button" onClick={() => {
                  const newEcheances = formData.echeancesPersonnalisees.filter((_, i) => i !== index);
                  setFormData(prev => ({ 
                    ...prev, 
                    echeancesPersonnalisees: newEcheances,
                    montantRestant: updateMontantRestant({...prev, echeancesPersonnalisees: newEcheances}) 
                  }));
                }} className="btn-delete" aria-label={`Supprimer l'échéance ${index + 1}`}>&times;</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addCustomEcheance} className="btn-secondary">
            + Ajouter une Échéance
          </button>
        </div>
      )}
      
      <button type="submit" className="btn-primary" disabled={isSubmitDisabled || partenaires.length === 0}>
        Enregistrer la Vente
      </button>
    </form>
  );
};