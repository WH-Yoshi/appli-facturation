import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Partenaire, Vente, PageType } from '../types';
import { loadData, getEmptyData, savePartenairesData, saveVentesData } from '../utils/dataLoader';
import { generateProjections } from '../utils/projections';

export const useCommissionData = () => {
  const [data, setData] = useState(() => getEmptyData());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('Projection');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        const loadedData = await loadData();
        setData(loadedData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    
    const saveData = async () => {
      try {
        await Promise.all([
          savePartenairesData(data.partenaires),
          saveVentesData(data.ventes)
        ]);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    const timeoutId = setTimeout(saveData, 500);
    return () => clearTimeout(timeoutId);
  }, [data, isLoading]);

  const projections = useMemo(() => generateProjections(data.ventes), [data.ventes]);

  const addVente = useCallback((nouvelleVente: Omit<Vente, 'id' | 'montantCommissionTotal'>) => {
    const commissionTotale = nouvelleVente.montantTotalVente * nouvelleVente.tauxCommissionApplique;
    const venteFinale: Vente = {
      ...nouvelleVente,
      id: `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      montantCommissionTotal: commissionTotale,
    };
    setData(prev => ({ ...prev, ventes: [...prev.ventes, venteFinale] }));
    setIsModalOpen(false);
  }, []);
  
  const savePartenaire = useCallback((partenaire: Partial<Partenaire> & { nomSociete: string; tauxCommissionStandard: number }) => {
      setData(prev => {
          const newPartenaires = [...prev.partenaires];
          const index = newPartenaires.findIndex(p => p.id === partenaire.id);

          if (index > -1) {
              newPartenaires[index] = partenaire as Partenaire;
          } else {
              const newId = `p_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
              newPartenaires.push({ ...partenaire, id: newId });
          }
          return { ...prev, partenaires: newPartenaires };
      });
  }, []);

  const deletePartenaire = useCallback((partenaireId: string) => {
    if (data.ventes.some(v => v.partenaireId === partenaireId)) {
        alert("Impossible de supprimer ce partenaire car des ventes lui sont associées.");
        return; 
    }
      setData(prev => ({
          ...prev,
          partenaires: prev.partenaires.filter(p => p.id !== partenaireId),
      }));
  }, [data.ventes]);

  return { 
    data, 
    projections, 
    addVente, 
    isModalOpen, 
    setIsModalOpen, 
    currentPage, 
    setCurrentPage, 
    savePartenaire,
    deletePartenaire,
    isLoading
  };
};