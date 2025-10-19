import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Partenaire, Vente, PageType, CommissionHistorique } from '../types';
import { loadData, getEmptyData, savePartenairesData, saveVentesData, saveCommissionsData } from '../utils/dataLoader';
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
          saveVentesData(data.ventes),
          saveCommissionsData(data.commissionsPayees)
        ]);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    const timeoutId = setTimeout(saveData, 500);
    return () => clearTimeout(timeoutId);
  }, [data, isLoading]);

  const projections = useMemo(() => generateProjections(data.ventes, data.commissionsPayees), [data.ventes, data.commissionsPayees]);

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

  const marquerCommissionPayee = useCallback((commission: Omit<CommissionHistorique, 'id' | 'datePaiement'>) => {
    const nouvelleCommission: CommissionHistorique = {
      ...commission,
      id: `comm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      datePaiement: new Date().toISOString().split('T')[0]
    };

    // Ajouter à l'historique des commissions payées
    setData(prev => ({
      ...prev,
      commissionsPayees: [...prev.commissionsPayees, nouvelleCommission]
    }));

    // Marquer l'échéance correspondante comme payée si c'est un plan personnalisé
    setData(prev => ({
      ...prev,
      ventes: prev.ventes.map(vente => {
        if (vente.id === commission.venteId && vente.planType === 'Personnalisé' && vente.echeancesPersonnalisees) {
          return {
            ...vente,
            echeancesPersonnalisees: vente.echeancesPersonnalisees.map(echeance => {
              if (echeance.date === commission.dateEcheance && 
                  Math.abs(echeance.commission - commission.montant) < 0.01) {
                return {
                  ...echeance,
                  statut: 'payee' as const,
                  datePaiement: nouvelleCommission.datePaiement
                };
              }
              return echeance;
            })
          };
        }
        return vente;
      })
    }));
  }, []);

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
    marquerCommissionPayee,
    isLoading
  };
};