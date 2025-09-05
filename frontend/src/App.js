import React, { useState, useEffect } from 'react';
import './App.css';

// Configuration de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Service API complet
const apiService = {
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/images/upload`, {
      method: 'POST',
      body: formData,
      headers: { 'x-source': 'web-app' }
    });

    if (!response.ok) {
      throw new Error(`Erreur upload: ${response.statusText}`);
    }
    return response.json();
  },

  async getImageDetails(imageId) {
    const response = await fetch(`${API_BASE_URL}/images/${imageId}`);
    if (!response.ok) {
      throw new Error(`Erreur récupération: ${response.statusText}`);
    }
    return response.json();
  },

  async getImageStatus(imageId) {
    const response = await fetch(`${API_BASE_URL}/images/${imageId}/status`);
    if (!response.ok) {
      throw new Error(`Erreur statut: ${response.statusText}`);
    }
    return response.json();
  },

  async listImages() {
    const response = await fetch(`${API_BASE_URL}/images?limit=50`);
    if (!response.ok) {
      throw new Error(`Erreur liste: ${response.statusText}`);
    }
    return response.json();
  }
};

// Header corrigé avec bouton accueil
function CorrectedHeader({ currentView, setCurrentView, analysisData, onBackToHome }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <img src="/ba7athh_logo.png" alt="Ba7athh" className="logo" />
        <h1>🔍 Forensic Image Analysis</h1>
      </div>
      <nav className="main-nav">
        <button 
          className={currentView === 'upload' ? 'active' : ''}
          onClick={() => setCurrentView('upload')}
        >
          🏠 Accueil
        </button>
        <button 
          className={currentView === 'gallery' ? 'active' : ''}
          onClick={() => setCurrentView('gallery')}
        >
          🖼️ Galerie
        </button>
        <button 
          className={currentView === 'results' ? 'active' : ''}
          onClick={() => setCurrentView('results')}
          disabled={!analysisData}
        >
          📊 Résultats
        </button>
        {analysisData && (
          <button 
            className="btn-back"
            onClick={onBackToHome}
          >
            🏠 Retour Accueil
          </button>
        )}
      </nav>
    </header>
  );
}

// Upload corrigé
function CorrectedUpload({ onImageUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      setUploading(true);
      setError(null);

      try {
        const result = await apiService.uploadImage(file);
        onImageUploaded(result);
      } catch (error) {
        console.error('Erreur upload:', error);
        setError(error.message);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-zone">
        {uploading ? (
          <div className="upload-progress">
            <div className="spinner"></div>
            <h3>🔍 Analyse forensique en cours...</h3>
            <p>Extraction des métadonnées EXIF, détection de manipulation et analyse IA</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">📤</div>
            <h3>Glissez votre image ici</h3>
            <label htmlFor="file-input" className="file-input-label">
              ou cliquez pour parcourir
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            <div className="upload-info">
              <p>Formats supportés: JPG, PNG, TIFF, WebP</p>
              <p>Taille maximum: 50MB</p>
            </div>
          </>
        )}
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

// Galerie CLIQUABLE corrigée
function CorrectedGallery({ recentImages, loading, onImageClick }) {
  return (
    <div className="gallery-view">
      <h2>🖼️ Galerie des images analysées</h2>
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <h3>Chargement...</h3>
        </div>
      ) : recentImages.length > 0 ? (
        <div className="images-grid">
          {recentImages.map((img) => (
            <div 
              key={img.id} 
              className="image-card clickable-card"
              onClick={() => onImageClick(img)}
              style={{ cursor: 'pointer', border: '2px solid #E5E7EB' }}
            >
              <div className="image-info">
                <h4 className="image-name">{img.filename}</h4>
                <div className="image-status">
                  Status: <span className={`status-${img.status}`}>{img.status}</span>
                </div>
                {img.authenticityScore > 0 && (
                  <div className="image-score">
                    Authenticité: {img.authenticityScore}/100
                  </div>
                )}
                <div style={{ fontSize: '12px', color: '#06B6D4', marginTop: '4px' }}>
                  👆 Cliquez pour voir les détails
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>📂 Aucune image analysée</h3>
          <p>Uploadez votre première image pour commencer l'analyse forensique</p>
        </div>
      )}
    </div>
  );
}

// Résultats COMPLETS avec CSS inline
function CorrectedResults({ imageData }) {
  const [downloading, setDownloading] = useState({ pdf: false, json: false });

  if (!imageData || !imageData.forensicAnalysis) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>❌ Données d'analyse non disponibles</h3>
        <p>L'analyse de cette image n'est pas encore terminée ou a échoué.</p>
      </div>
    );
  }

  const { forensicAnalysis, exifData, originalName, _id, size, createdAt } = imageData;

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#10B981';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const handleDownloadPDF = async () => {
    setDownloading(prev => ({ ...prev, pdf: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${_id}/pdf`);
      if (!response.ok) throw new Error('Erreur lors du téléchargement du PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const downloadElement = document.createElement('a');
      downloadElement.href = url;
      downloadElement.download = `rapport_${originalName}_${new Date().toISOString().split('T')[0]}.pdf`;
      downloadElement.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur téléchargement PDF:', error);
      alert('Erreur lors du téléchargement du PDF');
    } finally {
      setDownloading(prev => ({ ...prev, pdf: false }));
    }
  };

  const handleDownloadJSON = async () => {
    setDownloading(prev => ({ ...prev, json: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${_id}/json`);
      if (!response.ok) throw new Error('Erreur lors du téléchargement du JSON');
      
      const jsonData = await response.json();
      const jsonString = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const downloadElement = document.createElement('a');
      downloadElement.href = url;
      downloadElement.download = `analyse_${originalName}_${new Date().toISOString().split('T')[0]}.json`;
      downloadElement.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur téléchargement JSON:', error);
      alert('Erreur lors du téléchargement du JSON');
    } finally {
      setDownloading(prev => ({ ...prev, json: false }));
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header des résultats */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
        padding: '32px', 
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0F172A', marginBottom: '8px' }}>
          Résultats d'analyse forensique
        </h1>
        <h2 style={{ fontSize: '20px', color: '#64748B', marginBottom: '16px' }}>{originalName}</h2>
      </div>

      {/* Informations du fichier */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
        padding: '24px',
        marginBottom: '32px'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
          📄 Informations du fichier
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px' }}>
            <strong>Nom du fichier:</strong><br />
            {originalName}
          </div>
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px' }}>
            <strong>Taille:</strong><br />
            {formatFileSize(size || 0)}
          </div>
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px' }}>
            <strong>Date d'analyse:</strong><br />
            {new Date(createdAt).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>

      {/* Scores CORRIGÉS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {[
          {
            title: 'Authenticité',
            score: forensicAnalysis.authenticity?.score || 0,
            detail: `Confiance: ${forensicAnalysis.authenticity?.confidence || 'low'}`,
            icon: '✅'
          },
          {
            title: 'Intégrité',
            score: 100 - (forensicAnalysis.manipulationDetection?.overall || 0),
            detail: `Manipulation détectée: ${forensicAnalysis.manipulationDetection?.overall || 0}/100`,
            icon: '🛡️'
          },
          {
            title: 'IA Générée',
            score: forensicAnalysis.aiDetection?.generated || 0,
            detail: `Probabilité IA: ${forensicAnalysis.aiDetection?.generated || 0}%`,
            icon: '🤖'
          },
          {
            title: 'Deepfake',
            score: forensicAnalysis.aiDetection?.deepfake || 0,
            detail: `Risque deepfake: ${forensicAnalysis.aiDetection?.deepfake || 0}%`,
            icon: '👤'
          }
        ].map((item, index) => (
          <div key={index} style={{ 
            background: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
            <h4 style={{ color: '#6B7280', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>
              {item.title.toUpperCase()}
            </h4>
            <div style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              marginBottom: '12px',
              color: getScoreColor(item.score)
            }}>
              {item.score}/100
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>
              {item.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Alertes détectées */}
      {forensicAnalysis.flags && forensicAnalysis.flags.length > 0 && (
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
          padding: '24px',
          marginBottom: '32px'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            🚩 Alertes détectées ({forensicAnalysis.flags.length})
          </h3>
          {forensicAnalysis.flags.map((flag, index) => (
            <div key={index} style={{ 
              padding: '16px', 
              marginBottom: '12px',
              borderRadius: '12px',
              borderLeft: '4px solid #EF4444',
              background: '#FEF2F2'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {flag.type.replace(/_/g, ' ').toUpperCase()}
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                Confiance: {flag.confidence}%
              </div>
              <div>{flag.message}</div>
            </div>
          ))}
        </div>
      )}

      {/* Section téléchargement */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
          📥 Télécharger les rapports
        </h3>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: downloading.pdf ? 'not-allowed' : 'pointer',
              opacity: downloading.pdf ? 0.7 : 1
            }}
            onClick={handleDownloadPDF}
            disabled={downloading.pdf}
          >
            {downloading.pdf ? 'Génération en cours...' : '📄 Télécharger le rapport PDF'}
          </button>
          
          <button 
            style={{
              background: 'transparent',
              color: '#3B82F6',
              border: '2px solid #3B82F6',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: downloading.json ? 'not-allowed' : 'pointer',
              opacity: downloading.json ? 0.7 : 1
            }}
            onClick={handleDownloadJSON}
            disabled={downloading.json}
          >
            {downloading.json ? 'Exportation en cours...' : '📋 Exporter les données JSON'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant principal App COMPLET
function App() {
  const [currentView, setCurrentView] = useState('upload');
  const [analysisData, setAnalysisData] = useState(null);
  const [recentImages, setRecentImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecentImages();
  }, []);

  const loadRecentImages = async () => {
    try {
      setLoading(true);
      const data = await apiService.listImages();
      setRecentImages(data.images || []);
    } catch (error) {
      console.error('Erreur chargement images:', error);
      setError('Erreur lors du chargement des images récentes');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FONCTION handleImageUploaded CORRIGÉE
  const handleImageUploaded = async (uploadResult) => {
    try {
      console.log('🚀 Image uploadée:', uploadResult);

      // Gestion des doublons
      if (uploadResult.isDuplicate && uploadResult.existingAnalysis) {
        const analysisData = {
          _id: uploadResult.imageId,
          originalName: uploadResult.filename,
          size: uploadResult.size,
          createdAt: uploadResult.uploadDate,
          forensicAnalysis: {
            authenticity: uploadResult.existingAnalysis.authenticity,
            manipulationDetection: uploadResult.existingAnalysis.manipulation,
            aiDetection: uploadResult.existingAnalysis.aiDetection,
            flags: uploadResult.existingAnalysis.flags
          }
        };
        
        setAnalysisData(analysisData);
        setCurrentView('results');
        alert('📋 Image identique détectée !');
        loadRecentImages();
        return;
      }

      // Attente de l'analyse
      let attempts = 0;
      const maxAttempts = 15; // Réduit pour éviter l'attente trop longue

      console.log('⏳ Attente de l\'analyse...');

      while (attempts < maxAttempts) {
        try {
          const status = await apiService.getImageStatus(uploadResult.imageId);
          console.log(`📊 Tentative ${attempts + 1}: Status = ${status.status}`);
          
          if (status.status === 'analyzed') {
            const imageDetails = await apiService.getImageDetails(uploadResult.imageId);
            console.log('✅ Analyse terminée avec succès');
            setAnalysisData(imageDetails);
            setCurrentView('results');
            loadRecentImages();
            return;
          } else if (status.status === 'error') {
            console.warn('⚠️ Erreur d\'analyse détectée');
            // Redirection vers galerie au lieu d'erreur
            setError('L\'analyse a échoué mais l\'image est sauvegardée. Vérifiez la galerie.');
            loadRecentImages();
            setCurrentView('gallery');
            return;
          }

          await new Promise(resolve => setTimeout(resolve, 2000));
          attempts++;
        } catch (statusError) {
          console.error('❌ Erreur statut:', statusError);
          attempts++;
        }
      }

      // Timeout - redirection galerie
      console.warn('⏰ Timeout atteint, redirection galerie');
      setError('L\'analyse prend trop de temps. L\'image est dans la galerie.');
      loadRecentImages();
      setCurrentView('gallery');
      
    } catch (error) {
      console.error('❌ Erreur globale upload:', error);
      setError(`Erreur: ${error.message}`);
      setCurrentView('upload');
    }
  };

  // ✅ FONCTION handleImageClick AJOUTÉE
  const handleImageClick = async (image) => {
    console.log('🖱️ Image cliquée:', image.filename);
    
    try {
      setLoading(true);
      const details = await apiService.getImageDetails(image.id);
      console.log('✅ Détails récupérés:', details);
      
      setAnalysisData(details);
      setCurrentView('results');
    } catch (error) {
      console.error('❌ Erreur chargement détails:', error);
      setError('Erreur lors du chargement des détails de l\'image');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    setAnalysisData(null);
    setCurrentView('upload');
    setError(null);
  };

  return (
    <div className="App">
      <CorrectedHeader 
        currentView={currentView}
        setCurrentView={setCurrentView}
        analysisData={analysisData}
        onBackToHome={handleBackToHome}
      />

      <main className="app-main">
        {error && (
          <div className="error-container">
            <h3>❌ Erreur</h3>
            <p>{error}</p>
            <button 
              className="btn-primary" 
              onClick={() => setError(null)}
            >
              Fermer
            </button>
          </div>
        )}

        {currentView === 'upload' && (
          <>
            <CorrectedUpload onImageUploaded={handleImageUploaded} />
            
            {recentImages.length > 0 && (
              <div className="recent-images">
                <h3>📸 Images récentes</h3>
                <div className="images-grid">
                  {recentImages.slice(0, 6).map((img) => (
                    <div 
                      key={img.id} 
                      className="image-card"
                      onClick={() => handleImageClick(img)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="image-info">
                        <h4 className="image-name">{img.filename}</h4>
                        <div className="image-status">
                          Status: <span className={`status-${img.status}`}>{img.status}</span>
                        </div>
                        {img.authenticityScore > 0 && (
                          <div className="image-score">
                            Authenticité: {img.authenticityScore}/100
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {currentView === 'gallery' && (
          <CorrectedGallery 
            recentImages={recentImages}
            loading={loading}
            onImageClick={handleImageClick}
          />
        )}

        {currentView === 'results' && (
          <CorrectedResults imageData={analysisData} />
        )}
      </main>

      <footer className="app-footer">
        <p>🛡️ Ba7ath Forensic Image Analysis - Détection avancée de manipulation et IA</p>
      </footer>
    </div>
  );
}

export default App;
