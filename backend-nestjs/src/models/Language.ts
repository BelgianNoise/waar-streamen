export type Language = 'en' | 'nl-nl' | 'nl-be' | '-';

export const parseLanguage = (lang: string): Language => {
  switch (lang.trim().toLowerCase()) {
    case 'engels':
    case 'english':
    case 'en':
      return 'en';
    case 'vlaams':
    case 'be':
    case 'flemish':
      return 'nl-be';
    case 'nederlands':
    case 'nl':
    case 'dutch':
      return 'nl-nl';
    default:
      return '-';
  }
};
