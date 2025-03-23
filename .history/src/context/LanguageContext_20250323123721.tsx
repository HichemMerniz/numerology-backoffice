import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'fr';

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
  'history.noData': {
    en: 'No history found. Try calculating a numerology profile.',
    fr: "Aucun historique trouvé. Essayez de calculer un profil de numérologie."
  },
  'history.viewDetails': {
    en: 'View Details',
    fr: 'Voir les Détails'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    if (!translations[key]) {
      return key;
    }
    return translations[key][language];
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