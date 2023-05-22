export type Language = 'en' | 'nl' | '-';

export const parseLanguage = (lang: string): Language => {
  switch (lang.trim().toLowerCase()) {
    case 'engels':
    case 'english':
    case 'en':
      return 'en';
    case 'vlaams':
    case 'be':
    case 'nederlands':
    case 'nl':
    case 'dutch':
    case 'flemish':
      return 'nl';
    default:
      return '-';
  }
};
