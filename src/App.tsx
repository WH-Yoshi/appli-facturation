import type { PageType } from './types';
import { useCommissionData } from './hooks/useCommissionData';
import { Modal } from './components/common/Modal';
import { AddVenteForm } from './components/ventes/AddVenteForm';
import { ProjectionTable } from './components/projections/ProjectionTable';
import { PartnerManager } from './components/partenaires/PartnerManager';
import { CommissionManager } from './components/commissions/CommissionManager';
import { CommissionHistoriqueComponent } from './components/commissions/CommissionHistorique';
import './styles/index.scss';

export default function App() {
  const { 
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
    annulerClient,
    isLoading
  } = useCommissionData();

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          Chargement des données...
        </div>
      </div>
    );
  }

  const handleNavigation = (page: PageType) => {
    setCurrentPage(page);
    setIsModalOpen(false);
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'Projection':
        return 'Projections de Commissions';
      case 'Partenaires':
        return 'Gestion des Partenaires';
      case 'Historique':
        return 'Historique des Commissions';
      default:
        return 'Application de Facturation';
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>{getPageTitle()}</h1>
        
        <nav className="nav-buttons">
          {currentPage === 'Projection' ? (
            <>
              <button className="btn-secondary" onClick={() => handleNavigation('Partenaires')}>
                Gérer Partenaires
              </button>
              <button className="btn-secondary" onClick={() => handleNavigation('Historique')}>
                Historique
              </button>
              <button className="btn-primary" onClick={() => setIsModalOpen(true)} disabled={data.partenaires.length === 0}>
                + Ajouter Vente
              </button>
            </>
          ) : currentPage === 'Partenaires' ? (
            <>
              <button className="btn-secondary" onClick={() => handleNavigation('Projection')}>
                Voir Projections
              </button>
              <button className="btn-secondary" onClick={() => handleNavigation('Historique')}>
                Historique
              </button>
            </>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => handleNavigation('Projection')}>
                Voir Projections
              </button>
              <button className="btn-secondary" onClick={() => handleNavigation('Partenaires')}>
                Gérer Partenaires
              </button>
            </>
          )}
        </nav>
      </header>
      
      <main className="main-content">
        {currentPage === 'Projection' ? (
          <>
            <ProjectionTable 
              projections={projections} 
              partenaires={data.partenaires} 
            />
            <CommissionManager 
              ventes={data.ventes}
              partenaires={data.partenaires}
              commissionsPayees={data.commissionsPayees}
              onMarquerPayee={marquerCommissionPayee}
              onAnnulerClient={annulerClient}
            />
          </>
        ) : currentPage === 'Partenaires' ? (
          <PartnerManager 
            partenaires={data.partenaires} 
            savePartenaire={savePartenaire}
            deletePartenaire={deletePartenaire}
          />
        ) : (
          <CommissionHistoriqueComponent 
            commissionsPayees={data.commissionsPayees}
            partenaires={data.partenaires}
          />
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddVenteForm partenaires={data.partenaires} onSubmit={addVente} />
      </Modal>

      {data.partenaires.length === 0 && currentPage === 'Projection' && (
        <div className="warning-message">
          <p>Ajoute au moins un partenaire avant d'enregistrer une vente.</p>
          <button className="btn-secondary" onClick={() => handleNavigation('Partenaires')}>
            Vers Gestion des Partenaires
          </button>
        </div>
      )}
    </div>
  );
}
