export type Language = 'en' | 'nl' | '-';

export const parseLanguage = (lang: string): Language => {
  switch (lang) {
    case 'en':
      return 'en';
    case 'nl':
      return 'nl';
    default:
      return '-';
  }
};
