import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'fr';

type TranslationParams = {
  fallback?: string;
  [key: string]: string | number | undefined;
};

type Translations = {
  [key: string]: {
    en: string;
    fr: string;
  };
};

// Core translations for the application
const translations: Translations = {
  // Common
  'app.title': {
    en: 'Numerology Dashboard',
    fr: 'Tableau de Bord de Numérologie'
  },
  'app.logout': {
    en: 'Logout',
    fr: 'Déconnexion'
  },
  
  // Login Page
  'login.title': {
    en: 'Welcome Back',
    fr: 'Bienvenue à Nouveau'
  },
  'login.subtitle': {
    en: 'Enter your credentials to access your account',
    fr: 'Entrez vos identifiants pour accéder à votre compte'
  },
  'login.email': {
    en: 'Email',
    fr: 'Email'
  },
  'login.password': {
    en: 'Password',
    fr: 'Mot de passe'
  },
  'login.submit': {
    en: 'Sign In',
    fr: 'Se Connecter'
  },
  'login.rememberMe': {
    en: 'Remember me',
    fr: 'Se souvenir de moi'
  },
  'login.forgotPassword': {
    en: 'Forgot password?',
    fr: 'Mot de passe oublié?'
  },
  'login.noAccount': {
    en: "Don't have an account?",
    fr: "Vous n'avez pas de compte?"
  },
  'login.register': {
    en: "Register",
    fr: "S'inscrire"
  },
  'login.error': {
    en: 'Error',
    fr: 'Erreur'
  },
  'login.fillAllFields': {
    en: 'Please fill in all fields',
    fr: 'Veuillez remplir tous les champs'
  },
  'login.success': {
    en: 'Success',
    fr: 'Succès'
  },
  'login.welcomeBack': {
    en: 'Welcome back!',
    fr: 'Bienvenue à nouveau!'
  },
  'login.invalidCredentials': {
    en: 'Invalid credentials',
    fr: 'Identifiants invalides'
  },
  
  // Numerology Calculator
  'calculator.title': {
    en: 'Numerology Calculator',
    fr: 'Calculateur de Numérologie'
  },
  'calculator.description': {
    en: 'Enter a name and date of birth to calculate numerology values',
    fr: 'Entrez un nom et une date de naissance pour calculer les valeurs numériques'
  },
  'calculator.name': {
    en: 'Full Name',
    fr: 'Nom Complet'
  },
  'calculator.dob': {
    en: 'Date of Birth',
    fr: 'Date de Naissance'
  },
  'calculator.button': {
    en: 'Calculate Numerology',
    fr: 'Calculer la Numérologie'
  },
  
  // Results
  'results.title': {
    en: 'Numerology Results',
    fr: 'Résultats de Numérologie'
  },
  'results.lifePath': {
    en: 'Life Path Number',
    fr: 'Nombre du Chemin de Vie'
  },
  'results.expression': {
    en: 'Expression Number',
    fr: "Nombre d'Expression"
  },
  'results.soulUrge': {
    en: 'Soul Urge Number',
    fr: "Nombre d'Aspiration de l'Âme"
  },
  'results.generateReport': {
    en: 'Generate Report',
    fr: 'Générer un Rapport'
  },
  'results.generating': {
    en: 'Generating...',
    fr: 'Génération en cours...'
  },
  'results.downloadReport': {
    en: 'Download PDF Report',
    fr: 'Télécharger le Rapport PDF'
  },
  
  // History section
  'history.title': {
    en: 'Numerology History',
    fr: 'Historique de Numérologie'
  },
  'history.description': {
    en: 'View your past numerology calculations',
    fr: 'Consultez vos calculs de numérologie passés'
  },
  'history.totalReadings': {
    en: '{count} readings total',
    fr: '{count} lectures au total'
  },
  'history.name': {
    en: 'Name',
    fr: 'Nom'
  },
  'history.dob': {
    en: 'Date of Birth',
    fr: 'Date de Naissance'
  },
  'history.date': {
    en: 'Calculation Date',
    fr: 'Date de Calcul'
  },
  'history.actions': {
    en: 'Actions',
    fr: 'Actions'
  },
  'history.noData': {
    en: 'No history found. Try calculating a numerology profile.',
    fr: "Aucun historique trouvé. Essayez de calculer un profil de numérologie."
  },
  'history.viewDetails': {
    en: 'View Details',
    fr: 'Voir les Détails'
  },
  'history.downloadPdf': {
    en: 'Download PDF',
    fr: 'Télécharger PDF'
  },
  'history.deleteReading': {
    en: 'Delete Reading',
    fr: 'Supprimer la Lecture'
  },
  'history.calculatedOn': {
    en: 'Calculated on',
    fr: 'Calculé le'
  },
  'history.refresh': {
    en: 'Refresh',
    fr: 'Actualiser'
  },
  'history.tryAgain': {
    en: 'Try Again',
    fr: 'Réessayer'
  },
  'history.startCalculating': {
    en: 'Start by calculating a new numerology reading',
    fr: 'Commencez par calculer une nouvelle lecture de numérologie'
  },
  'history.error.title': {
    en: 'Error Loading History',
    fr: "Erreur de Chargement de l'Historique"
  },
  'history.error.description': {
    en: 'Could not load your numerology history. Please try again.',
    fr: "Impossible de charger votre historique de numérologie. Veuillez réessayer."
  },
  'history.pdfSuccess.title': {
    en: 'PDF Generated',
    fr: 'PDF Généré'
  },
  'history.pdfSuccess.description': {
    en: 'Your numerology report has been generated successfully.',
    fr: 'Votre rapport de numérologie a été généré avec succès.'
  },
  'history.pdfError.title': {
    en: 'PDF Generation Failed',
    fr: 'Échec de Génération du PDF'
  },
  'history.pdfError.description': {
    en: 'Failed to generate your numerology report. Please try again.',
    fr: 'Échec de génération de votre rapport de numérologie. Veuillez réessayer.'
  },
  'history.deleteSuccess.title': {
    en: 'Reading Deleted',
    fr: 'Lecture Supprimée'
  },
  'history.deleteSuccess.description': {
    en: 'The numerology reading has been deleted successfully.',
    fr: 'La lecture de numérologie a été supprimée avec succès.'
  },
  'history.deleteError.title': {
    en: 'Delete Failed',
    fr: 'Échec de Suppression'
  },
  'history.deleteError.description': {
    en: 'Failed to delete the numerology reading. Please try again.',
    fr: 'Échec de suppression de la lecture de numérologie. Veuillez réessayer.'
  },
  'history.deleteDialog.title': {
    en: 'Delete Reading',
    fr: 'Supprimer la Lecture'
  },
  'history.deleteDialog.description': {
    en: 'Are you sure you want to delete this numerology reading? This action cannot be undone.',
    fr: 'Êtes-vous sûr de vouloir supprimer cette lecture de numérologie? Cette action ne peut pas être annulée.'
  },
  'history.deleteDialog.cancel': {
    en: 'Cancel',
    fr: 'Annuler'
  },
  'history.deleteDialog.confirm': {
    en: 'Delete',
    fr: 'Supprimer'
  },
  'history.deleteDialog.deleting': {
    en: 'Deleting...',
    fr: 'Suppression...'
  },
  'history.pagination.showing': {
    en: 'Showing {start} to {end} of {total} readings',
    fr: 'Affichage de {start} à {end} sur {total} lectures'
  },
  'history.pagination.first': {
    en: 'First Page',
    fr: 'Première Page'
  },
  'history.pagination.previous': {
    en: 'Previous Page',
    fr: 'Page Précédente'
  },
  'history.pagination.next': {
    en: 'Next Page',
    fr: 'Page Suivante'
  },
  'history.pagination.last': {
    en: 'Last Page',
    fr: 'Dernière Page'
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: TranslationParams) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, params?: TranslationParams): string => {
    if (!translations[key]) {
      // Return fallback if provided, otherwise return the key
      return params?.fallback !== undefined ? params.fallback : key;
    }
    
    let text = translations[key][language];
    
    // Replace params if they exist
    if (params) {
      // Create a copy of params without the fallback
      const { fallback, ...restParams } = params;
      
      Object.keys(restParams).forEach(paramKey => {
        text = text.replace(`{${paramKey}}`, String(restParams[paramKey]));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 