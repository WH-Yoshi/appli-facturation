import type { PageType } from './types';
import { useCommissionData } from './hooks/useCommissionData';
import { Modal } from './components/common/Modal';
import { AddVenteForm } from './components/ventes/AddVenteForm';
import { ProjectionTable } from './components/projections/ProjectionTable';
import { PartnerManager } from './components/partenaires/PartnerManager';
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

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>{currentPage === 'Projection' ? 'Projections de Commissions' : 'Gestion des Partenaires'}</h1>
        
        <nav className="nav-buttons">
          {currentPage === 'Projection' ? (
            <>
              <button className="btn-secondary" onClick={() => handleNavigation('Partenaires')}>
                Gérer Partenaires
              </button>
              <button className="btn-primary" onClick={() => setIsModalOpen(true)} disabled={data.partenaires.length === 0}>
                + Ajouter Vente
              </button>
            </>
          ) : (
            <button className="btn-secondary" onClick={() => handleNavigation('Projection')}>
              &larr; Retour aux Projections
            </button>
          )}
        </nav>
      </header>
      
      <main className="main-content">
        {currentPage === 'Projection' ? (
          <ProjectionTable projections={projections} partenaires={data.partenaires} />
        ) : (
          <PartnerManager 
            partenaires={data.partenaires} 
            savePartenaire={savePartenaire}
            deletePartenaire={deletePartenaire}
          />
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddVenteForm partenaires={data.partenaires} onSubmit={addVente} />
      </Modal>

      {data.partenaires.length === 0 && currentPage === 'Projection' && (
        <div className="warning-message">
          ⚠️ Veuillez ajouter au moins un partenaire avant d'enregistrer une vente.
          <button className="btn-secondary" onClick={() => handleNavigation('Partenaires')}>
            Aller à la Gestion des Partenaires
          </button>
        </div>
      )}
    </div>
  );
}
