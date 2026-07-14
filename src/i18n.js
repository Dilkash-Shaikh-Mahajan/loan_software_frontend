import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import hiTranslation from './locales/hi.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  hi: {
    translation: hiTranslation,
  },
};

// Check localStorage for preferred language if on the client side
let defaultLng = 'en';
if (typeof window !== 'undefined') {
  defaultLng = localStorage.getItem('apex-language') || 'en';
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLng,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
