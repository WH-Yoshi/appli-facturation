import React, { useState } from 'react';
import type { Partenaire } from '../../types';

interface PartenaireFormProps {
  partenaire: (Partial<Partenaire> & { nomSociete: string; tauxCommissionStandard: number }) | null;
  onSubmit: (partenaire: Partial<Partenaire> & { nomSociete: string; tauxCommissionStandard: number }) => void;
}

export const PartenaireForm: React.FC<PartenaireFormProps> = ({ partenaire, onSubmit }) => {
  const [formData, setFormData] = useState(partenaire || { nomSociete: '', tauxCommissionStandard: 0.1 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tauxCommissionStandard' ? parseFloat(value) / 100 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-partenaire">
      <h3>{formData.id ? 'Éditer le Partenaire' : 'Nouveau Partenaire'}</h3>
      <div className="form-group">
        <label htmlFor="nomSociete">Nom de la Société</label>
        <input 
          id="nomSociete"
          type="text" 
          name="nomSociete" 
          value={formData.nomSociete} 
          onChange={handleChange} 
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="tauxCommissionStandard">Taux de Commission Standard (%)</label>
        <input 
          id="tauxCommissionStandard"
          type="number" 
          step="0.01" 
          name="tauxCommissionStandard" 
          value={(formData.tauxCommissionStandard * 100).toFixed(2)} 
          onChange={handleChange} 
          required 
          min="0"
        />
      </div>
      <button type="submit" className="btn-primary">
        {formData.id ? 'Sauvegarder les Modifications' : 'Ajouter le Partenaire'}
      </button>
    </form>
  );
};